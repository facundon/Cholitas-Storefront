import { css } from "styled-components";

import { styled } from "@styles";

const inputStyle = css<{ checked: boolean }>`
  ${props => props.checked && `color: #8f8c88;`}

  display: flex;
  align-items: center;
  cursor: pointer;

  input[type="radio"] {
    opacity: 0;
    position: fixed;
    width: 0;
  }
  > div {
    display: inline-block;
    width: 1em;
    height: 1em;
    margin: 0.25em 1em 0.25em 0.25em;
    border: 0.1em solid #8f8c88;
    border-radius: 0.5em;
    background: #ffffff;
    vertical-align: bottom;
  }
  ${props =>
    props.checked &&
    `> div > span {
      display: block;
      width: 0.5em;
      height: 0.5em;
      margin: 0.125em;
      border-radius: 0.25em;
      background: #333;
    }`}
`;

export const Input = styled.div<{ checked: boolean }>`
  ${inputStyle}
`;

export const LabeledInput = styled.label<{ checked: boolean }>`
  ${inputStyle}
`;
