import { Formik } from "formik";
import React from "react";

import { MercadoPagoCreditCardFormContent } from "./MercadoPagoCreditCardFormContent";
import { IProps } from "./types";

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
  installments: "1",
  transactionAmount: "",
  description: "",
  paymentMethodId: "",
};

export const MercadoPagoCreditCardForm: React.FC<IProps> = ({
  handleSubmit,
  ...props
}: IProps) => {
  return (
    <Formik
      initialValues={INITIAL_CARD_VALUES_STATE}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ handleChange, handleSubmit, handleKeyPress, values }) => (
        <MercadoPagoCreditCardFormContent
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleKeyPress={handleKeyPress}
          values={values}
          {...props}
        />
      )}
    </Formik>
  );
};
