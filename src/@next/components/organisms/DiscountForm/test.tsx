import { mount } from "enzyme";
import "@components/organisms/MercadoPagoCreditCardForm/node_modules/jest-styled-components";
import React from "react";
import { IntlProvider } from "react-intl";

import { DiscountForm } from ".";

describe("<DiscountForm />", () => {
  it("exists", () => {
    const wrapper = mount(
      <IntlProvider locale="en">
        <DiscountForm />
      </IntlProvider>
    );

    expect(wrapper.exists()).toEqual(true);
  });
});
