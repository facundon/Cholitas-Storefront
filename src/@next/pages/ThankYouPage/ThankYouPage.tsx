import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { ThankYou } from "@components/organisms";
import { BASE_URL } from "@temp/core/config";

import { generateGuestOrderDetailsUrl } from "@utils/core";
import { IProps } from "./types";

interface LocationState {
  token: any;
  orderNumber: any;
  orderStatus: any;
  externalResource: any;
  total_amount: any;
}
const ThankYouPage: React.FC<IProps> = ({}: IProps) => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const {
    token,
    orderNumber,
    orderStatus,
    externalResource,
    total_amount,
  } = location.state;

  return (
    <ThankYou
      continueShopping={() => history.push(BASE_URL)}
      orderNumber={orderNumber}
      orderDetails={() => history.push(generateGuestOrderDetailsUrl(token))}
      orderStatus={orderStatus}
      externalResource={externalResource}
      total={total_amount}
    />
  );
};

export { ThankYouPage };
