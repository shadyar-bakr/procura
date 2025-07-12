import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, currency: "IQD") => {
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  };

  if (currency === "IQD") {
    options.minimumFractionDigits = 0;
    options.maximumFractionDigits = 2;
  }

  return new Intl.NumberFormat("en-US", options).format(amount);
};

import { InvoiceData } from "@/types";

export const calculateUnpaidInvoiceStats = (invoices: InvoiceData[]) => {
  const unpaidInvoices = invoices.filter(
    (invoice) => invoice.status === "unpaid"
  );
  return {
    unpaid_invoice_count: unpaidInvoices.length,
    unpaid_invoice_total: unpaidInvoices.reduce(
      (sum, invoice) => sum + (invoice.amount ?? 0),
      0
    ),
  };
};
