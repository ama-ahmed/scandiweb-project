import { connect } from "react-redux";
import { Component } from "react";
import gql from "graphql-tag";
import { client } from "../../App";
import { addToCart } from "../../store/cartSlice";
// import { Markup } from "interweave";
import parse from 'html-react-parser';

import classes from "./productPage.module.css";
import Attributes from "./attributes";

const myQuery = gql`
  query getProductById($productId: String!) {
    product(id: $productId) {
      id
      name
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      prices {
        currency {
          symbol
        }
        amount
      }
      brand
    }
  }
`;

class ProductPage extends Component {
  product = {};

  constructor() {
    super();
    this.state = { currentImage: "", attributes: [] };
  }

  defaultAttributes = () => {
    const attributesValue = this.product.inStock
      ? this.product.attributes.map(({ name, items }) => ({
          [name]: items[0].value,
        }))
      : [];
    this.setState({
      attributes: [...attributesValue],
    });
  };

  async fetchProductById() {
    const result = await client.query({
      query: myQuery,
      variables: {
        productId: this.props.path,
      },
    });
    this.product = { ...result.data.product };
  }

  componentDidMount() {
    this.fetchProductById().then(() => {
      this.defaultAttributes();
    });
  }

  addToCart() {
    const { attributes } = this.state;
    const currentProducts = [...this.props.products];
    const product = { ...this.product };
    let counter = 0;

    currentProducts.some((currentProduct) => currentProduct.id === product.id)
      ? currentProducts.forEach((currentProduct, index) => {
          if (currentProduct.id === product.id) {
            if (
              JSON.stringify([...attributes]) ===
              JSON.stringify([...currentProduct.attributesValue])
            ) {
              currentProducts.splice(index, 1, {
                ...currentProducts[index],
                quantity: currentProducts[index].quantity + 1,
              });
            } else {
              counter++;
            }
          }
        })
      : currentProducts.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          attributesValue: attributes,
          attributes: product.attributes,
          gallery: product.gallery,
          prices: product.prices,
          quantity: 1,
        });

    const uniqueProduct = [];
    currentProducts.forEach(
      (currentProduct) =>
        currentProduct.id === product.id &&
        uniqueProduct.push(currentProduct.id)
    );

    counter === uniqueProduct.length &&
      currentProducts.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        attributesValue: attributes,
        attributes: product.attributes,
        gallery: product.gallery,
        prices: product.prices,
        quantity: 1,
      });

    this.props.addToCart(currentProducts);
  }

  changeImage = (event) => {
    this.setState({ currentImage: event.target.src });
  };

  changeAttribute = (name, value) => {
    const attributes = [...this.state.attributes];
    const check = attributes?.some(
      (attribute) =>
        Object.keys(attribute)[0] === name &&
        Object.values(attribute)[0] === value
    );
    if (!check) {
      attributes.forEach((_, index) => {
        Object.keys(attributes[index])[0] === name &&
          attributes.splice(index, 1, { [name]: value });
      });
      this.setState({ attributes });
    } else {
      return;
    }
  };

  render() {
    const { name, brand, gallery, attributes, prices, inStock, description } =
      this.product;

    const { currentCurrency } = this.props;

    const itemPrice = prices?.find(
      ({ currency }) => currency.symbol === currentCurrency
    );

    const { currentImage } = this.state;
    return (
      <section
        className={`${classes.section__productPage} ${
          !inStock && classes.outOfStock
        }`}
      >
        <ul className={classes.ul__img}>
          {gallery?.map((image, index) => (
            <li className={classes.li__img} key={index}>
              <img
                alt="other img for product"
                className={classes.img__product}
                src={image}
                onClick={this.changeImage}
              />
            </li>
          ))}
        </ul>

        <div className={classes.div__preview}>
          {gallery && (
            <img
              alt="product current img"
              className={classes.img__main}
              src={currentImage || gallery[0]}
            />
          )}
          {!inStock && <p className={classes.p__outOfStock}>OUT OF STOCK</p>}
        </div>

        <div className={classes.div__details}>
          <p className={classes.p__brand}>{brand}</p>
          <p className={classes.p__name}>{name}</p>
          <Attributes
            attributes={attributes}
            attributesValue={this.state.attributes}
            changeAttribute={this.changeAttribute}
            inStock={inStock}
            pageType={"page"}
          />
          <p className={classes.p__price}>Price:</p>
          <p className={classes.p__priceValue}>
            {currentCurrency}
            {itemPrice?.amount.toFixed(2)}
          </p>
          <button
            className={`${classes.cartButton} ${
              !inStock && classes.cartButton__outOfStock
            }`}
            onClick={() => inStock && this.addToCart()}
          >
            ADD TO CART
          </button>

          <div className={`${classes.p__description} productPage-description`}>
            {/* method one */}
            {/* {document.querySelector('.productPage-description')?.insertAdjacentHTML('beforeend', description)} */}
            {/* method two */}
            {/* <Markup content={description} /> */}
            {/* method three */}
            {parse(`${description}`)}
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  currentCurrency: state.cart.currentCurrency,
  products: state.cart.products,
});

export default connect(mapStateToProps, { addToCart })(ProductPage);
