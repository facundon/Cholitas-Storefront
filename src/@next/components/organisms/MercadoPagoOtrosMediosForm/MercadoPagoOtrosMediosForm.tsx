import { Formik } from "formik";
import React from "react";

import { MercadoPagoOtrosMediosFormContent } from "./MercadoPagoOtrosMediosFormContent";
import { IProps } from "./types";

const INITIAL_CARD_VALUES_STATE = {
  email: "",
  docType: "DNI",
  docNumber: "",
  name: "",
  transactionAmount: "",
  description: "",
  paymentMethodId: "rapipago",
};

export const MercadoPagoOtrosMediosForm: React.FC<IProps> = ({
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
        <MercadoPagoOtrosMediosFormContent
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          values={values}
          {...props}
        />
      )}
    </Formik>
  );
};
