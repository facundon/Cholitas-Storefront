import React, { useState, useEffect } from "react";

import { ErrorMessage } from "@components/atoms";
import { MercadoPagoCreditCardForm, MercadoPagoOtrosMediosForm } from "@components/organisms";
import { IFormError } from "@types";
import { Nav, Icon } from 'rsuite'

import {
  ErrorData,
  ICardInputs,
  IPaymentCardError,
} from "../../../../core/payments/mercadopago";
import { maybe, removeEmptySpaces } from "../../../../core/utils";

import * as S from "./styles";
import { IProps } from "./types";
import * as MpErrors from "./errors.json"
import * as yup from 'yup';


declare global {
  interface Window {
    Mercadopago: any;
  }
}


let schema = yup.object().shape({
  name: yup.string().required("Ingresa el nombre y apellido.").matches(/^[a-zA-Z\s]*$/, "Ingrese solo letras"),
  docNumber: yup.string().required("Ingresa tu documento"),
  email: yup.string().required("Ingresa tu email").email("Ingrese un email válido"),
  paymentMethodId: yup.string().required("Seleccione el medio de pago")
});


const other_payment_methods = {
  "Rapipago": "rapipago",
  "Pago Fácil": "pagofacil",
  "Provincia NET Pagos": "bapropagos",
  "Carga Virtual": "cargavirtual",
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

const INITIAL_OTROS_MEDIOS_ERROR_STATE = {
  fieldErrors: {
    name: null,
    nro_doc: null,
    paymentMethodId: null,
    email: null,
  },
  nonFieldError: "",
}

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
  const [method, setMethod] = useState("card")
  const [paymentMethodId, setPaymentMethodId] = useState("visa")
  const [installmentsOptions, setInstallmentsOptions] = useState()
  const [issuerOptions, setIssuerOptions] = useState()
  const [submitErrors, setSubmitErrors] = useState<IFormError[]>([]);
  const [cardErrors, setCardErrors] = React.useState<ErrorData>(
    INITIAL_CARD_ERROR_STATE
  );
  const [otherErrors, setOtherErrors] = React.useState<any>(
    INITIAL_OTROS_MEDIOS_ERROR_STATE
  );

  const setCardErrorsHelper = (errors: IPaymentCardError[]) => {
    if (method == "card") {
      errors.map(({ field, message }: IPaymentCardError) =>
        setCardErrors(({ fieldErrors }) => ({
          fieldErrors: {
            ...fieldErrors,
            [field]: { field, message },
          },
        }))
      )} else {
        errors.map(({ path: field, message }: IPaymentCardError) =>
        setOtherErrors(({ fieldErrors } : any) => ({
          fieldErrors: {
            ...fieldErrors,
            [field]: { field, message },
          },
        })))
    }
  }

  const allErrors = [...errors, ...submitErrors];

  const handleSubmit = async (formData: any) => {
    setCardErrors(INITIAL_CARD_ERROR_STATE)
    setOtherErrors(INITIAL_OTROS_MEDIOS_ERROR_STATE)
    if (formData) {
      if (method == "card") {
        await window.Mercadopago.createToken(formData, (status: any, response: any) => {
          if (status == 200 || status == 201) {
            const checkoutForm = {
              brand: paymentMethodId,
              firstDigits: null,
              lastDigits: response.last_four_digits,
              payer: response.cardholder,
              email: formData.email,
              installments: formData.installments,
              description: items[0]?.variant?.product?.name,
              extra_data: null
            }
            processPayment(response.id, checkoutForm)
          } else {
              const formatedResponse: any = response.cause.map((error: any) => MpErrors[error.code])
              setCardErrorsHelper(formatedResponse)
          }
        })
      } else {
        schema.validate({
            name: formData.name,
            docNumber: formData.docNumber,
            email: formData.email,
            paymentMethodId: formData.paymentMethodId
          })
          .then(function (valid) {
            const readable_method = Object.keys(other_payment_methods).find(key => other_payment_methods[key] === formData.paymentMethodId)
            const checkoutForm = {
              brand: formData.paymentMethodId,
              firstDigits: null,
              lastDigits: null,
              payer: formData.name,
              docType: formData.docType,
              docNumber: formData.docNumber,
              email: formData.email,
              description: items[0]?.variant?.product?.name,
              extra_data: {
                readable_method: readable_method
              },
            }
            processPayment("111111111", checkoutForm)
          })
          .catch( err => {
            setCardErrorsHelper([err])
          })
      }
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


  useEffect(() => {
      const script = document.createElement("script");
      script.src = scriptConfig.src;
      script.crossOrigin = scriptConfig.crossOrigin;
      script.async = true;
      script.onload = initMP
      document.body.appendChild(script);
  }, [method])

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
 
  function setPaymentMethod (status: any, response: any) {
    if (status == 200) {
      setSubmitErrors([{message: ""}])
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
            message: "Número de tarjeta inválido",
          },
        ];
        setSubmitErrors(mpPaymentError)
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
            message: response.message,
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
      console.log(response)
      setInstallmentsOptions(response[0].payer_costs)
    } else {
        const mpInstallmentError = [
          {
            message: response.message,
          },
        ];
        setSubmitErrors(mpInstallmentError);
        onError(mpInstallmentError);
    }
  }

  const handleSelect = (activeKey: any) => {
    setMethod(activeKey)
  }

  return (
    <S.Wrapper data-test="mercadopagoPaymentGateway">
      <Nav justified appearance="tabs" onSelect={handleSelect} activeKey={method} style={{marginBottom: 20, textAlign: "center", zIndex: 0}}>
        <Nav.Item eventKey="card" icon={<Icon icon="credit-card"/>}>Tarjeta</Nav.Item>
        <Nav.Item eventKey="other" icon={<Icon icon="money"/>}>Efectivo</Nav.Item>
      </Nav>
      {method == "card" ?
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
          handleOnInput={() => getInstallments(paymentMethodId, total.gross.amount, document.getElementById("issuer").value )}
          installmentsOptions={installmentsOptions}
          issuerOptions={issuerOptions}
        /> : 
        <MercadoPagoOtrosMediosForm
          formRef={formRef}
          formId={formId}
          otherErrors={otherErrors.fieldErrors}
          labelsText={{
            email: "Email",
            docType: "Tipo Doc",
            docNumber: "Número de Documento",
            name: "Nombre y Apellido",
          }}
          disabled={false}
          handleSubmit={handleSubmit}
          items={items}
          total={total}
          otherPaymentMethods={other_payment_methods}
        />        
      }
      <ErrorMessage errors={allErrors} />
    </S.Wrapper>
  );
};

export { MercadoPagoPaymentGateway };
