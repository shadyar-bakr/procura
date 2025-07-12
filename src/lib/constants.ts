export const INVOICE_STATUS = {
  PAID: "paid",
  UNPAID: "unpaid",
  PARTIAL: "partial",
  CANCELLED: "cancelled",
} as const;

export const INVOICE_STATUS_LIST = [
  INVOICE_STATUS.PAID,
  INVOICE_STATUS.UNPAID,
  INVOICE_STATUS.PARTIAL,
  INVOICE_STATUS.CANCELLED,
] as const;

export const CURRENCY = "IQD";
