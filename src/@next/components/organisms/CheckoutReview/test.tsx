import { shallow } from "enzyme";
import "@components/organisms/MercadoPagoCreditCardForm/node_modules/jest-styled-components";
import React from "react";

import { CheckoutReview } from ".";

describe("<CheckoutReview />", () => {
  it("exists", () => {
    const wrapper = shallow(<CheckoutReview />);

    expect(wrapper.exists()).toEqual(true);
  });
});
