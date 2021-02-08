import React, { Component } from "react";
import Nav from "@rsuite/responsive-nav";
import NavLink from "./NavLink";

class Navbar extends Component {
  get_items() {
    return this.props.children.map(item => <NavLink key={item} item={item} />);
  }

  render() {
    return <Nav moreText="Más">{this.get_items()}</Nav>;
  }
}

export default Navbar;
