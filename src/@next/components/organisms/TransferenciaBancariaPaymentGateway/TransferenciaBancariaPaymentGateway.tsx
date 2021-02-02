import React, { useEffect } from "react";

import { ErrorMessage } from "@components/atoms";

import { IProps } from "./types";


const TransferenciaBancariaPaymentGateway: React.FC<IProps> = ({
  processPayment,
  formRef,
  errors = [],
}: IProps) => {

  useEffect(() => {
      const scriptList = document.querySelectorAll("script")
      const convertedNodeList = Array.from(scriptList)
      const mpScript = convertedNodeList.find(script => script.id === "mercadopago-script-id")
      mpScript?.parentNode.removeChild(mpScript)
      const iframesList = document.querySelectorAll('iframe');
      const convertedNodeIframes = Array.from(iframesList)
      const mpIframe = convertedNodeIframes[convertedNodeIframes.length - 1]
      mpScript && 
        mpIframe?.parentNode.removeChild(mpIframe);
  }, [])
 
  const handleSubmit = () => {
    const checkoutForm = {
      brand: null,
      firstDigits: null,
      lastDigits: null,
    }
    processPayment("22222222", checkoutForm)
}

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <ErrorMessage errors={errors} />
    </form>
  );
};

export { TransferenciaBancariaPaymentGateway };
