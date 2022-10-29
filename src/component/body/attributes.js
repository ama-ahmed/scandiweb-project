import { Component } from "react";

import classesPageType from "./pageAttributes.module.css";
import classescartIconType from "./cartIconAttributes.module.css";

class Attributes extends Component {
  activeClasse(value, name, attributesValue) {
    return attributesValue.some(
      (attribute) =>
        Object.keys(attribute)[0] === name &&
        Object.values(attribute)[0] === value
    )
      ? true
      : false;
  }

  swatchStyle(value, cartPage) {
    let style;

    cartPage
      ? (style = {
          backgroundColor: value,
          border: value === "#FFFFFF" && "1px solid black",
          cursor: "default",
        })
      : (style = {
          backgroundColor: value,
          border: value === "#FFFFFF" && "1px solid black",
        });

    return style;
  }

  textStyle(cartPage) {
    let style;

    cartPage
      ? (style = {
          cursor: "default",
        })
      : (style = {
        });

    return style;
  }

  render() {
    const {
      attributes,
      attributesValue,
      changeAttribute,
      inStock,
      pageType,
      isCartPage,
    } = this.props;

    let classes;
    pageType === "page"
      ? (classes = classesPageType)
      : (classes = classescartIconType);

    return (
      <ul className={classes.attr__container}>
        {attributes?.map(({ id, name, items, type }) => (
          <li key={id}>
            <p className={classes.attr__name}>{name}:</p>
            <ul className={classes.attr__type}>
              {items.map(({ id, value }) =>
                type === "swatch" ? (
                  <li
                    style={this.swatchStyle(value, isCartPage)}
                    className={`${classes.attr__swatchType} ${
                      this.activeClasse(value, name, attributesValue) &&
                      classes.attr__swatchType__active
                    }`}
                    key={id}
                    onClick={() => inStock && changeAttribute(name, value)}
                  />
                ) : (
                  <li
                    style={this.textStyle(isCartPage)}
                    className={`${classes.attr__textType} ${
                      this.activeClasse(value, name, attributesValue) &&
                      classes.attr__textType__active
                    }`}
                    key={id}
                    onClick={() => inStock && changeAttribute(name, value)}
                  >
                    {value}
                  </li>
                )
              )}
            </ul>
          </li>
        ))}
      </ul>
    );
  }
}

export default Attributes;
