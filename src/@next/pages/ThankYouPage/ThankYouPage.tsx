import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { ThankYou } from "@components/organisms";
import { BASE_URL } from "@temp/core/config";
import { generateGuestOrderDetailsUrl } from "@utils/core";

import { IProps } from "./types";

const ThankYouPage: React.FC<IProps> = ({}: IProps) => {
  const location = useLocation();
  const history = useHistory();
  const { token, orderNumber, orderStatus, externalResource, total_amount, subtotal } = location.state;
  const transferencia_total = (total_amount - subtotal?.gross.amount) + subtotal?.gross.amount * 0.9

  return (
      <ThankYou
        continueShopping={() => history.push(BASE_URL)}
        orderNumber={orderNumber}
        orderDetails={() => history.push(generateGuestOrderDetailsUrl(token))}
        orderStatus={orderStatus}
        externalResource={externalResource}
        total={transferencia_total.toFixed(2)}
      />
  );
};

export { ThankYouPage };
