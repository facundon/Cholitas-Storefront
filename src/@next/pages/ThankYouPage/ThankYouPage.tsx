import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { ThankYou } from "@components/organisms";
import { BASE_URL } from "@temp/core/config";
import { generateGuestOrderDetailsUrl } from "@utils/core";

import { IProps } from "./types";

const ThankYouPage: React.FC<IProps> = ({}: IProps) => {
  const location = useLocation();
  const history = useHistory();
  const { token, orderNumber, orderStatus, externalResource } = location.state;
  return (
    externalResource != "" ? 
      window.location.href = JSON.parse(externalResource).externalResource:
      <ThankYou
        continueShopping={() => history.push(BASE_URL)}
        orderNumber={orderNumber}
        orderDetails={() => history.push(generateGuestOrderDetailsUrl(token))}
        orderStatus={orderStatus}
      />
  );
};

export { ThankYouPage };
