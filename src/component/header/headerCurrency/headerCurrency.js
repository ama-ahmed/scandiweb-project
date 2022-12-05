import { Component } from "react";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { client } from "../../../App";
import { setCurrency } from "../../../store/cartSlice";
import Transition from "react-transition-group/Transition";

import { ReactComponent as ArrowSvg } from "../../../icons/arrow.svg";
import classes from "./headerCurrency.module.css";

const myQuery = gql`
  query {
    currencies {
      label
      symbol
    }
  }
`;

class HeaderCurrency extends Component {
  constructor() {
    super();
    this.state = { currencies: [], currency: "", open: false };
  }

  async fetchCurrencies() {
    const result = await client.query({
      query: myQuery,
    });

    this.setState({
      currencies: [...result.data.currencies],
    });
  }

  componentDidMount() {
    this.fetchCurrencies();
  }

  openCloseCurrenciesList = () => {
    this.setState((prevState) => ({ open: !prevState.open }));
  };

  changeCurrency = (event) => {
    this.setState({ currency: event.target.firstChild.textContent });
    this.props.setCurrency(event.target.firstChild.textContent);
  };

  render() {
    const { currencies, currency, open } = this.state;
    return (
      <div
        className={classes.currency__container}
        onClick={this.openCloseCurrenciesList}
      >
        <p className={classes.currency__icon}>
          {currency || this.props.currentCurrency}
        </p>
        <ArrowSvg
          className={`${classes.currency__arrow} ${
            open && classes.currency__arrow__open
          }`}
        />
        {/* {open && ( */}
        <Transition in={open} timeout={500} mountOnEnter unmountOnExit>
          {(state) => (
            <>
              <div className={classes.currencies__overlay} />
              <ul
                className={`${classes.currency__ul} ${
                  state === "entering"
                    ? classes.openHeaderCurrency
                    : state === "exiting"
                    ? classes.closeHeaderCurrency
                    : null
                }`}
              >
                {currencies.map(({ label, symbol }, index) => (
                  <li
                    className={classes.currency__value}
                    key={index}
                    onClick={this.changeCurrency}
                  >
                    {symbol} {label}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Transition>
        {/* )} */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentCurrency: state.cart.currentCurrency,
});

export default connect(mapStateToProps, { setCurrency })(HeaderCurrency);
