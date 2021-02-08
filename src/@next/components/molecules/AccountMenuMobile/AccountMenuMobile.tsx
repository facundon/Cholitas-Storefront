import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Icon } from "@components/atoms";
import { Icon as RIcon } from "rsuite";
import { useHandlerWhenClickedOutside } from "@hooks";
import { commonMessages } from "@temp/intl";

import { Link } from "react-router-dom";
import * as S from "./styles";
import { IProps } from "./types";

export const AccountMenuMobile: React.FC<IProps> = ({
  links,
  active,
}: IProps) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const intl = useIntl();

  const { setElementRef } = useHandlerWhenClickedOutside(() => {
    setShowMenu(false);
  });

  const linkToMenuItem = (link: string | any) => {
    link = link
      .replace(/\//g, "")
      .replace("-", " ")
      .split(" ")
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
    let menuItem = link;
    /* eslint-disable default-case */
    switch (link) {
      case "Account":
        menuItem = (
          <div className="text-icon-wrapper">
            <RIcon icon="profile" />{" "}
            {intl.formatMessage(commonMessages.account)}
          </div>
        );
        break;
      case "Order History":
        menuItem = (
          <div className="text-icon-wrapper">
            <RIcon icon="book2" />{" "}
            {intl.formatMessage(commonMessages.orderHistory)}
          </div>
        );
        break;
      case "Address Book":
        menuItem = (
          <div className="text-icon-wrapper">
            <RIcon icon="location-arrow" />{" "}
            {intl.formatMessage(commonMessages.addressBook)}
          </div>
        );
        break;
    }
    return menuItem;
  };

  return (
    <S.Wrapper
      onClick={() => {
        setShowMenu(true);
      }}
      ref={setElementRef()}
    >
      {linkToMenuItem(active)}
      <Icon name="select_arrow" size={8} />
      {showMenu && (
        <S.Overlay>
          <S.MenuHeader>
            <FormattedMessage defaultMessage="Ir a" />
          </S.MenuHeader>
          {links.map(link => {
            const menuItem = linkToMenuItem(link);
            return (
              <div
                onClick={evt => {
                  evt.stopPropagation();
                  setShowMenu(false);
                }}
                key={link}
              >
                <Link to={link}>
                  <S.MenuItem active={active === link}>
                    {menuItem}
                    <Icon name="select_arrow" size={8} />
                  </S.MenuItem>
                </Link>
              </div>
            );
          })}
        </S.Overlay>
      )}
    </S.Wrapper>
  );
};
