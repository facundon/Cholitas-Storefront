import "./scss/helloPrompts.scss";

import * as React from "react";

export interface HelloPromptProps {
  name: string;
}

const HelloPrompt = ({ name }) => {
  return (
    <div className="hello-prompt">
      <h3>Hola{name !== "" ? `, ${name}!` : "!"}</h3>
      <p>Bienvenido a tu cuenta de usuario</p>
    </div>
  );
};

export default HelloPrompt;
