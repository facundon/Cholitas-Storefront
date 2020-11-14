import { shallow } from "enzyme";
import "@components/organisms/MercadoPagoCreditCardForm/node_modules/jest-styled-components";
import React from "react";

import { AddressSummary } from ".";

describe("<AddressSummary />", () => {
  it("exists", () => {
    const wrapper = shallow(<AddressSummary />);

    expect(wrapper.exists()).toEqual(true);
  });
});
