import React, {
  forwardRef,
  RefForwardingComponent,
  useImperativeHandle,
  useState,
} from "react";
import { RouteComponentProps } from "react-router";

import { CheckoutReview } from "@components/organisms";
import { statuses as dummyStatuses } from "@components/organisms/DummyPaymentGateway";
import { useCheckout } from "@saleor/sdk";
import { IFormError } from "@types";
import {
  ICheckout,
  CompleteCheckoutInput,
  IPayment,
  DataErrorCheckoutTypes,
  FunctionErrorCheckoutTypes,
} from "@saleor/sdk/lib/api/Checkout/types";
import { PromiseRunResponse } from "@saleor/sdk/lib/api/types";

export interface ISubmitCheckoutData {
  id: string;
  orderNumber: string;
  token: string;
  orderStatus?: any;
  externalResource?: any;
  total_amount?: any;
}

export interface ICheckoutReviewSubpageHandles {
  complete: () => void;
}

interface IModifiedPayment extends IPayment {
  creditCard?: any;
}

interface IProps extends RouteComponentProps<any> {
  selectedPaymentGatewayToken?: string;
  paymentGatewayFormRef: React.RefObject<HTMLFormElement>;
  changeSubmitProgress: (submitInProgress: boolean) => void;
  onSubmitSuccess: (data: ISubmitCheckoutData) => void;
}

const CheckoutReviewSubpageWithRef: RefForwardingComponent<
  ICheckoutReviewSubpageHandles,
  IProps
> = (
  {
    selectedPaymentGatewayToken,
    paymentGatewayFormRef,
    changeSubmitProgress,
    onSubmitSuccess,
    ...props
  }: IProps,
  ref
) => {
  const {
    checkout,
    payment,
    completeCheckout,
  }: {
    checkout?: ICheckout | undefined;
    payment?: IModifiedPayment;
    completeCheckout: (
      input?: CompleteCheckoutInput | undefined
    ) => PromiseRunResponse<DataErrorCheckoutTypes, FunctionErrorCheckoutTypes>;
  } = useCheckout();

  const [errors, setErrors] = useState<IFormError[]>([]);

  const checkoutShippingAddress = checkout?.shippingAddress
    ? {
        ...checkout?.shippingAddress,
        phone: checkout?.shippingAddress?.phone || undefined,
      }
    : undefined;

  const checkoutBillingAddress = checkout?.billingAddress
    ? {
        ...checkout?.billingAddress,
        phone: checkout?.billingAddress?.phone || undefined,
      }
    : undefined;

  const getPaymentMethodDescription = () => {
    if (payment?.gateway === "mirumee.payments.dummy") {
      return `Dummy: ${
        dummyStatuses.find(
          status => status.token === selectedPaymentGatewayToken
        )?.label
      }`;
    }
    if (payment?.gateway === "mirumee.payments.adyen") {
      return `Adyen payments`;
    }
    if (payment?.gateway === "mirumee.payments.transferencia") {
      return "Transferencia Bancaria";
    }
    if (payment?.creditCard && payment?.creditCard?.extra_data == null) {
      return `Tarjeta terminada en ${payment?.creditCard.lastDigits}`;
    }
    return `${payment?.creditCard?.extra_data?.readable_method}`;
  };

  useImperativeHandle(ref, () => ({
    complete: async () => {
      changeSubmitProgress(true);
      let data;
      let dataError;
      if (payment?.gateway === "mirumee.payments.adyen") {
        paymentGatewayFormRef.current?.dispatchEvent(
          new Event("submitComplete", { cancelable: true })
        );
      } else {
        const paymentData: any = payment?.creditCard;
        const response = await completeCheckout({ paymentData });
        data = response.data;
        dataError = response.dataError;
        changeSubmitProgress(false);
        const errors = dataError?.error;
        if (errors) {
          setErrors(errors);
        } else {
          setErrors([]);
          onSubmitSuccess({
            id: data?.order?.id,
            orderNumber: data?.order?.number,
            token: data?.order?.token,
            orderStatus: data?.order?.paymentStatus,
            externalResource: data?.confirmationData,
            total_amount: payment?.total!.amount,
          });
        }
      }
    },
  }));
  return (
    <CheckoutReview
      {...props}
      shippingAddress={checkoutShippingAddress}
      billingAddress={checkoutBillingAddress}
      shippingMethodName={checkout?.shippingMethod?.name}
      paymentMethodName={getPaymentMethodDescription()}
      email={checkout?.email}
      errors={errors}
    />
  );
};

const CheckoutReviewSubpage = forwardRef(CheckoutReviewSubpageWithRef);

export { CheckoutReviewSubpage };
