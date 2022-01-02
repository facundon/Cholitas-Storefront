import { compact } from "lodash";
import React, { useCallback, useState, useEffect } from "react";
import NumberFormat from "react-number-format";

import { TextField, Select } from "@components/molecules";
import { ErrorMessage } from "@components/atoms";
import Cards, { Focused } from "react-credit-cards";
import * as S from "./styles";
import { maybe, removeEmptySpaces } from "../../../../core/utils";

import { CardErrors, PropsWithFormik } from "./types";
import "react-credit-cards/lib/styles.scss";

declare global {
  interface Window {
    Mercadopago: any;
  }
}

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
    email: ccEmailText,
  },
  handleSubmit,
  handleChange,
  handleRechargeInstallment,
  values,
  total,
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
  };

  const errorStyle = {
    padding: "0.8rem 1rem",
    width: "100%",
    fontSize: "1rem",
    border: "1px solid #c22d74",
    color: "#c22d74",
  };

  const [focus, setFocus] = useState<Focused>("name");
  const [expiry, setExpiry] = useState("--/--");
  const [issuerOptions, setIssuerOptions] = useState([]);
  const [installmentsOptions, setInstallmentsOptions] = useState([]);
  const [paymentMethodId, setPaymentMethodId] = useState<any>();
  const [totalAmount, setTotalAmount] = useState(total.gross.amount);
  const [submitErrors, setSubmitErrors] = useState([{ message: "" }]);
  const [installmentsCosts, setInstallmentsCosts] = useState({});

  const focus_map: any = {
    cardholderName: "name",
    cardNumber: "number",
    securityCode: "cvc",
    cardExpirationMonth: "expiry",
    cardExpirationYear: "expiry",
  };

  useEffect(() => {
    const expiry_arr = [values.cardExpirationMonth, values.cardExpirationYear];
    setExpiry(expiry_arr.join("/"));
  }, [values.cardExpirationMonth, values.cardExpirationYear]);

  useEffect(() => {
    setSubmitErrors([{ message: "" }]);
    if (window.Mercadopago) {
      const cardnumber = removeEmptySpaces(
        maybe(() => values.cardNumber, "") || ""
      );
      const setPaymentMethod = (status: any, response: any) => {
        if (status === 200) {
          const paymentMethodId = response[0].id;
          setPaymentMethodId(paymentMethodId);
        } else {
          setInstallmentsOptions([]);
          setIssuerOptions([]);
          const mpIssuersError = [
            {
              message: "Número de tarjeta inválido",
            },
          ];
          setSubmitErrors(mpIssuersError);
        }
      };
      if (cardnumber.length >= 6) {
        const bin = cardnumber.substring(0, 6);
        window.Mercadopago?.getPaymentMethod(
          {
            bin,
          },
          setPaymentMethod
        );
      }
    } else {
      setSubmitErrors([
        { message: "Hubo un problema con la aplicación de MercadoPago" },
      ]);
    }
  }, [values.cardNumber, window.Mercadopago]);

  useEffect(() => {
    if (installmentsOptions) {
      const current_installment: any = installmentsOptions.find(
        (option: any) =>
          option.installments.toString() === values.installments.toString()
      );
      setTotalAmount(
        current_installment?.total_amount
          ? current_installment.total_amount
          : total.gross.amount
      );
      setInstallmentsCosts(current_installment);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    paymentMethodId &&
      window.Mercadopago.getIssuers(
        paymentMethodId,
        (status: any, response: any) => {
          if (status === 200) {
            const current_issuer_id = response.filter(
              (items: any) =>
                removeEmptySpaces(items.name) ===
                removeEmptySpaces(values.issuer)
            )[0]?.id;
            setIssuerOptions(response);
            getInstallments(
              paymentMethodId,
              total.gross.amount,
              values.issuer,
              current_issuer_id
            );
          } else {
            setInstallmentsOptions([]);
            setIssuerOptions([]);
            const mpPaymentError = [
              {
                message: response.message,
              },
            ];
            setSubmitErrors(mpPaymentError);
          }
        }
      );

    function getInstallments(
      paymentMethodId: any,
      transactionAmount: any,
      issuerId?: any,
      current_issuer_id?: any
    ) {
      window.Mercadopago.getInstallments(
        {
          payment_method_id: paymentMethodId,
          amount: parseFloat(transactionAmount),
          issuer_id: issuerId ? parseInt(issuerId, 10) : undefined,
        },
        (status: any, response: any) => {
          if (status === 200) {
            const filtered_response = response.filter(
              (data: any) => data.issuer.id === current_issuer_id
            );
            setInstallmentsOptions(filtered_response[0]?.payer_costs);
          } else {
            const mpInstallmentError = [
              {
                message: response.message,
              },
            ];
            setSubmitErrors(mpInstallmentError);
          }
        }
      );
    }
  }, [
    values.issuer,
    values.installments,
    paymentMethodId,
    installmentsOptions,
  ]);

  useEffect(() => {
    handleRechargeInstallment(totalAmount, installmentsCosts);
  }, [totalAmount, installmentsCosts]);

  const handleFocus = (e: any) => {
    const mapped_focus: any = focus_map[e.target.name];
    setFocus(mapped_focus);
  };

  useEffect(() => {
    values.paymentMethodId = paymentMethodId;
    values.transactionAmount = totalAmount;
  }, [paymentMethodId, totalAmount]);

  // eslint-disable-next-line no-return-assign
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
            {...basicInputProps(
              ccTipoDocText,
              [cardTipoDocError],
              values.docType
            )}
            style={
              compact([cardTipoDocError]).length ? errorStyle : selectStyle
            }
          />
        </S.PaymentInput>

        <S.PaymentInput>
          <NumberFormat
            autoComplete="doc-number"
            format="########"
            name="docNumber"
            id="docNumber"
            data-checkout="docNumber"
            {...basicInputProps(
              ccNroDocText,
              [cardNroDocError],
              values.docNumber
            )}
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
          {...basicInputProps(
            ccTitularText,
            [cardTitularError],
            values.cardholderName
          )}
        />
      </S.PaymentInput>

      <S.PaymentInput>
        <NumberFormat
          autoComplete="cc-number"
          format="#### #### #### ####"
          name="cardNumber"
          id="cardNumber"
          data-checkout="cardNumber"
          onFocus={handleFocus}
          {...basicInputProps(
            ccNumberText,
            [cardNumberError],
            values.cardNumber
          )}
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
            id="installments"
            name="installments"
            style={compact([cardCuotasError]).length ? errorStyle : selectStyle}
            {...basicInputProps(
              ccCuotasText,
              [cardCuotasError],
              values.installments
            )}
          >
            <option id="cuotas" hidden>
              {ccCuotasText}
            </option>
            {installmentsOptions?.map((installment: any, index: any) => (
              <option
                key={index}
                value={installment.installments}
                id={installment.installments}
              >
                {installment.recommended_message}
              </option>
            ))}
          </Select>
        </S.PaymentInput>

        <S.PaymentInput>
          <Select
            {...basicInputProps(
              ccBancoText,
              [cardBancoEmisorError],
              values.issuer
            )}
            id="issuer"
            name="issuer"
            data-checkout="issuer"
            style={
              compact([cardBancoEmisorError]).length ? errorStyle : selectStyle
            }
          >
            <option hidden>{ccBancoText}</option>
            {issuerOptions?.map((issuer: any, index: any) => (
              <option key={index} id={issuer.id}>
                {issuer.name}
              </option>
            ))}
          </Select>
        </S.PaymentInput>
      </S.Grid>

      <Cards
        cvc={values.securityCode}
        expiry={expiry}
        focused={focus}
        name={values.cardholderName}
        number={values.cardNumber}
        placeholders={{ name: "Nombre y Apellido" }}
        locale={{ valid: "Fecha vto." }}
      />

      <input
        type="hidden"
        name="transactionAmount"
        id="transactionAmount"
        value={values.transactionAmount}
      />

      <input
        type="hidden"
        name="paymentMethodId"
        id="paymentMethodId"
        value={values.paymentMethodId}
      />

      <input
        type="hidden"
        name="description"
        id="description"
        value={values.description}
      />
      <ErrorMessage errors={submitErrors} />
    </S.PaymentForm>
  );
};
