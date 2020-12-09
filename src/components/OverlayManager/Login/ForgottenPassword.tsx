import React from "react";
import { FormattedMessage } from "react-intl";

const ForgottenPassword: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => (
  <>
    <div className="login__content__password-reminder">
      <p>
        <FormattedMessage defaultMessage="Olvidaste tu contraseña?" />{" "}
        <span
          className="u-link"
          onClick={onClick}
          data-test="accountOverlayForgottenPasswordLink"
        >
          <FormattedMessage defaultMessage="Click aquí" />
        </span>
      </p>
    </div>
  </>
);

export default ForgottenPassword;
