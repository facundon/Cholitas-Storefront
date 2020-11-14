import {
  CardError,
  ICardErrors,
  ICardInputs,
} from "src/core/payments/mercadopago";

interface ILabelsText {
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
}
export interface IFormikProps {
  handleChange: (e: React.ChangeEvent) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  values: ICardInputs;
}

export interface IProps {
  formRef?: React.RefObject<HTMLFormElement>;
  formId?: string;
  cardErrors: ICardErrors;
  labelsText: ILabelsText;
  handleSubmit: (formData: ICardInputs) => void;
  disabled: boolean;
  items: any;
  total: any;
  paymentMethodId: any;
  handleKeyPress: any;
  installmentsOptions: any;
  issuerOptions: any;
}

export type CardErrors = CardError[] | null[];

export interface ICustomInputProps {
  errors: CardErrors;
  label: string;
}

export type PropsWithFormik = Omit<IProps, "handleSubmit"> & IFormikProps;
