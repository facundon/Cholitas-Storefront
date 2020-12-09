import React from "react";
import { useIntl } from "react-intl";
import { useAlert } from "react-alert";

import { useAuth } from "@saleor/sdk";
import { ServiceWorkerContext } from "@components/containers";

const Notifications: React.FC = () => {
  const alert = useAlert();
  const intl = useIntl();

  const { updateAvailable } = React.useContext(ServiceWorkerContext);

  React.useEffect(() => {
    if (updateAvailable) {
      alert.show(
        {
          actionText: intl.formatMessage({ defaultMessage: "Refresh" }),
          content: intl.formatMessage({
            defaultMessage:
              "Para actualizar la aplicación a la ultima versión, por favor refresca la página!",
          }),
          title: intl.formatMessage({
            defaultMessage: "Nueva versión disponible!",
          }),
        },
        {
          onClose: () => {
            location.reload();
          },
          timeout: 0,
          type: "success",
        }
      );
    }
  }, [updateAvailable]);

  const { authenticated } = useAuth();
  const [prevAuthenticated, setPrevAuthenticated] = React.useState<
    boolean | undefined
  >();

  React.useEffect(() => {
    if (prevAuthenticated !== undefined && authenticated !== undefined) {
      if (!prevAuthenticated && authenticated) {
        alert.show(
          {
            title: intl.formatMessage({
              defaultMessage: "Ingresaste a tu cuenta",
            }),
          },
          { type: "success" }
        );
      } else if (prevAuthenticated && !authenticated) {
        alert.show(
          {
            title: intl.formatMessage({
              defaultMessage: "Saliste de tu cuenta",
            }),
          },
          { type: "success" }
        );
      }
      setPrevAuthenticated(authenticated);
    } else if (authenticated !== undefined) {
      setPrevAuthenticated(authenticated);
    }
  }, [authenticated]);

  return null;
};

export default Notifications;
