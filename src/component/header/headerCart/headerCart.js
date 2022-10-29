import { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { ReactComponent as CartSvg } from "../../../icons/cart.svg";
import ProductCart from "../../body/productCart";
import classes from "./headerCart.module.css";

class HeaderCart extends Component {
  constructor() {
    super();

    this.state = { open: false };
  }

  openCloseCartList = () => {
    this.setState((prevState) => ({ open: !prevState.open }));
  };

  render() {
    const { open } = this.state;
    const { currentCurrency, products } = this.props;

    const totalProducts = products.reduce((cumProductsNum, product) => {
      return cumProductsNum + product.quantity;
    }, 0);

    const totalprice = products.reduce((cumPrice, product) => {
      product.prices.forEach(({ currency, amount }) => {
        if (currency.symbol === currentCurrency) {
          cumPrice = cumPrice + amount * product.quantity;
        }
      });
      return cumPrice;
    }, 0);

    return (
      <div className={classes.cart__container} onClick={this.openCloseCartList}>
        <CartSvg className={classes.cart__icon} />
        <p className={classes.cart__counter}>{totalProducts}</p>

        {open && (
          <>
            <div className={classes.cart__overlay} />

            <div
              className={classes.cart__itemsList}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={classes.cart__itemsList__container}>
                <p className={classes.cart__itemsNumber}>
                  My Bag, {totalProducts} items
                </p>

                <ul className={classes.cart__itemDetails}>
                  {products.map(
                    (
                      {
                        id,
                        brand,
                        name,
                        prices,
                        attributes,
                        attributesValue,
                        gallery,
                        quantity,
                      },
                      index
                    ) => (
                      <ProductCart
                        key={index}
                        id={id}
                        brand={brand}
                        name={name}
                        currentCurrency={currentCurrency}
                        prices={prices}
                        attributes={attributes}
                        attributesValue={attributesValue}
                        gallery={gallery}
                        quantity={quantity}
                        pageType={"cartIcon"}
                      ></ProductCart>
                    )
                  )}
                </ul>

                <p className={classes.cart__totalPrice}>
                  Total
                  <span className={classes.cart__totalPrice__details}>
                    {currentCurrency}
                    {totalprice.toFixed(2)}
                  </span>
                </p>
              </div>
              <div className={classes.cart__buttonDiv}>
                <Link
                  to={`/cart`}
                  onClick={() => this.openCloseCartList()}
                  className={classes.cart__cartPageButton}
                >
                  VIEW BAG
                </Link>
                <button className={classes.cart__chechOutButton}>
                  CHECK OUT
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentCurrency: state.cart.currentCurrency,
  products: state.cart.products,
});

export default connect(mapStateToProps)(HeaderCart);
