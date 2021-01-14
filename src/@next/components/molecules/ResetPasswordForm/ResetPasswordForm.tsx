import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Button } from "@components/atoms";
import { commonMessages } from "@temp/intl";
import { TextField } from "../TextField";

import * as S from "./styles";
import { IProps } from "./types";

export const ResetPasswordForm: React.FC<IProps> = ({
  handleBlur,
  handleChange,
  handleSubmit,
  values,
  tokenError,
  passwordError,
  errors,
}: IProps) => {
  const intl = useIntl();
  return (
    <S.Wrapper>
      <h3>
        <FormattedMessage defaultMessage="Restablecer tu contraseña" />
      </h3>

      <p>
        <FormattedMessage defaultMessage="Por favor ingresa una nueva contraseña" />
      </p>
      {tokenError && (
        <S.GeneralError>
          <FormattedMessage defaultMessage="Parece ser que el token para la operación expiró." />
        </S.GeneralError>
      )}
      <form onSubmit={handleSubmit}>
        <S.InputFields>
          <TextField
            label={intl.formatMessage(commonMessages.password)}
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            errors={
              errors.password || passwordError
                ? [
                    {
                      field: "password",
                      message: errors.password || passwordError,
                    },
                  ]
                : undefined
            }
          />
          <TextField
            label={intl.formatMessage({ defaultMessage: "Volver a escribir contraseña" })}
            onBlur={handleBlur}
            name="retypedPassword"
            onChange={handleChange}
            type="password"
            value={values.retypedPassword}
            errors={
              errors.retypedPassword
                ? [
                    {
                      field: "retypedPassword",
                      message: errors.retypedPassword,
                    },
                  ]
                : undefined
            }
          />
        </S.InputFields>

        <Button testingContext="submit" type="submit" fullWidth>
          <FormattedMessage defaultMessage="RESTABLECER" />
        </Button>
      </form>
    </S.Wrapper>
  );
};
