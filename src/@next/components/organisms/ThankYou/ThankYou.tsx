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
  orderStatus,
  externalResource
}: IProps) => {
  const parsed_externalResource = JSON.parse(externalResource).externalResource
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
          <FormattedMessage defaultMessage="El número de orden es" />{" "}
          <span>{orderNumber}</span>
        </S.Paragraph>
        {parsed_externalResource != "" ? 
          <>
          <S.Paragraph>
            Por favor, ingresá al siguiente <S.Anchor href={parsed_externalResource}>Link</S.Anchor> donde se encuentra el ticket de pago junto a las instrucciones para realizar el mismo
          </S.Paragraph>
          <S.Paragraph>
            <FormattedMessage defaultMessage="Una vez que se haya acreditado, te enviaremos un email para avisarte. Tene en cuenta que el ticket de pago tiene una validez de 30 días" />
          </S.Paragraph>
          </> : 
          orderStatus == "PENDING" ?
            <>
              <S.Paragraph>
                <FormattedMessage defaultMessage="Estamos procesando tu pago. No te preocupes, en menos de 2 días hábiles te avisaremos por email si se acreditó." /> 
              </S.Paragraph>
              <S.Paragraph>
                <FormattedMessage defaultMessage="Igualmente te envíamos un email con el detalle de tu compra!" /> 
              </S.Paragraph>
            </> :
            <S.Paragraph>
              <FormattedMessage defaultMessage="Te enviamos un email con el detalle de tu compra. Te avisaremos cuando tu orden se encuentre en camino!" />
            </S.Paragraph>
        }
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
