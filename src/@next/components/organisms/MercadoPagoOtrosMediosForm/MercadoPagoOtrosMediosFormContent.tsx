import { compact } from "lodash";
import React, { useCallback } from "react";
import NumberFormat from "react-number-format";

import { TextField, Select } from "@components/molecules";
import * as S from "./styles";

import { CardErrors, PropsWithFormik } from "./types";

const getInputProps = (
  disabled: boolean,
  handleChange: (e: React.ChangeEvent) => void
) => (label: string, errors: CardErrors, value: string) => ({
  customInput: TextField,
  disabled,
  errors: compact(errors),
  label,
  onChange: handleChange,
  value,
});

export const MercadoPagoOtrosMediosFormContent: React.FC<PropsWithFormik> = ({
  formRef,
  formId,
  otherErrors: {
    name: cardTitularError,
    nro_doc: cardNroDocError,
    tipo_doc: cardTipoDocError,
    email: cardEmailError,
  },
  disabled,
  labelsText: { 
    name: ccTitularText, 
    docNumber: ccNroDocText, 
    docType: ccTipoDocText, 
    email: ccEmailText
   },
  handleSubmit,
  handleChange,
  values,
  items,
  total,
  otherPaymentMethods,
}: PropsWithFormik) => {
  const basicInputProps = useCallback(getInputProps(disabled, handleChange), [
    disabled,
    handleChange,
  ]);

  const selectStyle = {
    padding: "0.8rem 1rem",
    width: "100%", 
    fontSize: "1rem", 
    border: "1px solid #323232",
  }

  return (
    <S.PaymentForm
      ref={formRef}
      id={formId}
      onSubmit={handleSubmit}
      data-test="OtrosMediosForm"
    >
      <h4>Medio de Pago</h4>
      <br />

      <S.PaymentInput>
        <Select
          id="paymentMethodId"
          name="paymentMethodId"
          data-checkout="paymentMethodId" 
          value={values.paymentMethodId}
          onChange={handleChange}
          style={selectStyle}>
            <option hidden selected>Selecciona una opción</option>
            {Object.entries(otherPaymentMethods).map(
              option => <option value={option[1]}>{option[0]}</option>
            )}
        </Select>
      </S.PaymentInput>

      <h4>Detalles del Comprador</h4>
      <br />

      <S.PaymentInput>
        <TextField
          autoFocus
          name="name"
          autoComplete="given-name"
          id="name" 
          data-checkout="name"
          type="text"
          {...basicInputProps(ccTitularText, [cardTitularError], values.name)}
        />
      </S.PaymentInput>

      <S.PaymentInput>
        <TextField
          name="email"
          autoComplete="email"
          id="email" 
          type="text"
          {...basicInputProps(ccEmailText, [cardEmailError], values.email)}
        />
      </S.PaymentInput>

      <S.Grid>
        <S.PaymentInput>
          <Select
            id="docType"
            name="docType"
            data-checkout="docType" 
            value={values.docType}
            onChange={handleChange}
            style={selectStyle} />
        </S.PaymentInput>

        <S.PaymentInput>
          <NumberFormat
            autoComplete="doc-number"
            format="########"
            name="docNumber"
            id="docNumber"
            data-checkout="docNumber"
            {...basicInputProps(ccNroDocText, [cardNroDocError], values.docNumber)}
          />
        </S.PaymentInput>
      </S.Grid>

      <input 
        type="hidden" 
        name="transactionAmount" 
        id="transactionAmount" 
        value={values.transactionAmount = total.gross.amount} />
      <input 
        type="hidden" 
        name="description" 
        id="description" 
        value={values.description = items[0].variant.product.name}/>
    </S.PaymentForm>
  );
};
