import { shallow } from "enzyme";
import "@components/organisms/MercadoPagoCreditCardForm/node_modules/jest-styled-components";
import React from "react";

import { TopNavbar } from ".";

describe("<TopNavbar />", () => {
  it("exists", () => {
    const wrapper = shallow(<TopNavbar items={[]} />);

    expect(wrapper.exists()).toEqual(true);
  });
});
