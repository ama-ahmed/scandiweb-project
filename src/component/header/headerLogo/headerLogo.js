import { Component } from "react";


import { ReactComponent as LogoSvg } from "../../../icons/logo.svg";
import classes from "./headerLogo.module.css";

class HeaderLogo extends Component {
  render() {
    return (
        <LogoSvg className={classes.logo} />
    );
  }
}

export default HeaderLogo;
