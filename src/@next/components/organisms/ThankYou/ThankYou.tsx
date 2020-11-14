import React from "react";
import { FormattedMessage } from "react-intl";

import { Button } from "@components/atoms";
import { Container } from "@components/templates";
import { checkoutMessages } from "@temp/intl";

import * as S from "./styles";
import { IProps } from "./types";

/**
 * Thank you page after completing the checkout.
 */
const ThankYou: React.FC<IProps> = ({
  orderNumber,
  continueShopping,
  orderDetails,
}: IProps) => {
  return (
    <Container data-test="thankYouView">
      <S.Wrapper>
        <S.ThankYouHeader>
          <FormattedMessage defaultMessage="Muchas Gracias" />
          <br />
          <span>
            <FormattedMessage defaultMessage="por tu compra!" />
          </span>
        </S.ThankYouHeader>
        <S.Paragraph>
          <FormattedMessage defaultMessage="Tu número de orden es" />{" "}
          <span>{orderNumber}</span>
        </S.Paragraph>
        <S.Paragraph>
          <FormattedMessage defaultMessage="Te enviamos un email de confirmación de orden. Vamos a avisarte cuando tu orden se encuentre en camino!" />
        </S.Paragraph>
        <S.Buttons>
          <Button
            testingContext="continueShoppingButton"
            onClick={continueShopping}
            color="secondary"
            fullWidth
          >
            <FormattedMessage {...checkoutMessages.continueShopping} />
          </Button>
          <Button
            testingContext="gotoOrderDetailsButton"
            onClick={orderDetails}
            fullWidth
          >
            <FormattedMessage defaultMessage="DETALLES DE LA ORDEN" />
          </Button>
        </S.Buttons>
      </S.Wrapper>
    </Container>
  );
};

export { ThankYou };
