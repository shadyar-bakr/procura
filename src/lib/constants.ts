export const INVOICE_STATUS = {
  PAID: "Paid",
  UNPAID: "not-paid",
} as const;

export const INVOICE_STATUS_LIST = [
  INVOICE_STATUS.PAID,
  INVOICE_STATUS.UNPAID,
] as const;

export const CURRENCY = "USD";
