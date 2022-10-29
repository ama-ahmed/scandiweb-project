import { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import ProductList from "./productList";

import classes from "./product.module.css";

const myQuery = gql`
  query getProductsByCategory($categoryName: String!) {
    category(input: { title: $categoryName }) {
      products {
        id
        name
        inStock
        gallery
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
  }
`;

class Category extends Component {
  categoryName() {
    const categoryName = this.props.path;
    const capitalized = categoryName[0].toUpperCase() + categoryName.slice(1);
    return capitalized;
  }
  render() {
    return (
      <>
        <h2 className={classes.h2__Product}>{this.categoryName()}</h2>
        <Query query={myQuery} variables={{ categoryName: this.props.path }}>
          {({ loading, error, data }) => {
            if (loading) return;
            if (error) return;
            return (
              <ul className={classes.ul__Product}>
                {data.category.products.map(
                  ({
                    id,
                    gallery,
                    name,
                    brand,
                    prices,
                    attributes,
                    inStock,
                    category,
                  }) => (
                    <ProductList
                      category={category}
                      historyPush={this.props.historyPush}
                      key={id}
                      id={id}
                      gallery={gallery}
                      brand={brand}
                      name={name}
                      prices={prices}
                      attributes={attributes}
                      inStock={inStock}
                    />
                  )
                )}
              </ul>
            );
          }}
        </Query>
      </>
    );
  }
}

export default Category;
