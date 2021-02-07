import { ICardData, IFormError } from "@types";

export interface IProps {
  formRef?: React.RefObject<HTMLFormElement>;
  /**
   * Form id on which payment might be submitted.

   * Errors returned by the payment gateway.
   */
  errors?: IFormError[];

  processPayment: (token: string, cardData: ICardData) => void;
}
