import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENCY } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
  }).format(amount);
