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

  getDropdownItems(props) {
    function link(url, subitem) {
      return (
        <Link to={url}>
          <Dropdown.Item>{subitem.name}</Dropdown.Item>
        </Link>
      );
    }
    const subitems = this.children.map(subitem => {
      if (subitem.url) {
        return <Dropdown.Item href={subitem.url}>{subitem.name}</Dropdown.Item>;
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
    return this.getDropdown(subitems, props);
  }

  getDropdown(subitems, props) {
    const link = url => (
      <Link to={url} {...props}>
        <Dropdown title={this.name} trigger="hover">
          {subitems}
        </Dropdown>
      </Link>
    );
    if (this.url) {
      return (
        <Dropdown title={this.name} trigger="hover" href={this.url} {...props}>
          {subitems}
        </Dropdown>
      );
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

    return (
      <Dropdown title={this.name} trigger="hover" {...props}>
        {subitems}
      </Dropdown>
    );
  }

  getNavItem(props) {
    const link = url => (
      <Link to={url} {...props}>
        <Nav.Item>{this.name}</Nav.Item>
      </Link>
    );
    if (this.url) {
      return (
        <Nav.Item href={this.url} {...props}>
          {this.name}
        </Nav.Item>
      );
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
