import "./scss/index.scss";

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import ReactSVG from "react-svg";
import { commonMessages } from "@temp/intl";
import Menu from 'react-burger-menu/lib/menus/bubble'

import { baseUrl } from "../../app/routes";
import NavItem, { INavItem } from "./NavItem";

import logoImg from "../../images/logo.svg";
import backImg from "../../images/arrow-back.svg";

interface NavListProps {
  items: INavItem[];
}

interface NavListState {
  parent: INavItem | null;
  displayedItems: INavItem[];
  menuOpen: boolean;
  transInactive: boolean;
}

class NavList extends React.PureComponent<NavListProps, NavListState> {
  state: NavListState = {
    displayedItems: this.props.items,
    parent: null,
    menuOpen: false,
    transInactive: false,
  };

  handleStateChange = (state) => {
    this.setState({ menuOpen: state.isOpen });
  }

  closeMenu = () => {
    this.setState({ menuOpen: false, transInactive: false, parent: null, displayedItems: this.props.items });
  }

  handleShowSubItems = (item: INavItem) => {
    this.setState({ parent: item, displayedItems: item.children, transInactive: true });
  };

  handleGoBack = () => {
    const grandparent = this.state.parent.parent;

    if (!grandparent) {
      this.setState({ parent: null, displayedItems: this.props.items, transInactive: false });
    } else {
      const newParent = this.findItemById(grandparent.id);
      this.setState({
        displayedItems: newParent.children,
        parent: newParent,
      });
    }
  };

  findItemById(id: string): INavItem {
    let match = null;
    function find(item) {
      if (item.id === id) {
        match = item;
        return true;
      }
      return item.children && item.children.some(find);
    }
    this.props.items.some(find);
    return match;
  }

  render() {
    const { displayedItems, parent } = this.state;

    return (
      <Menu
        noTransition={this.state.transInactive}
        isOpen={this.state.menuOpen}
        onClose={this.closeMenu}
        onStateChange={state => this.handleStateChange(state)}
      >
        {parent ? (
          <span
            className="side-nav__menu-item side-nav__menu-item-back"
            onClick={this.handleGoBack}
          >
            <ReactSVG path={backImg} /> {parent.name}
          </span>
        ) : (
          <>
            <Link
              to={baseUrl}
              className="side-nav__menu-item-logo"
              onClick={this.closeMenu}
            >
              <ReactSVG path={logoImg} />
            </Link>

            <Link
              to={baseUrl}
              className="side-nav__menu-item-link"
              onClick={this.closeMenu}
            >
              <FormattedMessage {...commonMessages.home} />
            </Link>
          </>
        )}
        {displayedItems.map(item => (
          <NavItem
            key={item.id}
            showSubItems={this.handleShowSubItems}
            closeMenu={this.closeMenu}
            {...item}
          />
        ))}
      </Menu>
    );
  }
}

export default NavList;
