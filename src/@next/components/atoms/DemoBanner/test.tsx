import { shallow } from "enzyme";
import "@components/organisms/MercadoPagoCreditCardForm/node_modules/jest-styled-components";
import React from "react";

import { DemoBanner } from ".";

describe("<DemoBanner />", () => {
  it("exists", () => {
    const wrapper = shallow(<DemoBanner />);

    expect(wrapper.exists()).toEqual(true);
  });
});
