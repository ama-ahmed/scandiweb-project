import { Component } from "react";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Route, Switch, Redirect } from "react-router-dom";

import Header from "./component/header/header";
import Category from "./component/body/product";
import ProductPage from "./component/body/productPage";
import CardPage from "./component/body/cardPage";

export const client = new ApolloClient({
  uri: "https://scandiweb-end-point.up.railway.app/",
  cache: new InMemoryCache({
    dataIdFromObject: (o) => (o._id ? `${o.__typename}:${o._id}` : null),
  }),
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <>
          <Header />
          <Switch>
            <Route
              exact
              path="/category/:category"
              render={(props) => (
                <Category
                  path={props.match.params.category}
                  historyPush={props.history.push}
                />
              )}
            />

            <Route
              exact
              path="/category/:category/:id"
              render={(props) => (
                <ProductPage
                  path={props.match.params.id}
                  historyPush={props.history.push}
                />
              )}
            />

            <Route exact path="/cart">
              <CardPage />
            </Route>

            <Route path="*">
              <Redirect to="/category/all" />
            </Route>
          </Switch>
        </>
      </ApolloProvider>
    );
  }
}

export default App;
