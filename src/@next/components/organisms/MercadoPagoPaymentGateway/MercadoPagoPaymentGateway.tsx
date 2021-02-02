import React, { useState, useEffect } from "react";

import { ErrorMessage } from "@components/atoms";
import { MercadoPagoCreditCardForm, MercadoPagoOtrosMediosForm } from "@components/organisms";
import { IFormError } from "@types";
import { Nav, Icon } from 'rsuite'

import {
  ErrorData,
  IPaymentCardError,
} from "../../../../core/payments/mercadopago";


import * as S from "./styles";
import { IProps } from "./types";
import * as MpErrors from "./errors.json"
import * as yup from 'yup';


declare global {
  interface Window {
    Mercadopago: any;
  }
}


let card_schema = yup.object().shape({
  email: yup.string().required("Ingresa tu email").email("Ingrese un email válido"),
  cuotas: yup.string().required("Ingresa la cantidad de cuotas"),
  banco_emisor: yup.string().required("Ingresa el banco emisor"),
})

let other_schema = yup.object().shape({
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
  handleRechargeInstallment,
  handleChangeMethod,
  onError,
  items,
  total,
}: IProps) => {
  const apiKey = config.find(({ field }) => field === "api_key")?.value;
  const [method, setMethod] = useState("card")
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
            card_schema.validate({
              email: formData.email,
              banco_emisor: formData.issuer,
              cuotas: formData.installments
            })     
            .then(function(valid) {
              const checkoutForm = {
                brand: formData.paymentMethodId,
                firstDigits: null,
                lastDigits: response.last_four_digits,
                payer: response.cardholder,
                email: formData.email,
                installments: formData.installments,
                description: items[0]?.variant?.product?.name,
                extra_data: null
              }
              processPayment(response.id, checkoutForm)
            })
            .catch( err => {
              const formated_err: any = [{field: err.path, message: err.message}]
              setCardErrorsHelper(formated_err)
            })
          } else {
              const formatedResponse: any = response.cause.map((error: any) => MpErrors[error.code])
              setCardErrorsHelper(formatedResponse)
          }
        })
      } else {
        other_schema.validate({
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
    }
  }

  useEffect(() => {
      const script = document.createElement("script");
      script.src = scriptConfig.src;
      script.crossOrigin = scriptConfig.crossOrigin;
      script.id = "mercadopago-script-id";
      script.async = true;
      script.onload = initMP
      document.body.appendChild(script);
  }, [])

  useEffect(() => {
    handleChangeMethod(method)
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
      return false
    }
    window.Mercadopago.getIdentificationTypes();
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
          handleRechargeInstallment={handleRechargeInstallment}
          items={items}
          total={total}
        /> : 
        <MercadoPagoOtrosMediosForm
          formRef={formRef}
          formId={formId}
          otherErrors={otherErrors.fieldErrors}
          onError={onError}
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
