import { Component } from "react";
import { connect } from "react-redux";

import ProductCart from "./productCart";
import classes from "./cartPage.module.css";

class cartPage extends Component {
  render() {
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
      <div className={classes.cardPage__container}>
        <h1 className={classes.cardPage__title}>CART</h1>
        <ul className={classes.cartPage__itemDetails}>
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
                pageType={"page"}
                isCartPage={true}
              ></ProductCart>
            )
          )}
        </ul>

        <p className={classes.cartPage__taxAndQuantity}>
          <span>Tax 21%:&ensp;</span>
          <span className={classes.cartPage__taxAmountAndQuantity}>
            {currentCurrency}
            {(totalprice * 0.21).toFixed(2)}
          </span>
        </p>
        <p className={classes.cartPage__taxAndQuantity}>
          <span>Quantity:&nbsp;</span>
          <span className={classes.cartPage__taxAmountAndQuantity}>
            {totalProducts}
          </span>
        </p>
        <p className={classes.cartPage__totalPrice}>
          <span>Total:&ensp;&ensp;&ensp;</span>
          <span className={classes.cartPage__taxAmountAndQuantity}>
            {currentCurrency}
            {totalprice.toFixed(2)}
          </span>
        </p>
        <button className={classes.cartPage__orderButton}>ORDER</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentCurrency: state.cart.currentCurrency,
  products: state.cart.products,
});

export default connect(mapStateToProps)(cartPage);
