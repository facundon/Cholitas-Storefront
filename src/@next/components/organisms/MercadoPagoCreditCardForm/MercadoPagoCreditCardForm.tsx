import { Formik } from "formik";
import React from "react";

import { MercadoPagoCreditCardFormContent } from "./MercadoPagoCreditCardFormContent";
import { IProps } from "./types";

export const MercadoPagoCreditCardForm: React.FC<IProps> = ({
  handleSubmit,
  items,
  ...props
}: IProps) => {
  const INITIAL_CARD_VALUES_STATE = {
    email: "",
    docType: "DNI",
    docNumber: "",
    cardholderName: "",
    cardExpirationMonth: "",
    cardExpirationYear: "",
    cardNumber: "",
    securityCode: "",
    issuer: "",
    installments: "",
    transactionAmount: "",
    description: items[0].variant.product.name,
    paymentMethodId: "",
  };
  return (
    <Formik
      initialValues={INITIAL_CARD_VALUES_STATE}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ handleChange, handleSubmit, values }) => (
        <MercadoPagoCreditCardFormContent
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          items={items}
          values={values}
          {...props}
        />
      )}
    </Formik>
  );
};
