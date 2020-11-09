import React, {useEffect, useState, useRef} from "react";
import { FormattedMessage } from "react-intl";
import { commonMessages } from "@temp/intl";
import { useAuth, useCart } from "@saleor/sdk";

import Media from "react-media";
import { Link } from "react-router-dom";
import ReactSVG from "react-svg";

import {
  MenuDropdown,
  Offline,
  Online,
  OverlayContext,
  OverlayTheme,
  OverlayType,
} from "..";
import * as appPaths from "../../app/routes";
import { maybe } from "../../core/utils";
import {MobileNavList} from "../"
import Navbar from "../Navbar/Navbar";
import { TypedMainMenuQuery } from "./queries";

import cartImg from "../../images/cart.svg";
import logoImg from "../../images/logo.svg";
import searchImg from "../../images/search.svg";
import userImg from "../../images/user.svg";
import {
  mediumScreen,
  smallScreen,
} from "../../globalStyles/scss/variables.scss";
import "./scss/index.scss";

const MainMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { items } = useCart();

  const handleSignOut = () => {
    signOut();
  };

  const cartItemsQuantity =
    (items &&
      items.reduce((prevVal, currVal) => prevVal + currVal.quantity, 0)) ||
    0;

  const [isSticky, setSticky] = useState(false);
  const element = useRef(null)
  let observer = new IntersectionObserver(entries => {entries[0]['isIntersecting'] === false ? setSticky(true) : setSticky(false)}, {rootMargin: "35px"})

  useEffect(() => {
    observer.observe(element.current);
    return () => {observer.disconnect}  
  })

  return (
    <OverlayContext.Consumer>
      {overlayContext => (
        <nav className="main-navbar">
          <div className="topbar" ref={element}>Hola manola</div>
          <div className={`main-menu-wrapper${isSticky ? "-sticky" : ""}`}>
            <div className={`main-menu${isSticky ? "-sticky" : ""}`} id="header">
              <div className="main-menu__left">
                <TypedMainMenuQuery renderOnError displayLoader={false}>
                  {({ data }) => {
                    const items = maybe(
                      () => data.shop.navigation.main.items,
                      []
                    );

                    return (
                      <ul>
                        <Media
                          query={{ maxWidth: mediumScreen }}
                          render={() => (
                            <div className="main-menu__hamburger">
                            <MobileNavList
                              data-test="toggleSideMenuLink"
                              items={items}
                            /> </div>
                          )}
                        />
                        <Online>
                          <Media
                            query={{ maxWidth: smallScreen }}
                            render={() => (
                              <>
                                {user ? (
                                  <MenuDropdown
                                    suffixClass="__rightdown"
                                    head={
                                      <li className="main-menu__icon main-menu__user--active">
                                        <ReactSVG path={userImg} />
                                      </li>
                                    }
                                    content={
                                      <ul className="main-menu__dropdown">
                                        <li data-test="mobileMenuMyAccountLink">
                                          <Link to={appPaths.accountUrl}>
                                            <FormattedMessage
                                              {...commonMessages.myAccount}
                                            />
                                          </Link>
                                        </li>
                                        <li data-test="mobileMenuOrderHistoryLink">
                                          <Link to={appPaths.orderHistoryUrl}>
                                            <FormattedMessage
                                              {...commonMessages.orderHistory}
                                            />
                                          </Link>
                                        </li>
                                        <li data-test="mobileMenuAddressBookLink">
                                          <Link to={appPaths.addressBookUrl}>
                                            <FormattedMessage
                                              {...commonMessages.addressBook}
                                            />
                                          </Link>
                                        </li>
                                        <li
                                          onClick={handleSignOut}
                                          data-test="mobileMenuLogoutLink"
                                        >
                                          <FormattedMessage
                                            {...commonMessages.logOut}
                                          />
                                        </li>
                                      </ul>
                                    }
                                  />
                                ) : (
                                  <li
                                    data-test="mobileMenuLoginLink"
                                    className="main-menu__icon"
                                    onClick={() =>
                                      overlayContext.show(
                                        OverlayType.login,
                                        OverlayTheme.left
                                      )
                                    }
                                  >
                                    <ReactSVG path={userImg} />
                                  </li>
                                )}
                              </>
                            )}
                          />
                        </Online>
                      </ul>
                    );
                  }}
                </TypedMainMenuQuery>
              </div>

              <div className={`main-menu__center${isSticky? "-sticky":""}`}>
                <Link to={appPaths.baseUrl}>
                  <ReactSVG path={logoImg} />
                </Link>
              </div>

              <div className="main-menu__right">
                <ul>
                  <Online>
                    <Media
                      query={{ minWidth: smallScreen }}
                      render={() => (
                        <>
                          {user ? (
                            <MenuDropdown
                              head={
                                <li className="main-menu__icon main-menu__user--active">
                                  <ReactSVG path={userImg} />
                                </li>
                              }
                              content={
                                <ul className="main-menu__dropdown">
                                  <li data-test="desktopMenuMyAccountLink">
                                    <Link to={appPaths.accountUrl}>
                                      <FormattedMessage
                                        {...commonMessages.myAccount}
                                      />
                                    </Link>
                                  </li>
                                  <li data-test="desktopMenuOrderHistoryLink">
                                    <Link to={appPaths.orderHistoryUrl}>
                                      <FormattedMessage
                                        {...commonMessages.orderHistory}
                                      />
                                    </Link>
                                  </li>
                                  <li data-test="desktopMenuAddressBookLink">
                                    <Link to={appPaths.addressBookUrl}>
                                      <FormattedMessage
                                        {...commonMessages.addressBook}
                                      />
                                    </Link>
                                  </li>
                                  <li
                                    onClick={handleSignOut}
                                    data-test="desktopMenuLogoutLink"
                                  >
                                    <FormattedMessage
                                      {...commonMessages.logOut}
                                    />
                                  </li>
                                </ul>
                              }
                            />
                          ) : (
                            <li
                              data-test="desktopMenuLoginOverlayLink"
                              className="main-menu__icon"
                              onClick={() =>
                                overlayContext.show(
                                  OverlayType.login,
                                  OverlayTheme.right
                                )
                              }
                            >
                              <ReactSVG path={userImg} />
                            </li>
                          )}
                        </>
                      )}
                    />
                    <li
                      data-test="menuCartOverlayLink"
                      className="main-menu__icon main-menu__cart"
                      onClick={() => {
                        overlayContext.show(OverlayType.cart, OverlayTheme.right);
                      }}
                    >
                      <ReactSVG path={cartImg} />
                      {cartItemsQuantity > 0 ? (
                        <span className="main-menu__cart__quantity">
                          {cartItemsQuantity}
                        </span>
                      ) : null}
                    </li>
                  </Online>
                  <Offline>
                    <li className="main-menu__offline">
                      <Media
                        query={{ minWidth: mediumScreen }}
                        render={() => (
                          <span>
                            <FormattedMessage defaultMessage="Offline" />
                          </span>
                        )}
                      />
                    </li>
                  </Offline>
                  <li
                    data-test="menuSearchOverlayLink"
                    className="main-menu__search"
                    onClick={() =>
                      overlayContext.show(OverlayType.search, OverlayTheme.right)
                    }
                  >
                    <Media
                      query={{ minWidth: mediumScreen }}
                      render={() => (
                        <span>
                          <FormattedMessage {...commonMessages.search} />
                        </span>
                      )}
                    />
                    <ReactSVG path={searchImg} />
                  </li>
                </ul>
              </div>
            </div>
            <div className="navbar">
              <TypedMainMenuQuery renderOnError displayLoader={false}>
                {({ data }) => {
                  const items = maybe(() => data.shop.navigation.main.items, []);
                  return (
                    <Media
                      query={{ minWidth: mediumScreen }}
                      render={() => <Navbar>{items}</Navbar>}
                    />
                  );
                }}
              </TypedMainMenuQuery>
            </div>
          </div>
        </nav>
      )}
    </OverlayContext.Consumer>
  );
};

export default MainMenu;
