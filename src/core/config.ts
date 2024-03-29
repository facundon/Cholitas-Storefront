/* eslint-disable global-require */

import { generatePageUrl } from "./utils";

export const BASE_URL = "/";
export const PRODUCTS_PER_PAGE = 9;
export const SUPPORT_EMAIL = "cholitas.deco@gmail.com";
export const TRANSFERENCIA_PROMOCODE = "391F65D3F6E9";
export const DESTACADO_META = "destacado";
export const PROVIDERS = {
  TRANSFERENCIA: {
    label: "Transferencia Bancaria",
  },
  MERCADOPAGO: {
    label: "Mercado Pago",
    script: {
      src: "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js",
    },
  },
  BRAINTREE: {
    label: "Braintree",
  },
  DUMMY: {
    label: "Dummy",
  },
  STRIPE: {
    label: "Stripe",
  },
  ADYEN: {
    label: "Adyen",
    script: {
      src: "",
      integrity:
        "sha384-wG2z9zSQo61EIvyXmiFCo+zB3y0ZB4hsrXVcANmpP8HLthjoQJQPBh7tZKJSV8jA",
      crossOrigin: "anonymous",
    },
    style: {
      src: "",
      integrity:
        "sha384-8ofgICZZ/k5cC5N7xegqFZOA73H9RQ7H13439JfAZW8Gj3qjuKL2isaTD3GMIhDE",
      crossOrigin: "anonymous",
    },
  },
};
export const STATIC_PAGES = [
  {
    label: "About",
    url: generatePageUrl("about"),
  },
];
export const SOCIAL_MEDIA = [
  {
    ariaLabel: "instagram",
    href: "https://www.instagram.com/cholitas.deco/",
    path: require("../images/instagram-icon.svg"),
  },
];
export const META_DEFAULTS = {
  custom: [],
  description: "Cholitas Deco",
  image: `${window.location.origin}${require("../images/logo.svg")}`,
  title: "Cholitas Deco",
  type: "website",
  url: window.location.origin,
};
export enum CheckoutStep {
  Address = 1,
  Shipping,
  Payment,
  Review,
  PaymentConfirm,
}
export const CHECKOUT_STEPS = [
  {
    index: 0,
    link: "/checkout/address",
    name: "Address",
    nextActionName: "Continue to Shipping",
    onlyIfShippingRequired: false,
    step: CheckoutStep.Address,
  },
  {
    index: 1,
    link: "/checkout/shipping",
    name: "Shipping",
    nextActionName: "Continue to Payment",
    onlyIfShippingRequired: true,
    step: CheckoutStep.Shipping,
  },
  {
    index: 2,
    link: "/checkout/payment",
    name: "Payment",
    nextActionName: "Continue to Review",
    onlyIfShippingRequired: false,
    step: CheckoutStep.Payment,
  },
  {
    index: 3,
    link: "/checkout/review",
    name: "Review",
    nextActionName: "Place order",
    onlyIfShippingRequired: false,
    step: CheckoutStep.Review,
  },
  {
    index: 4,
    link: "/checkout/payment-confirm",
    name: "Payment confirm",
    onlyIfShippingRequired: false,
    step: CheckoutStep.PaymentConfirm,
    withoutOwnView: true,
  },
];
export const INFORMATION = [
  {
    header: "Envíos",
    icon: {
      icon: "truck",
      size: "3x",
      flip: true,
    },
    data: [
      {
        info: "Realizamos envíos a todo el país mediante $Correo$ $Argentino$",
        icon: "info",
      },
      {
        info:
          "Si estas en $CABA$ te podemos enviar tu pedido por $Motomensajeria$",
        icon: "info",
      },
      {
        info:
          "También podes elegir retirar el pedido en nuestro domicilio. Nos encontramos por la zona de $Nueva$ $Pompeya$",
        icon: "info",
      },
    ],
  },
  {
    header: "Medios de Pago",
    icon: {
      icon: "credit-card",
      size: "3x",
      flip: false,
    },
    data: [
      {
        info:
          "Aceptamos hasta $12$ $cuotas$ con todas las tarjetas y $Pago$ $en$ $Efectivo$ mediante $MercadoPago$",
        icon: "info",
      },
      {
        info:
          "También podes elegír $Transferencia$ $Bancaria$ donde tendrás aplicado un $10%$ $de$ $descuento$",
        icon: "info",
      },
    ],
  },
  {
    header: "Contacto",
    icon: {
      icon: "phone",
      size: "3x",
      flip: false,
    },
    data: [
      {
        info: "Email: $cholitas.deco@gmail.com$",
        icon: "envelope",
      },
      {
        info: "Ig: $#cholitas.deco$",
        icon: "instagram",
      },
    ],
  },
  {
    header: "Como Comprar",
    icon: {
      icon: "question",
      size: "3x",
      flip: false,
    },
    data: [
      {
        info: "Agrega a $tu$ $bolsa$ los productos que quieras comprar.",
        icon: "info",
      },
      {
        info:
          "Una vez que tengas todos los productos en tu bolsa, ya podes hacer el $checkout$ . Podrás encontrar la opción dentro de $tu$ $bolsa$",
        icon: "info",
      },
      {
        info:
          "Tendrás que elegir el domicilio a donde querés $recibir$ $el$ $producto$ y el domicilio de facturación.",
        icon: "info",
      },
      {
        info:
          "Si el domicilio de envío es donde vivís, marca la casilla $'$ $Igual$ $a$ $domicilio$ $de$ $envío$ $'$",
        icon: "info",
      },
      {
        info:
          "Luego te consultaremos si $pasas$ $a$ $retirar$ el producto por nuestro domicilio o si te lo $enviamos$",
        icon: "info",
      },
      {
        info:
          "En caso que quieras que te lo enviemos, $nos$ $contactaremos$ $luego$ $de$ $tu$ $compra$ para informarte del $costo$ y $medio$",
        icon: "info",
      },
      {
        info:
          "Si realizas tu pago mediante $MercadoPago$ , tendrás que igresar el $email$ que esta asociado a tu cuenta",
        icon: "info",
      },
      {
        info:
          "Una vez que tu pago se encuentre confirmado, te envíaremos un email con los datos de tu compra",
        icon: "info",
      },
    ],
  },
];
