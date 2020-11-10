import React, { useState, useEffect } from "react";

import { ErrorMessage } from "@components/atoms";
import { CreditCardForm } from "@components/organisms";
import { IFormError } from "@types";

import {
  ErrorData,
  ICardInputs,
} from "../../../../core/payments/braintree";
import { maybe, removeEmptySpaces } from "../../../../core/utils";

import * as S from "./styles";
import { IProps } from "./types";
import * as MpErrors from "./errors.json"

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
    window.Mercadopago.createToken(formData, setCardToken)
    return false;
  }
  
  function setCardToken(status: any, response: any) {
    if (status == 200 || status == 201) {
        let cardToken = document.createElement('input');
        cardToken.setAttribute('name', 'token');
        cardToken.setAttribute('type', 'hidden');
        cardToken.setAttribute('value', response.id);
        const checkoutForm = {
          brand: "",
          firstDigits: response.first_six_digits,
          lastDigits: response.last_four_digits,
          expMonth: response.expiration_month,
          expYear: response.expiration_year,
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
    window.Mercadopago.setPublishableKey("TEST-47dcfc8f-19da-4845-8fc3-733232878f7c");
    window.Mercadopago.getIdentificationTypes();
    document.getElementById('cardNumber').addEventListener('keyup', guessPaymentMethod);
  }

  function guessPaymentMethod(event: any) {
    let cardnumber = removeEmptySpaces(maybe(() => document.getElementById("cardNumber").value, "") || "");
    if (cardnumber.length >= 6) {
        let bin = cardnumber.substring(0,6);
        window.Mercadopago.getPaymentMethod({
            "bin": bin
        }, setPaymentMethod);
    }
 };
 
 function setPaymentMethod(status: any, response: any) {
    if (status == 200) {
        let paymentMethod = response[0];
        document.getElementById('paymentMethodId').value = paymentMethod.id;
 
        if(paymentMethod.additional_info_needed.includes("issuer_id")){
            getIssuers(paymentMethod.id);
        } else {
            getInstallments(
                paymentMethod.id,
                document.getElementById('transactionAmount').value
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
      let issuerSelect = document.getElementById('issuer');
      response.forEach( (issuer: any) => {
          let opt = document.createElement('option');
          opt.text = issuer.name;
          opt.value = issuer.id;
          issuerSelect.appendChild(opt);
      });

      getInstallments(
          document.getElementById('paymentMethodId').value,
          document.getElementById('transactionAmount').value,
          issuerSelect.value
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

function getInstallments(paymentMethodId: any, transactionAmount: any, issuerId: any){
  window.Mercadopago.getInstallments({
      "payment_method_id": paymentMethodId,
      "amount": parseFloat(transactionAmount),
      "issuer_id": issuerId ? parseInt(issuerId) : undefined
  }, setInstallments);
}

function setInstallments(status: any, response: any){
  if (status == 200) {
      document.getElementById('installments').options.length = 0;
      response[0].payer_costs.forEach( (payerCost: any) => {
          let opt = document.createElement('option');
          opt.text = payerCost.recommended_message;
          opt.value = payerCost.installments;
          document.getElementById('installments').appendChild(opt);
      });
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
      <CreditCardForm
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
      />
      <ErrorMessage errors={allErrors} />
    </S.Wrapper>
  );
};

export { MercadoPagoPaymentGateway };
