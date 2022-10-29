import { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { NavLink } from "react-router-dom";

import classes from "./headerNav.module.css";

const myQuery = gql`
  query {
    categories {
      name
    }
  }
`;

class HeaderNav extends Component {
  render() {
    return (
      <>
        <Query query={myQuery}>
          {({ loading, error, data }) => {
            if (loading) return;
            if (error) return;
            return (
              <ul  className={classes.ul__nav}>
                {data.categories.map(({ name }, index) => (
                  <NavLink
                    key={index}
                    activeClassName={classes.active}
                    className={classes.navLink}
                    to={`/category/${name}`}
                  >
                    {name}
                  </NavLink>
                ))}
              </ul>
            );
          }}
        </Query>
      </>
    );
  }
}

export default HeaderNav;
