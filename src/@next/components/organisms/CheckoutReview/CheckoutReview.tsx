import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { ErrorMessage } from "@components/atoms";
import { AddressSummary } from "@components/molecules";
import { checkoutMessages } from "@temp/intl";
import { CHECKOUT_STEPS } from "@temp/core/config";

import * as S from "./styles";
import { IProps } from "./types";

/**
 * Review order view showed in checkout.
 */
const CheckoutReview: React.FC<IProps> = ({
  shippingAddress,
  billingAddress,
  shippingMethodName,
  paymentMethodName,
  email,
  errors,
}: IProps) => {
  return (
    <S.Wrapper data-test="sectionTitle">
      <S.Title data-test="checkoutPageSubtitle">
        <FormattedMessage {...checkoutMessages.reviewOrder} />
      </S.Title>
      <S.Grid>
        <section data-test="shippingAddressSection">
          <S.SubTitle>
            <FormattedMessage {...checkoutMessages.shippingAddress} />
          </S.SubTitle>
          <S.Divider />
          <AddressSummary address={shippingAddress} email={email} />
        </section>
        <section data-test="billingAddressSection">
          <S.SubTitle>
            <FormattedMessage defaultMessage="Domicilio de Facturación" />
          </S.SubTitle>
          <S.Divider />
          <AddressSummary address={billingAddress} email={email} />
        </section>
        <section>
          <S.SubTitle>
            <FormattedMessage defaultMessage="Forma de Envío" />
          </S.SubTitle>
          <S.Divider />
          <S.TextSummary data-test="shippingMethodName">
            {shippingMethodName}
          </S.TextSummary>
        </section>
        <section>
          <S.SubTitle>
            <FormattedMessage defaultMessage="Medio de Pago" />
          </S.SubTitle>
          <S.Divider />
          <S.TextSummary data-test="paymentMethodName">
            {paymentMethodName}
          </S.TextSummary>
        </section>
      </S.Grid>
      <S.ErrorMessages>
        <ErrorMessage errors={errors} />
        {!!errors?.length && (
          <S.Paragraph>
            Puede modificar los datos del pago
            <Link to={CHECKOUT_STEPS[2].link}>
              <S.ErrorLink>aquí</S.ErrorLink>
            </Link>
          </S.Paragraph>
        )}
      </S.ErrorMessages>
    </S.Wrapper>
  );
};

export { CheckoutReview };
