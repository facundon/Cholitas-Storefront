import "./scss/index.scss";

import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../core/config";
import Button from "../Button";

interface NotFoundProps {
  message?: string;
}

const NotFound: React.FC<NotFoundProps> = () => (
  <div className="not-found-page">
    <h2 className="not-found-page__header">
      <FormattedMessage defaultMessage="404" />
    </h2>
    <div className="not-found-page__ruler" />
    <div className="not-found-page__message">
      <p>
        <FormattedMessage defaultMessage="No pudimos encontrar la página que estas buscando!" />{" "}
      </p>
      <p>
        <FormattedMessage defaultMessage="Tal vez fue un error de tipeo, o la página fue movida." />{" "}
      </p>
      <p>
        <FormattedMessage defaultMessage="Te pedimos disculpas y que tengas un buen día!." />
      </p>
    </div>
    <div className="not-found-page__button">
      <Link to={BASE_URL}>
        <Button testingContext="404pageGotoHomeButton" secondary>
          <FormattedMessage defaultMessage="Volver a Inicio" />
        </Button>
      </Link>
    </div>
  </div>
);

export default NotFound;
