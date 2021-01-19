import React from "react";

import { ErrorMessage } from "@components/atoms";
import { Nav, Icon } from 'rsuite'

import * as S from "./styles";
import { IProps } from "./types";


const TransferenciaBancariaPaymentGateway: React.FC<IProps> = ({
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

  const handleSubmit = async (formData: any) => {
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
}
  

  return (
    <S.Wrapper data-test="mercadopagoPaymentGateway">
      <Nav justified appearance="tabs" onSelect={handleSelect} activeKey={method} style={{marginBottom: 20, textAlign: "center", zIndex: 0}}>
        <Nav.Item eventKey="card" icon={<Icon icon="credit-card"/>}>Tarjeta</Nav.Item>
        <Nav.Item eventKey="other" icon={<Icon icon="money"/>}>Efectivo</Nav.Item>
      </Nav>
      <ErrorMessage errors={allErrors} />
    </S.Wrapper>
  );
};

export { TransferenciaBancariaPaymentGateway };
