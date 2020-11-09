import React, { useState, useEffect } from "react";

import { ErrorMessage } from "@components/atoms";
import { CreditCardForm } from "@components/organisms";
import { IFormError } from "@types";

import {
  braintreePayment,
  ErrorData,
  ICardInputs,
  ICardPaymentInput,
  IPaymentCardError,
  PaymentData,
} from "../../../../core/payments/braintree";
import { maybe, removeEmptySpaces } from "../../../../core/utils";

import * as S from "./styles";
import { IProps } from "./types";

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

  const clientToken = config.find(({ field }) => field === "client_token")
    ?.value;

  const [cardErrors, setCardErrors] = React.useState<ErrorData>(
    INITIAL_CARD_ERROR_STATE
  );
  
  // const handleSubmit = async (formData: ICardInputs) => {
  //   setSubmitErrors([]);
  //   const creditCard: ICardPaymentInput = {
  //     billingAddress: { postalCode },
  //     cvv: removeEmptySpaces(maybe(() => formData.codigo_seguridad, "") || ""),
  //     number: removeEmptySpaces(maybe(() => formData.nro_tarjeta, "") || ""),
  //   };
  //   const payment = await tokenizeCcCard(creditCard);
  //   if (payment?.token) {
  //     processPayment(payment?.token, {
  //       brand: payment?.ccType,
  //       firstDigits: null,
  //       lastDigits: payment?.lastDigits,
  //       expMonth: null,
  //       expYear: null,
  //     });
  //   } else {
  //     const braintreePayloadErrors = [
  //       {
  //         message:
  //           "Payment submission error. Braintree gateway returned no token in payload.",
  //       },
  //     ];
  //     setSubmitErrors(braintreePayloadErrors);
  //     onError(braintreePayloadErrors);
  //   }
  // };

  const allErrors = [...errors, ...submitErrors];

  const handleSubmit = async (formData: ICardInputs) => {
    let $form = document.getElementById('paymentForm');
    console.log(formData)
    window.Mercadopago.createToken(formData, setCardTokenAndPay);
    return false;
  }
  
  function setCardTokenAndPay(status, response) {
    if (status == 200 || status == 201) {
        let form = document.getElementById('paymentForm');
        let card = document.createElement('input');
        card.setAttribute('name', 'token');
        card.setAttribute('type', 'hidden');
        card.setAttribute('value', response.id);
        form.appendChild(card);
        doSubmit=true;
        form.submit();
    } else {
        alert("Verify filled data!\n"+JSON.stringify(response, null, 4));
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
        alert(`payment method info error: ${response}`);
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
      alert(`issuers method info error: ${response}`);
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
      alert(`installments method info error: ${response}`);
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
