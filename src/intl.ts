import { defineMessages, IntlShape } from "react-intl";

export const commonMessages = defineMessages({
  search: {
    defaultMessage: "buscar",
  },
  outOfStock: {
    defaultMessage: "Sin Stock",
  },
  lowStock: {
    defaultMessage: "Pocas Unidades!",
  },
  noItemsAvailable: {
    defaultMessage: "Sin unidades disponibles",
  },
  noPurchaseAvailable: {
    defaultMessage: "No disponible para la compra",
  },
  purchaseAvailableOn: {
    defaultMessage: `Va a estar disponible para la compra el {date} a las {time}`,
  },
  youMightLike: {
    defaultMessage: "Te puede gustar",
  },
  choosePaymentMethod: {
    defaultMessage: "Por favor elija el método de pago.",
  },
  provideEmailAddress: {
    defaultMessage: "Por favor ingrese un email.",
  },
  account: {
    defaultMessage: "Cuenta",
  },
  myAccount: {
    defaultMessage: "Mi Cuenta",
  },
  orderHistory: {
    defaultMessage: "Mis Ordenes",
  },
  addressBook: {
    defaultMessage: "Mis Direcciones",
  },
  logOut: {
    defaultMessage: "Salir",
  },
  firstName: {
    defaultMessage: "Nombre",
  },
  lastName: {
    defaultMessage: "Apellido",
  },
  password: {
    defaultMessage: "Contraseña",
  },
  quantity: {
    defaultMessage: "Cantidad",
  },
  sku: {
    defaultMessage: "SKU",
  },
  maxQtyIs: {
    defaultMessage: "La cantidad Maxima es {maxQuantity}",
  },
  qty: {
    defaultMessage: "Cantidad",
  },
  subtotal: {
    defaultMessage: "Subtotal",
  },
  shipping: {
    defaultMessage: "Envío",
  },
  promoCode: {
    defaultMessage: "Codigo de Descuento",
  },
  total: {
    defaultMessage: "Total",
  },
  totalPrice: {
    defaultMessage: "Precio",
  },
  checkout: {
    defaultMessage: "Checkout",
  },
  eMail: {
    defaultMessage: "Email",
  },
  shortEmail: {
    defaultMessage: "Email",
  },
  loading: {
    defaultMessage: "Cargando",
  },
  products: {
    defaultMessage: "Productos",
  },
  price: {
    defaultMessage: "Precio",
  },
  variant: {
    defaultMessage: "Variante",
  },
  phone: {
    defaultMessage: "Telefono",
  },
  phoneNumber: {
    defaultMessage: "Numero de Telefono: {phone}",
  },
  showEmail: {
    defaultMessage: "Email: {email}",
  },
  save: {
    defaultMessage: "Guardar",
  },
  add: {
    defaultMessage: "Agregar",
  },
  filterHeader: {
    defaultMessage: "FILTROS",
  },
  clearFilterHeader: {
    defaultMessage: "LIMPIAR FILTROS",
  },
  status: {
    defaultMessage: "Estado",
  },
  cancel: {
    defaultMessage: "Cancelar",
  },
  home: {
    defaultMessage: "Inicio",
  },
});

export const checkoutMessages = defineMessages({
  stepNameAddress: {
    defaultMessage: "Dirección",
  },
  stepNameShipping: {
    defaultMessage: "Envío",
  },
  stepNamePayment: {
    defaultMessage: "Pago",
  },
  stepNameReview: {
    defaultMessage: "Revisar",
  },
  addressNextActionName: {
    defaultMessage: "Elejir Envío",
  },
  shippingNextActionName: {
    defaultMessage: "Continuar al Pago",
  },
  paymentNextActionName: {
    defaultMessage: "Revisar",
  },
  reviewNextActionName: {
    defaultMessage: "Comprar!",
  },
  addNewAddress: {
    defaultMessage: "Agregar nueva dirección",
  },
  shippingMethod: {
    defaultMessage: "Tipo de Envío",
  },
  billingAddress: {
    defaultMessage: "Dirección de Facturación",
  },
  paymentMethod: {
    defaultMessage: "Método de Pago",
  },
  reviewOrder: {
    defaultMessage: "Revisar Orden",
  },
  shippingAddress: {
    defaultMessage: "Dirección de Envío",
  },
  continueShopping: {
    defaultMessage: "CONTINUAR COMPRANDO",
  },
});

export const prodListHeaderCommonMsg = defineMessages({
  sortOptionsClear: {
    defaultMessage: "Limpio",
  },
  sortOptionsPrice: {
    defaultMessage: "Precio Menor-Mayor",
  },
  sortOptionsPriceDsc: {
    defaultMessage: "Precio Mayor-Menor",
  },
  sortOptionsName: {
    defaultMessage: "Nombre Ascendente",
  },
  sortOptionsNameDsc: {
    defaultMessage: "Nombre Descendente",
  },
  sortOptionsUpdatedAt: {
    defaultMessage: "Última Actualización Ascendente",
  },
  sortOptionsUpdatedAtDsc: {
    defaultMessage: "Última Actualización Descendente",
  },
});

export const paymentStatusMessages = defineMessages({
  notCharged: {
    defaultMessage: "Sin Cobrar",
  },
  partiallyCharged: {
    defaultMessage: "Parcialmente Cobrado",
  },
  fullyCharged: {
    defaultMessage: "Cobrado",
  },
  partiallyRefunded: {
    defaultMessage: "Parcialmente Reembolsado",
  },
  fullyRefunded: {
    defaultMessage: "Reembolsado",
  },
});

export const orderStatusMessages = defineMessages({
  draft: {
    defaultMessage: "Borrador",
  },
  unfulfilled: {
    defaultMessage: "Incumplida",
  },
  partiallyFulfilled: {
    defaultMessage: "Parcialmente cumplida",
  },
  fulfilled: {
    defaultMessage: "Cumplida",
  },
  canceled: {
    defaultMessage: "Cancelada",
  },
});

export function translatePaymentStatus(
  status: string,
  intl: IntlShape
): string {
  switch (status) {
    case "Sin Cobrar":
      return intl.formatMessage(paymentStatusMessages.notCharged);
    case "Parcialmente Cobrado":
      return intl.formatMessage(paymentStatusMessages.partiallyCharged);
    case "Cobrado":
      return intl.formatMessage(paymentStatusMessages.fullyCharged);
    case "Parcialmente Reembolsado":
      return intl.formatMessage(paymentStatusMessages.partiallyRefunded);
    case "Reembolsado":
      return intl.formatMessage(paymentStatusMessages.fullyRefunded);
    default:
      return status;
  }
}

export function translateOrderStatus(status: string, intl: IntlShape): string {
  switch (status) {
    case "Borrador":
      return intl.formatMessage(orderStatusMessages.draft);
    case "Incumplida":
      return intl.formatMessage(orderStatusMessages.unfulfilled);
    case "Parcialmente cumplida":
      return intl.formatMessage(orderStatusMessages.partiallyFulfilled);
    case "Cumplida":
      return intl.formatMessage(orderStatusMessages.fulfilled);
    case "Cancelada":
      return intl.formatMessage(orderStatusMessages.canceled);
    default:
      return status;
  }
}
