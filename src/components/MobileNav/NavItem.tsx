import classNames from "classnames";
import * as React from "react";
import ReactSVG from "react-svg";

import { NavLink } from "..";
import { MainMenuSubItem } from "../MainMenu/gqlTypes/MainMenuSubItem";

import subcategoriesImg from "../../images/subcategories.svg";;

export interface INavItem extends MainMenuSubItem {
  children?: INavItem[];
}

interface NavItemProps extends INavItem {
  showSubItems(item: INavItem): void;
  closeMenu(): void;
}

const NavItem: React.FC<NavItemProps> = ({
  showSubItems,
  closeMenu,
  ...item
}) => {
  const hasSubNavigation = item.children && !!item.children.length;

  return (
    <li
      className={classNames({
        "side-nav__menu-item": true,
        "side-nav__menu-item--has-subnavigation": hasSubNavigation,
      })}
    >
      <NavLink
        item={item}
        className="side-nav__menu-item-link"
        onClick={() => closeMenu()}
      />
      {hasSubNavigation && (
        <ReactSVG
          path={subcategoriesImg}
          className="side-nav__menu-item-more"
          onClick={() => showSubItems(item)}
        />
      )}
    </li>
  );
};

export default NavItem;
