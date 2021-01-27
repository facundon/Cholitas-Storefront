import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { Checkbox } from "@components/atoms";
import { checkoutMessages } from "@temp/intl";

import { DiscountForm } from "../DiscountForm";
import { IDiscountFormData } from "../DiscountForm/types";

import * as S from "./styles";
import { IProps } from "./types";

/**
 * Payment options used in checkout.
 */
const CheckoutPayment: React.FC<IProps> = ({
  promoCodeErrors,
  promoCodeDiscountFormId,
  promoCodeDiscountFormRef,
  promoCodeDiscount,
  addPromoCode,
  removeVoucherCode,
  submitUnchangedDiscount,
  selectedPaymentGateway,
}: IProps) => {
  const [showPromoCodeForm, setShowPromoCodeForm] = useState(
    !!promoCodeDiscount?.voucherCode
  );

  useEffect(() => {
    const isVoucherCode = !!promoCodeDiscount?.voucherCode;
    if (isVoucherCode && selectedPaymentGateway !== "mirumee.payments.transferencia") {
      setShowPromoCodeForm(isVoucherCode);
    }
  }, [promoCodeDiscount?.voucherCode]);

  const handleChangeShowPromoCodeForm = () => {
    setShowPromoCodeForm(!showPromoCodeForm);
  };

  const handleSubmitPromoCode = (discountForm?: IDiscountFormData) => {
    const newPromoCode = discountForm?.promoCode;
    const savedPromoCode = promoCodeDiscount?.voucherCode;

    if ((!newPromoCode || !showPromoCodeForm) && savedPromoCode) {
      removeVoucherCode(savedPromoCode);
    } else if (newPromoCode && newPromoCode !== savedPromoCode) {
      addPromoCode(newPromoCode);
    } else {
      submitUnchangedDiscount();
    }
  };
  useEffect(() => {
    setShowPromoCodeForm(false)
  }, [selectedPaymentGateway])

  return (
    <S.Wrapper>
      <section>
        <S.Title data-test="checkoutPageSubtitle">
          <FormattedMessage {...checkoutMessages.paymentMethod} />
        </S.Title>
        <Checkbox
          data-test="checkoutPaymentPromoCodeCheckbox"
          name="payment-promo-code"
          checked={showPromoCodeForm}
          onChange={handleChangeShowPromoCodeForm}
        >
          <FormattedMessage defaultMessage="Tenes un código de descuento?" />
        </Checkbox>
        {showPromoCodeForm && (
          <S.DiscountField>
            <DiscountForm
              discount={{ promoCode: promoCodeDiscount?.voucherCode }}
              formId={promoCodeDiscountFormId}
              formRef={promoCodeDiscountFormRef}
              handleSubmit={handleSubmitPromoCode}
              errors={promoCodeErrors}
              selectedPaymentGateway={selectedPaymentGateway}
            />
          </S.DiscountField>
        )}
        <S.Divider />
      </section>
    </S.Wrapper>
  );
};

export { CheckoutPayment };
