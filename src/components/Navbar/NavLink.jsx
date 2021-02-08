import * as React from "react";
import { Link } from "react-router-dom";
import Nav from "@rsuite/responsive-nav";
import { Dropdown } from "rsuite";

import {
  generateCategoryUrl,
  generateCollectionUrl,
  generatePageUrl,
} from "../../core/utils";

class NavLink extends React.Component {
  constructor(item, ...props) {
    super(item, ...props);
    this.name = item.item.name;
    this.url = item.item.url;
    this.category = item.item.category;
    this.collection = item.item.collection;
    this.page = item.item.page;
    this.children = item.item.children;
  }

  // eslint-disable-next-line react/sort-comp
  routerLink(props) {
    return <Link to={props.url} {...props} />;
  }

  getDropdownItems(props) {
    const link = (url, subitem) => (
      <Dropdown.Item
        key={subitem.id}
        componentClass={this.routerLink}
        url={url}
        {...props}
      >
        {subitem.name}
      </Dropdown.Item>
    );

    const subitems = this.children.map(subitem => {
      if (subitem.url) {
        return (
          <Dropdown.Item key={subitem.name} href={subitem.url}>
            {subitem.name}
          </Dropdown.Item>
        );
      }
      if (subitem.category) {
        return link(
          generateCategoryUrl(subitem.category.id, subitem.category.name),
          subitem
        );
      }
      if (subitem.collection) {
        return link(
          generateCollectionUrl(subitem.collection.id, subitem.collection.name),
          subitem
        );
      }
      if (subitem.page) {
        return link(generatePageUrl(subitem.page.slug), subitem);
      }

      return <Dropdown.Item>{subitem.name}</Dropdown.Item>;
    });
    return (
      <Dropdown title={this.name} trigger="hover" {...props}>
        {subitems}
      </Dropdown>
    );
  }

  getNavItem(props) {
    const link = url => (
      <Nav.Item componentClass={this.routerLink} url={url} {...props}>
        {this.name}
      </Nav.Item>
    );

    if (this.url) {
      return link(this.url);
    }
    if (this.category) {
      return link(generateCategoryUrl(this.category.id, this.category.name));
    }
    if (this.collection) {
      return link(
        generateCollectionUrl(this.collection.id, this.collection.name)
      );
    }
    if (this.page) {
      return link(generatePageUrl(this.page.slug));
    }
    return <Nav.Item {...props}>{this.name}</Nav.Item>;
  }

  render() {
    return this.children.length
      ? this.getDropdownItems(this.props)
      : this.getNavItem(this.props);
  }
}

export default NavLink;
