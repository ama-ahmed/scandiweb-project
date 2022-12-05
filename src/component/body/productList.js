import { connect } from "react-redux";
import { Component } from "react";
import { addToCart } from "../../store/cartSlice";

import classes from "./productList.module.css";
import { ReactComponent as CartButton } from "../../icons/cartButton.svg";
import SwatchAttributes from "./swatchAttributes";

export class ProductList extends Component {
  constructor() {
    super();
    this.state = { attributes: [] };
  }

  defaultAttributes = () => {
    const attributesValue = this.props.inStock
      ? this.props.attributes.map(({ name, items }) => ({
          [name]: items[0].value,
        }))
      : [];
    this.setState({
      attributes: [...attributesValue],
    });
  };

  componentDidMount() {
    this.defaultAttributes();
  }

  addToCart(id, gallery, brand, name, prices, itemAttributes) {
    const attributes = this.state.attributes;
    const currentProducts = [...this.props.products];
    let counter = 0;

    currentProducts.some((currentProduct) => currentProduct.id === id)
      ? currentProducts.forEach((currentProduct, index) => {
          if (currentProduct.id === id) {
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

              //=====Bad code (low efficiency)=========

              // const check = currentProducts.some(
              //   (currentProduct) =>
              //     JSON.stringify([...attributes]) ===
              //     JSON.stringify([...currentProduct.attributesValue])
              // );
              // if (!check) {
              //   currentProducts.push({
              //     id,
              //     name,
              //     brand,
              //     attributesValue: attributes,
              //     attributes: itemAttributes,
              //     gallery,
              //     prices,
              //     quantity: 1,
              //   });
              //   return;
              // }
            }
          }
        })
      : currentProducts.push({
          id,
          name,
          brand,
          attributesValue: attributes,
          attributes: itemAttributes,
          gallery,
          prices,
          quantity: 1,
        });

    const uniqueProduct = [];
    currentProducts.forEach(
      (currentProduct) =>
        currentProduct.id === id && uniqueProduct.push(currentProduct.id)
    );

    counter === uniqueProduct.length &&
      currentProducts.push({
        id,
        name,
        brand,
        attributesValue: attributes,
        attributes: itemAttributes,
        gallery,
        prices,
        quantity: 1,
      });

    this.props.addToCart(currentProducts);
  }

  navigateToItemPage = (event, id) => {
    if (event.target.parentNode.tagName !== "svg") {
      this.props.historyPush(`/category/${this.props.category}/${id}`);
    }
  };

  render() {
    const {
      id,
      name,
      brand,
      gallery,
      attributes,
      prices,
      inStock,
      currentCurrency,
    } = this.props;

    const itemPrice = prices?.find(
      ({ currency }) => currency.symbol === currentCurrency
    );

    return (
      <li
        className={`${classes.li__productList} ${
          !inStock && classes.outOfStock
        }`}
      >
        <div
          onClick={(event) => this.navigateToItemPage(event, id)}
          className={`${classes.link__productList} ${
            !inStock && classes.outOfStock
          }`}
        >
          <div className={classes.img__container__productList}>
            <img src={gallery[0]} className={classes.img__productList} alt="product img"/>
            {!inStock && <p className={classes.p__outOfStock}>OUT OF STOCK</p>}

            <CartButton
              className={classes.cartButton}
              onClick={() =>
                inStock &&
                this.addToCart(id, gallery, brand, name, prices, attributes)
              }
            />
          </div>

          <p className={classes.p__nameAndBrand}>
            {brand} {name}
          </p>
          <div className={classes.p__price}>
            <p>
              {currentCurrency}
              {itemPrice.amount.toFixed(2)}
            </p>
            <SwatchAttributes
              attributes={attributes}
              attributesValue={this.state.attributes}
            />
          </div>
        </div>
      </li>
    );
  }
}

const mapStateToProps = (state) => ({
  currentCurrency: state.cart.currentCurrency,
  products: state.cart.products,
});

export default connect(mapStateToProps, { addToCart })(ProductList);
