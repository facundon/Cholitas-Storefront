import React, { useState, useEffect } from "react";

import { ErrorMessage } from "@components/atoms";
import { MercadoPagoCreditCardForm } from "@components/organisms";
import { IFormError } from "@types";

import {
  ErrorData,
  ICardInputs,
  IPaymentCardError,
} from "../../../../core/payments/mercadopago";
import { maybe, removeEmptySpaces } from "../../../../core/utils";

import * as S from "./styles";
import { IProps } from "./types";
import * as MpErrors from "./errors.json"

declare global {
  interface Window {
    Mercadopago: any;
  }
}

const INITIAL_CARD_ERROR_STATE = {
  fieldErrors: {
    titular: null,
    nro_doc: null,
    tipo_doc: null,
    email: null,
    number: null,
    cvv: null,
    expirationMonth: null,
    expirationYear: null,
    banco_emisor: null,
    cuotas: null,
  },
  nonFieldError: "",
};

const MercadoPagoPaymentGateway: React.FC<IProps> = ({
  config,
  processPayment,
  scriptConfig,
  formRef,
  formId,
  errors = [],
  postalCode,
  onError,
  items,
  total,
}: IProps) => {
  const apiKey = config.find(({ field }) => field === "api_key")?.value;
  const [paymentMethodId, setPaymentMethodId] = useState("visa")
  const [installmentsOptions, setInstallmentsOptions] = useState()
  const [issuerOptions, setIssuerOptions] = useState()
  const [formDataRaw, setFormData] = useState()
  const [submitErrors, setSubmitErrors] = useState<IFormError[]>([]);
  const [cardErrors, setCardErrors] = React.useState<ErrorData>(
    INITIAL_CARD_ERROR_STATE
  );

  const setCardErrorsHelper = (errors: IPaymentCardError[]) =>
    errors.map(({ field, message }: IPaymentCardError) =>
      setCardErrors(({ fieldErrors }) => ({
        fieldErrors: {
          ...fieldErrors,
          [field]: { field, message },
        },
      }))
    );

  const allErrors = [...errors, ...submitErrors];

  const handleSubmit = async (formData: ICardInputs) => {
    setCardErrors(INITIAL_CARD_ERROR_STATE);
    if (formData) {
      setFormData(formData)
      window.Mercadopago.createToken(formData, setCardToken)
    } else {
      const mpFormError = [
        {
          message: "Ocurrio un error con la carga del formulario de pago.",
        },
      ];
      setSubmitErrors(mpFormError)
      onError(mpFormError)
    }
  }

  function setCardToken(status: any, response: any) {
    if (status == 200 || status == 201) {
      const checkoutForm = {
        brand: paymentMethodId,
        firstDigits: response.first_six_digits,
        lastDigits: response.last_four_digits,
        expMonth: response.expiration_month,
        expYear: response.expiration_year,
        payer: response.cardholder,
        email: formDataRaw?.email,
        installments: formDataRaw?.installments,
      }
      processPayment(response.id, checkoutForm)
    } else {
        const formatedResponse: any = response.cause.map((error: any) => MpErrors[error.code])
        setCardErrorsHelper(formatedResponse)
    }
 };

  useEffect(() => {
      const script = document.createElement("script");
      script.src = scriptConfig.src;
      script.crossOrigin = scriptConfig.crossOrigin;
      script.async = true;
      script.onload = initMP
      document.body.appendChild(script);
  })

  const initMP = () => {
    if (apiKey) {
      window.Mercadopago.setPublishableKey(apiKey)
    } else {
      const mpApiKeyError = [
        {
          message: "Fallo en la configuración de la API de Mercado Pago. Proveer una clave pública",
        },
      ];
      setSubmitErrors(mpApiKeyError)
      onError(mpApiKeyError)
      return false
    }
    window.Mercadopago.getIdentificationTypes();
  }

  function guessPaymentMethod(event: any) {
    let cardnumber = removeEmptySpaces(maybe(() => event.target.value, "") || "");
    if (cardnumber.length >= 6) {
        let bin = cardnumber.substring(0,6);
        window.Mercadopago.getPaymentMethod({
            "bin": bin
        }, setPaymentMethod);
    }
  };
 
 function setPaymentMethod(status: any, response: any) {
    if (status == 200) {
      setPaymentMethodId(response[0].id)
      if(response[0].additional_info_needed.includes("issuer_id")){
          getIssuers(paymentMethodId);
      } else {
          getInstallments(
              paymentMethodId,
              total.gross.amount
          );
      }
    } else {
        const mpPaymentError = [
          {
            message: response,
          },
        ];
        setSubmitErrors(mpPaymentError)
        onError(mpPaymentError)
    }
 }

 function getIssuers(paymentMethodId: any) {
  window.Mercadopago.getIssuers(
    paymentMethodId,
    setIssuers
  );
}

function setIssuers(status: any, response: any) {
  if (status == 200) {
    setIssuerOptions(response)
    getInstallments(
        paymentMethodId,
        total.gross.amount,
        document.getElementById("issuer").value
    );
  } else {
      const mpIssuersError = [
        {
          message: response,
        },
      ];
      setSubmitErrors(mpIssuersError);
      onError(mpIssuersError);
  }
}

function getInstallments(paymentMethodId: any, transactionAmount: any, issuerId?: any){
  window.Mercadopago.getInstallments({
      "payment_method_id": paymentMethodId,
      "amount": parseFloat(transactionAmount),
      "issuer_id": issuerId ? parseInt(issuerId) : undefined
  }, setInstallments);
}

function setInstallments(status: any, response: any){
  if (status == 200) {
    setInstallmentsOptions(response[0].payer_costs)
  } else {
      const mpInstallmentError = [
        {
          message: response,
        },
      ];
      setSubmitErrors(mpInstallmentError);
      onError(mpInstallmentError);
    }
}

  return (
    <S.Wrapper data-test="mercadopagoPaymentGateway">
      <MercadoPagoCreditCardForm
        formRef={formRef}
        formId={formId}
        cardErrors={cardErrors.fieldErrors}
        labelsText={{
          email: "Email",
          docType: "Tipo Doc",
          docNumber: "Número de Documento",
          cardholderName: "Titular de la Tarjeta",
          cardExpirationMonth: "Mes Venc.",
          cardExpirationYear: "Año Venc.",
          cardNumber: "Numero de la Tarjeta",
          securityCode: "CVC",
          issuer: "Banco Emisor",
          installments: "Cuotas",
        }}
        disabled={false}
        handleSubmit={handleSubmit}
        items={items}
        total={total}
        paymentMethodId={paymentMethodId}
        handleKeyPress={guessPaymentMethod}
        installmentsOptions={installmentsOptions}
        issuerOptions={issuerOptions}
      />
      <ErrorMessage errors={allErrors} />
    </S.Wrapper>
  );
};

export { MercadoPagoPaymentGateway };
