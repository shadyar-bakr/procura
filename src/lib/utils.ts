import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChartData, ActionResponse } from "@/types";
import { toast } from "sonner";

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

export function calculateInvoiceAmounts(
  invoices: Array<{
    created_at: string | null;
    amount: number;
    discount_amount: number | null;
  }>,
  thirtyDaysAgo: Date
) {
  const totalAmount =
    invoices?.reduce(
      (acc, inv) => acc + (inv.amount - (inv.discount_amount || 0)),
      0
    ) || 0;

  const lastMonthAmount =
    invoices
      ?.filter((i) => i.created_at && new Date(i.created_at) > thirtyDaysAgo)
      .reduce(
        (acc, inv) => acc + (inv.amount - (inv.discount_amount || 0)),
        0
      ) || 0;

  return { totalAmount, lastMonthAmount };
}

export function aggregateChartData<
  T extends { amount: number; discount_amount: number | null },
  K extends keyof T
>(
  data: T[],
  key: K,
  nameExtractor: (item: T) => string | undefined,
  sliceCount = 5
): ChartData[] {
  const totals: Record<string, number> = {};

  data.forEach((item) => {
    const name = nameExtractor(item);
    if (name) {
      const amount = item.amount - (item.discount_amount || 0);
      totals[name] = (totals[name] || 0) + amount;
    }
  });

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, sliceCount)
    .map(([name, total], index) => ({
      name,
      total,
      fill: `var(--chart-${index + 1})`,
    }));
}

export function countInvoicesLastMonth(
  invoices: Array<{ created_at: string | null }>,
  thirtyDaysAgo: Date
): number {
  return (
    invoices?.filter(
      (i) => i.created_at && new Date(i.created_at) > thirtyDaysAgo
    ).length || 0
  );
}

export function generateChartConfig(data: { name: string; fill: string }[]) {
  return Object.fromEntries(
    data.map((item) => [
      item.name,
      {
        label: item.name,
        color: item.fill,
      },
    ])
  );
}

export async function handleAction<T, R>(
  action: (formData: FormData) => Promise<ActionResponse<R>>,
  data: T,
  requiresFormData: true
): Promise<boolean>;
export async function handleAction<T, R>(
  action: (data: T) => Promise<ActionResponse<R>>,
  data: T,
  requiresFormData: false
): Promise<boolean>;
export async function handleAction<T, R>(
  action:
    | ((formData: FormData) => Promise<ActionResponse<R>>)
    | ((data: T) => Promise<ActionResponse<R>>),
  data: T,
  requiresFormData: boolean = true
): Promise<boolean> {
  let result: ActionResponse<R>;

  if (requiresFormData) {
    const formData = new FormData();
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    result = await (
      action as (formData: FormData) => Promise<ActionResponse<R>>
    )(formData);
  } else {
    result = await (action as (data: T) => Promise<ActionResponse<R>>)(data);
  }

  if (result.success) {
    toast.success(result.message);
    return true; // Indicate success
  } else {
    toast.error(result.message);
    if (result.errors) {
      Object.values(result.errors).forEach((error) => {
        if (Array.isArray(error)) {
          error.forEach((e) => toast.error(e));
        }
      });
    }
    return false; // Indicate failure
  }
}

import { z } from "zod";

export function validateAndExtract<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  data: FormData | Record<string, unknown>
) {
  let parsed: z.SafeParseReturnType<
    z.input<z.ZodObject<T>>,
    z.infer<z.ZodObject<T>>
  >;

  if (data instanceof FormData) {
    const values = Object.fromEntries(data.entries());
    parsed = schema.safeParse(values);
  } else {
    parsed = schema.safeParse(data);
  }

  if (!parsed.success) {
    return {
      success: false as const,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  return { success: true as const, data: parsed.data };
}

export function processRawInvoices(
  rawInvoices: Array<{
    status: string | null;
    amount: number;
    discount_amount?: number | null;
  }>
): InvoiceData[] {
  return rawInvoices
    .filter(
      (inv): inv is { status: InvoiceData["status"]; amount: number } =>
        inv.status !== null &&
        ["unpaid", "paid", "partial", "cancelled"].includes(inv.status)
    )
    .map((inv) => ({
      status: inv.status as InvoiceData["status"],
      amount: inv.amount,
    }));
}
