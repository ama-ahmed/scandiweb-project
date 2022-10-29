import { Component } from "react";

import classes from "./swatchAttributes.module.css";

class SwatchAttributes extends Component {
  activeClasse(value, name, attributesValue) {
    return attributesValue.some(
      (attribute) =>
        Object.keys(attribute)[0] === name &&
        Object.values(attribute)[0] === value
    )
      ? true
      : false;
  }

  render() {
    const { attributes, attributesValue } = this.props;

    return (
      <div className={classes.attr__container}>
        {attributes?.map(
          ({ id,name, items, type }) =>
            type === "swatch" && (
              <ul className={classes.attr__type} key={id} >
                {items.map(({ id, value }) => (
                  <li
                    style={{
                      backgroundColor: value,
                      border: value === "#FFFFFF" && "1px solid black",
                    }}
                    className={`${classes.attr__swatchType} ${
                      this.activeClasse(value, name, attributesValue) &&
                      classes.attr__swatchType__active
                    }`}
                    key={id}
                  />
                ))}
              </ul>
            )
        )}
      </div>
    );
  }
}

export default SwatchAttributes;
