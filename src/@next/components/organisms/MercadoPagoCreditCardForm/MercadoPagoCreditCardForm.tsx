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
  installments: "",
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
      {({ handleChange, handleSubmit, values }) => (
        <MercadoPagoCreditCardFormContent
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          values={values}
          {...props}
        />
      )}
    </Formik>
  );
};
