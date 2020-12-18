import { compact } from "lodash";
import React, { useCallback, useState, useEffect } from "react";
import NumberFormat from "react-number-format";

import { TextField, Select } from "@components/molecules";
import * as S from "./styles";

import { CardErrors, PropsWithFormik } from "./types";
import Cards from 'react-credit-cards';
import 'react-credit-cards/lib/styles.scss'

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

export const MercadoPagoCreditCardFormContent: React.FC<PropsWithFormik> = ({
  formRef,
  formId,
  cardErrors: {
    titular: cardTitularError,
    nro_doc: cardNroDocError,
    tipo_doc: cardTipoDocError,
    email: cardEmailError,
    number: cardNumberError,
    cvv: ccCscError,
    expirationMonth: expirationMonthError,
    expirationYear: expirationYearError,
    banco_emisor: cardBancoEmisorError,
    cuotas: cardCuotasError,
  },
  disabled,
  labelsText: { 
    securityCode: ccCscText, 
    cardExpirationMonth: ccExpMonthText, 
    cardExpirationYear: ccExpYearText, 
    cardNumber: ccNumberText, 
    cardholderName: ccTitularText, 
    installments: ccCuotasText, 
    issuer: ccBancoText, 
    docNumber: ccNroDocText, 
    docType: ccTipoDocText, 
    email: ccEmailText
   },
  handleSubmit,
  handleChange,
  values,
  items,
  total,
  paymentMethodId,
  handleKeyPress,
  issuerOptions,
  installmentsOptions,
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

  const [focus, setFocus] = useState("cardholderName")
  const [expiry, setExpiry] = useState("--/--")

  const focus_map = {
    cardholderName: "name",
    cardNumber: "number",
    securityCode: "cvc",
    cardExpirationMonth: "expiry"
  }

  useEffect(() => {
    const expiry_arr = [values.cardExpirationMonth, values.cardExpirationYear]
    setExpiry(expiry_arr.join("/"))
  }, [values.cardExpirationMonth, values.cardExpirationYear])

  const handleFocus = (e) => {
    const mapped_focus = focus_map[e.target.name]
    setFocus(mapped_focus)
  }

  return (
    <S.PaymentForm
      ref={formRef}
      id={formId}
      onSubmit={handleSubmit}
      data-test="creditCardForm"
    >
      <h4>Detalles del Comprador</h4>
      <br />

      <S.PaymentInput>
        <TextField
          autoFocus
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
            errors={cardTipoDocError}
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

      <h4>Detalles de la Tarjeta</h4>
      <br />

      <S.PaymentInput>
        <TextField
          name="cardholderName"
          autoComplete="given-name"
          id="cardholderName" 
          data-checkout="cardholderName"
          type="text"
          onFocus={handleFocus}
          {...basicInputProps(ccTitularText, [cardTitularError], values.cardholderName)}
        />
      </S.PaymentInput>
      
      <S.PaymentInput>
        <NumberFormat
          onKeyPress={handleKeyPress}
          autoComplete="cc-number"
          format="#### #### #### ####"
          name="cardNumber"
          id="cardNumber"
          data-checkout="cardNumber"
          onFocus={handleFocus}
          {...basicInputProps(ccNumberText, [cardNumberError], values.cardNumber)}
        />
      </S.PaymentInput>

      <S.Grid>
        <S.PaymentInput>
          <NumberFormat
            autoComplete="cc-csc"
            format="####"
            name="securityCode"
            id="securityCode"
            data-checkout="securityCode"
            onFocus={handleFocus}
            {...basicInputProps(ccCscText, [ccCscError], values.securityCode)}
          />
        </S.PaymentInput>

        <S.PaymentInput>
          <NumberFormat
            autoComplete="cc-exp"
            format="##"
            name="cardExpirationMonth"
            id="cardExpirationMonth"
            data-checkout="cardExpirationMonth"
            onFocus={handleFocus}
            {...basicInputProps(
              ccExpMonthText,
              [expirationMonthError],
              values.cardExpirationMonth
            )}
          />
        </S.PaymentInput>

        <S.PaymentInput>
          <NumberFormat
            autoComplete="cc-exp"
            format="##"
            name="cardExpirationYear"
            id="cardExpirationYear"
            data-checkout="cardExpirationYear"
            onFocus={handleFocus}
            {...basicInputProps(
              ccExpYearText,
              [expirationYearError],
              values.cardExpirationYear
            )}
          />
        </S.PaymentInput>
      </S.Grid>      

      <S.Grid>
        <S.PaymentInput>
          <Select 
            value={values.installments}
            onChange={handleChange}
            errors={cardCuotasError}
            id="installments" 
            name="installments" 
            style={selectStyle}>
              <option hidden selected>{ccCuotasText}</option>
              {installmentsOptions?.map((installment: any) => 
              <option 
                key={installment.installments}
                value={installment.installments} 
                id={installment.installments}>
                  {installment.recommended_message}
              </option>)}
          </Select>
        </S.PaymentInput>

        <S.PaymentInput>
          <Select 
            value={values.issuer}
            onChange={handleChange}
            errors={cardBancoEmisorError}
            id="issuer" 
            name="issuer" 
            data-checkout="issuer" 
            style={selectStyle}>
              <option hidden selected>{ccBancoText}</option>
              {issuerOptions?.map((issuer: any) => <option key={issuer.name} id={issuer.id}>{issuer.name}</option>)}
          </Select>
        </S.PaymentInput>
      </S.Grid>

      <Cards
        cvc={values.securityCode}
        expiry={expiry}
        focused={focus}
        name={values.cardholderName}
        number={values.cardNumber}
        placeholders={{name: "Nombre y Apellido"}}
        locale={{valid: "Fecha vto."}}
      />

      <input 
        type="hidden" 
        name="transactionAmount" 
        id="transactionAmount" 
        value={values.transactionAmount = total.gross.amount} />

      <input 
        type="hidden"
        name="paymentMethodId" 
        id="paymentMethodId"
        value={values.paymentMethodId = paymentMethodId} />

      <input 
        type="hidden" 
        name="description" 
        id="description" 
        value={values.description = items[0].variant.product.name}/>
    </S.PaymentForm>
  );
};
