import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Button } from "../..";

const Empty: React.FC<{ overlayHide(): void }> = ({ overlayHide }) => (
  <div className="cart__empty">
    <h4>
      <FormattedMessage defaultMessage="Tu bolsa esta vacía!" />
    </h4>
    <p>
      <FormattedMessage defaultMessage="Todavía no agregaste nada. Estamos seguros que vas a encontrar algo que te encante!" />
    </p>
    <div className="cart__empty__action">
      <Button
        testingContext="emptyCartHideOverlayButton"
        secondary
        onClick={overlayHide}
      >
        <FormattedMessage defaultMessage="Continuar Comprando" />
      </Button>
    </div>
  </div>
);

export default Empty;
