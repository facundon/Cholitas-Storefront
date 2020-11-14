import { shallow } from "enzyme";
import "@components/organisms/MercadoPagoCreditCardForm/node_modules/jest-styled-components";
import React from "react";

import { CartHeader } from ".";

describe("<CartHeader />", () => {
  it("exists", () => {
    const wrapper = shallow(<CartHeader />);

    expect(wrapper.exists()).toEqual(true);
  });
});
