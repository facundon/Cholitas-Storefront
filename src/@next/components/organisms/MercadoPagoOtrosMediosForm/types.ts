import {
  CardError,
  IOtherErrors,
  IOtherInputs,
} from "src/core/payments/mercadopago";

interface ILabelsText {
  email: string;
  docType: string;
  docNumber: string;
  name: string;
}
export interface IFormikProps {
  handleChange: (e: React.ChangeEvent) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  values: IOtherInputs;
}

export interface IProps {
  formRef?: React.RefObject<HTMLFormElement>;
  formId?: string;
  cardErrors: IOtherErrors;
  labelsText: ILabelsText;
  handleSubmit: (formData: IOtherInputs) => void;
  disabled: boolean;
  items: any;
  total: any;
  otherPaymentMethods: any;
}

export type CardErrors = CardError[] | null[];

export interface ICustomInputProps {
  errors: CardErrors;
  label: string;
}

export type PropsWithFormik = Omit<IProps, "handleSubmit"> & IFormikProps;
