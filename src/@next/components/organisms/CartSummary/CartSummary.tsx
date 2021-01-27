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

const Costs = ({ subtotal, promoCode, shipping, total, totalWithRecharge, installmentsCosts, method }: ICosts) => {
  const recharge = {
    gross: {
      amount: installmentsCosts?.installment_amount || 0,
      currency: "ARS"
    },
    net:{
      amount: installmentsCosts?.installment_amount || 0,
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
      {totalWithRecharge != total?.gross.amount && method == "card" && recharge?.gross.amount != 0 && (
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
          name={intl.formatMessage(commonMessages.discount)}
          cost={promoCode}
          negative
        />
      )}
      {installmentsCosts && method == "card" &&(
        <S.CostLine last={true}>
         <span>{intl.formatMessage(commonMessages.total)}</span>
         <span data-test={`cartSummaryCost${intl.formatMessage(commonMessages.total).replace(/\s/g, "")}`}>
          {`${installmentsCosts?.installments} ${installmentsCosts?.installments != 1 ? "cuotas" : "cuota"} de ${installmentsCosts?.installment_amount} ARS`}
         </span>
       </S.CostLine>
      )}
      {total && method == "card" &&(
        <S.CostLine last={installmentsCosts ? false : true}>
          <span>{installmentsCosts ? "" : "Total"}</span>
          <span data-test={`cartSummaryCost${intl.formatMessage(commonMessages.total).replace(/\s/g, "")}`}>
            {`${installmentsCosts ? '(' : ""}${installmentsCosts ? totalWithRecharge.toFixed(2) : total.gross.amount.toFixed(2)} ARS${installmentsCosts ? ')' : ""}`}
          </span>
        </S.CostLine>
      )}
      {total && method == "other" && (
        <CostLine
          name={intl.formatMessage(commonMessages.total)}
          cost={total}
          last
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
  method,
}: IProps) => {
  const [mobileCartOpened, setMobileCartOpened] = useState(false);
  const [installmentRate, setInstallmentRate] = useState({TEA: "", CFT: ""})

  useEffect(()=>{
    if (installmentsCosts && Object.keys(installmentsCosts).length != 0) {
      const installmentRate = installmentsCosts?.labels?.find((e: any) => e.includes("CFT")).split('|')
      setInstallmentRate(
        {
          TEA: installmentRate[1]?.replace("TEA_", ""),
          CFT: installmentRate[0]?.replace("CFT_", ""),
        }
      )
    } else {
      setInstallmentRate({TEA: "", CFT: ""})
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
          method={method}
        />
        {method == "card" && ( 
        <>
        {installmentRate?.TEA != "" &&
          <S.TEA>
              <span>TEA: {installmentRate?.TEA}</span>
          </S.TEA>
        }
        {installmentRate?.CFT != "" &&
          <S.CFT>
            <span>CFT: {installmentRate?.CFT}</span>
          </S.CFT>
        }
        </>
        )}
      </S.Content>
    </S.Wrapper>
  );
};

export { CartSummary };
