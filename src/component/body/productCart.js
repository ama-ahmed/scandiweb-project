import { Component } from "react";
import { connect } from "react-redux";
import { addToCart } from "../../store/cartSlice";

import classesPageType from "./pageProductCart.module.css";
import classescartIconType from "./cartIconProductCart.module.css";
import Attributes from "./attributes";
import { ReactComponent as ArrowSvg } from "../../icons/arrow.svg";

class productCart extends Component {
  constructor() {
    super();
    this.state = { imgIndex: 0 };
  }

  componentDidMount() {
    this.setState({ image: this.props.gallery[0] });
  }

  changeQuantity(operator) {
    const { id, attributes, attributesValue } = this.props;
    const currentProducts = [...this.props.products];

    currentProducts.forEach((currentProduct, index) => {
      if (currentProduct.id === id) {
        if (
          JSON.stringify([...attributesValue]) ===
          JSON.stringify([...currentProduct.attributesValue])
        ) {
          if (operator === "increment") {
            currentProducts.splice(index, 1, {
              ...currentProducts[index],
              quantity: currentProducts[index].quantity + 1,
            });
          } else {
            if (currentProducts[index].quantity > 1) {
              currentProducts.splice(index, 1, {
                ...currentProducts[index],
                quantity: currentProducts[index].quantity - 1,
              });
            } else {
              currentProducts.splice(index, 1);
            }
          }
        }
      }
    });

    this.props.addToCart(currentProducts);
  }

  changeImage(direction) {
    const { imgIndex } = this.state;
    const { gallery } = this.props;
    direction === "right"
      ? this.setState({
          imgIndex: gallery.length <= imgIndex + 1 ? 0 : imgIndex + 1,
        })
      : this.setState({
          imgIndex: imgIndex === 0 ? gallery.length - 1 : imgIndex - 1,
        });
  }

  render() {
    const {
      brand,
      name,
      prices,
      attributes,
      attributesValue,
      currentCurrency,
      gallery,
      pageType,
      isCartPage
    } = this.props;

    let classes;
    pageType === "page"
      ? (classes = classesPageType)
      : (classes = classescartIconType);

    const itemPrice = prices?.find(
      ({ currency }) => currency.symbol === currentCurrency
    );
    return (
      <li className={classes.productCart__container}>
        <div className={classes.productCart__itemDetails}>
          <p className={classes.productCart__brand}>{brand}</p>
          <p className={classes.productCart__name}>{name}</p>
          <p className={classes.productCart__price}>
            {currentCurrency}
            {itemPrice.amount}
          </p>

          <Attributes
            attributes={attributes}
            attributesValue={attributesValue}
            pageType={pageType}
            isCartPage={isCartPage}
          />
        </div>

        <div className={classes.productCart__counterChangeButtons}>
          <div
            className={classes.productCart__icrementButton}
            onClick={() => this.changeQuantity("increment")}
          >
            &#65291;
          </div>
          {this.props.quantity}
          <div
            className={classes.productCart__decrementButton}
            onClick={() => this.changeQuantity("decrement")}
          >
            &mdash;
          </div>
        </div>

        <div className={classes.productCart__imgContainer}>
          <img
            className={classes.productCart__img}
            src={gallery[this.state.imgIndex]}
          />
          {pageType === "page" && gallery.length > 1 && (
            <>
              <ArrowSvg
                className={classes.productCart__swapLeft}
                onClick={() => this.changeImage("left")}
              />
              <ArrowSvg
                className={classes.productCart__swapRight}
                onClick={() => this.changeImage("right")}
              />
            </>
          )}
        </div>
      </li>
    );
  }
}

const mapStateToProps = (state) => ({
  products: state.cart.products,
});

export default connect(mapStateToProps, { addToCart })(productCart);
