export interface PaymentData {
  lastDigits: string;
  ccType: string;
  token: string;
}

export interface ICardInputs {
  email: string;
  docType: string;
  docNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  cardNumber: string;
  securityCode: string;
  issuer: string;
  installments: string;
  transactionAmount: string;
  description: string;
  paymentMethodId: string;
}

export type CardError = { field?: string; message: string } | null;

export interface ICardPaymentInput {
  billingAddress: {
    postalCode?: string;
  };
  number: string;
  cvv: string;
  expirationDate: string;
}

export interface ICardErrors {
  titular: CardError,
  nro_doc: CardError,
  tipo_doc: CardError,
  email: CardError,
  number: CardError,
  cvv: CardError,
  expirationMonth: CardError,
  expirationYear: CardError,
  banco_emisor: CardError,
  cuotas: CardError,
}

export interface ErrorData {
  fieldErrors: ICardErrors;
  nonFieldError?: string;
}
export interface IPaymentCardError {
  code: string;
  field: string;
  message: string;
}
