import { CardError } from "../../../../core/payments/mercadopago";

interface IFormError {
  message: string;
  field?: string;
}

export interface IProps extends React.SelectHTMLAttributes<HTMLInputElement> {
  errors?: IFormError[] | CardError;
  helpText?: string;
  label?: string;
  contentLeft?: React.ReactNode;
  contentRight?: React.ReactNode;
  value?: string | number;
}
