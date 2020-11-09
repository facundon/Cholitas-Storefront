import { Formik } from "formik";
import React from "react";

import { CreditCardFormContent } from "./CreditCardFormContent";
import { IProps } from "./types";

const INITIAL_CARD_VALUES_STATE = {
  email: "",
  docType: "",
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
};

export const CreditCardForm: React.FC<IProps> = ({
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
        <CreditCardFormContent
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          values={values}
          {...props}
        />
      )}
    </Formik>
  );
};
