import * as React from "react";
import { FormattedMessage } from "react-intl";

export const NothingFound: React.FC<{ search: string }> = ({ search }) => {
  return (
    <div className="search__products--not-found">
      <p className="u-lead u-lead--bold u-uppercase">
        <FormattedMessage
          defaultMessage="No pudimos encontrar resultados para: {search}"
          values={{ search }}
        />
      </p>
      <p>
        <FormattedMessage defaultMessage="Asegurate que no haya errores de tipeo!" />
      </p>
    </div>
  );
};

export default NothingFound;
