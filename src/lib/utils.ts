import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, currency: "IQD" | "USD") => {
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  };

  if (currency === "IQD") {
    options.minimumFractionDigits = 0;
    options.maximumFractionDigits = 2;
  } else if (currency === "USD") {
    options.minimumFractionDigits = 2;
    options.maximumFractionDigits = 2;
  }

  return new Intl.NumberFormat("en-US", options).format(amount);
};
