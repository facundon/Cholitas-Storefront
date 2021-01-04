import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Icon } from "@components/atoms";
import { TaxedMoney } from "@components/containers";
import { CartSummaryRow } from "@components/molecules";
import { commonMessages } from "@temp/intl";

import * as S from "./styles";
import { ICostLine, ICosts, IProps } from "./types";

const CostLine = ({
  name,
  cost,
  last = false,
  negative = false,
}: ICostLine) => (
  <S.CostLine last={last}>
    <span>{name}</span>
    <span data-test={`cartSummaryCost${name.replace(/\s/g, "")}`}>
      {negative && "- "}
      <TaxedMoney taxedMoney={cost} />
    </span>
  </S.CostLine>
);

const Costs = ({ subtotal, promoCode, shipping, total, totalWithRecharge, installmentsCosts }: ICosts) => {
  const recharge = {
    gross: {
      amount: totalWithRecharge - total?.gross.amount,
      currency: "ARS"
    },
    net:{
      amount: totalWithRecharge - total?.gross.amount,
      currency: "ARS"
    }
  }

  const totalAmount = {
    gross: {
      amount: totalWithRecharge || total,
      currency: "ARS"
    },
    net:{
      amount: totalWithRecharge || total,
      currency: "ARS"
    }
  }

  const intl = useIntl();
  return (
    <S.Costs>
      {subtotal && (
        <CostLine
          name={intl.formatMessage(commonMessages.subtotal)}
          cost={subtotal}
        />
      )}     
      {totalWithRecharge != total?.gross.amount && (
        <CostLine
          name={intl.formatMessage(commonMessages.recharge)}
          cost={recharge}
        />
      )}
      {shipping && (
        <CostLine
          name={intl.formatMessage(commonMessages.shipping)}
          cost={shipping}
        />
      )}
      {promoCode && promoCode.gross.amount > 0 && (
        <CostLine
          name={intl.formatMessage(commonMessages.promoCode)}
          cost={promoCode}
          negative
        />
      )}
      {installmentsCosts && (
        <S.CostLine last={true}>
         <span>{intl.formatMessage(commonMessages.total)}</span>
         <span data-test={`cartSummaryCost${intl.formatMessage(commonMessages.total).replace(/\s/g, "")}`}>
          {`${installmentsCosts?.installments} ${installmentsCosts?.installments != 1 ? "cuotas" : "cuota"} de ${installmentsCosts?.installment_amount} ARS`}
         </span>
       </S.CostLine>
      )}
      {total && (
        <CostLine
          name={installmentsCosts ? "" : "Total"}
          cost={totalAmount}
          last={installmentsCosts ? false : true}
        />
      )}
    </S.Costs>
  );
};

/**
 * Cart summary displayed in checkout page
 */
const CartSummary: React.FC<IProps> = ({
  subtotal,
  total,
  shipping,
  promoCode,
  products,
  totalWithRecharge,
  installmentsCosts,
}: IProps) => {
  const [mobileCartOpened, setMobileCartOpened] = useState(false);
  const [installmentRate, setInstallmentRate] = useState({TEA: "", CFT: ""})

  useEffect(()=>{
    if (installmentsCosts && Object.keys(installmentsCosts).length != 0) {
      const installmentRate = installmentsCosts?.labels?.find((e: any) => e.includes("CFT")).split('|')
      console.log(installmentsCosts)
      setInstallmentRate(
        {
          TEA: installmentRate[1]?.replace("TEA_", ""),
          CFT: installmentRate[0]?.replace("CFT_", ""),
        }
      )
    }
  }, [installmentsCosts])

  return (
    <S.Wrapper mobileCartOpened={mobileCartOpened}>
      <S.Title
        data-test="cartSummaryTitle"
        onClick={() => setMobileCartOpened(!mobileCartOpened)}
      >
        <FormattedMessage defaultMessage="Resumen de la Bolsa" />
        <S.ArrowUp mobileCartOpened={mobileCartOpened}>
          <Icon name="arrow_up" size={24} />
        </S.ArrowUp>
      </S.Title>
      <S.Content>
        <S.HR />
        <S.CartSummaryProductList>
          {products?.map((product, index) => (
            <div key={product.sku}>
              <S.ProductLine>
                <CartSummaryRow
                  index={index}
                  sku={product.sku}
                  quantity={product.quantity}
                  name={product.name}
                  price={product.price}
                  thumbnail={product.thumbnail}
                />
              </S.ProductLine>
              <S.HR />
            </div>
          ))}
        </S.CartSummaryProductList>
        <Costs
          subtotal={subtotal}
          total={total}
          shipping={shipping}
          promoCode={promoCode}
          totalWithRecharge={totalWithRecharge}
          installmentsCosts={installmentsCosts}
        />
        <S.TEA>
          {installmentRate?.TEA != "" &&
            <span>TEA: {installmentRate?.TEA}</span>
          }
        </S.TEA>
        <S.CFT>
          {installmentRate?.CFT != "" &&
            <span>CFT: {installmentRate?.CFT}</span>
          }
        </S.CFT>
      </S.Content>
    </S.Wrapper>
  );
};

export { CartSummary };
