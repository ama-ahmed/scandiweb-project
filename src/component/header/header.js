import { Component } from "react";

import HeaderLogo from "./headerLogo/headerLogo";
import HeaderNav from "./headerNav/headerNav";
import HeaderCurrency from "./headerCurrency/headerCurrency";
import HeaderCart from "./headerCart/headerCart";
import classes from "./header.module.css";

class Header extends Component {
  render() {
    return (
      <header className={classes.header}>
        <HeaderLogo />
        <HeaderNav />
        <HeaderCurrency />
        <HeaderCart />
      </header>
    );
  }
}

export default Header;
