import "./scss/index.scss";

import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { commonMessages } from "@temp/intl";

import { Button, Form, TextField } from "..";
import { TypedPasswordResetRequestMutation } from "./queries";

import { passwordResetUrl } from "../../app/routes";
import { ResetPasswordRequest } from "./gqlTypes/ResetPasswordRequest";

const PasswordResetRequestForm: React.FC = () => {
  const intl = useIntl();

  const disableSubmit = (loading: boolean, data: ResetPasswordRequest) =>
    loading || data?.requestPasswordReset.errors.length === 0;

  const buttonMessage = (loading: boolean, data: ResetPasswordRequest) => {
    if (loading) {
      return intl.formatMessage(commonMessages.loading);
    }
    if (data?.requestPasswordReset.errors.length === 0) {
      return intl.formatMessage({ defaultMessage: "Mirá tu email" });
    }
    return intl.formatMessage({ defaultMessage: "Restablecer" });
  };

  return (
    <div className="password-reset-form">
      <p>
        <FormattedMessage defaultMessage="Por favor, ingresa tu email asi podremos enviarte un link para restablecer tu contraseña" />
      </p>
      <TypedPasswordResetRequestMutation>
        {(passwordReset, { loading, data }) => {
          return (
            <Form
              errors={data?.requestPasswordReset.errors || []}
              onSubmit={(event, { email }) => {
                event.preventDefault();
                passwordReset({
                  variables: {
                    email,
                    redirectUrl: `${window.location.origin}${passwordResetUrl}`,
                  },
                });
              }}
            >
              <TextField
                name="email"
                autoComplete="email"
                label={intl.formatMessage(commonMessages.eMail)}
                type="email"
                required
              />
              <div className="password-reset-form__button">
                <Button
                  testingContext="submit"
                  type="submit"
                  {...(disableSubmit(loading, data) && { disabled: true })}
                >
                  {buttonMessage(loading, data)}
                </Button>
              </div>
            </Form>
          );
        }}
      </TypedPasswordResetRequestMutation>
    </div>
  );
};

export default PasswordResetRequestForm;
