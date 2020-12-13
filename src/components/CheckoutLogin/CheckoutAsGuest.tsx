import React from "react";
import { FormattedMessage } from "react-intl";

import { Link } from "react-router-dom";
import { Button, OverlayTheme, OverlayType } from "..";
import { OverlayContextInterface } from "../Overlay";

const CheckoutAsGuest: React.FC<{
  overlay: OverlayContextInterface;
  checkoutUrl: string;
}> = ({ overlay, checkoutUrl }) => (
  <div className="checkout-login__guest">
    <h3 className="checkout__header">
      <FormattedMessage defaultMessage="Continuar como Invitado" />
    </h3>
    <p>
      <FormattedMessage defaultMessage="Si no queres registrar una cuenta, no te preocupes. Podes realizar compras como invitado. Te vamos a tratar igual que a un usuario registrado!" />
    </p>
    <Link to={checkoutUrl}>
      <Button testingContext="continueAsGuestButton">
        <FormattedMessage defaultMessage="Continuar como invitado" />
      </Button>
    </Link>

    <p>
      <FormattedMessage defaultMessage="o podes" />{" "}
      <span
        data-test="showRegisterOverlay"
        className="u-link"
        onClick={() => overlay.show(OverlayType.register, OverlayTheme.right)}
      >
        <FormattedMessage defaultMessage="crear una cuenta" />
      </span>
    </p>
  </div>
);

export default CheckoutAsGuest;
