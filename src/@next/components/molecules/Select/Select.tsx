import React from "react";

import { ErrorMessage } from "@components/atoms";
import * as S from "./styles";
import { IProps } from "./types";

export const Select: React.FC<IProps> = ({
  errors,
  helpText,
  ...rest
}: IProps) => {
  return (
    <>
      <S.Select>
        <select {...rest} />
        <S.ErrorMessages>
          <ErrorMessage errors={errors} />
          {helpText && <S.HelpText>{helpText}</S.HelpText>}
        </S.ErrorMessages>
      </S.Select>
    </>
  );
};
