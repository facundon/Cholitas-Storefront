import { IFormError } from "@types";
import { CardError } from "../../../../core/payments/mercadopago";

export interface IProps {
  errors?: IFormError[] | CardError;
}
