import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  Invoice,
  InvoiceInsert,
  InvoiceUpdate,
  EnrichedInvoice,
} from "@/types";
import { QueryData } from "@supabase/supabase-js";

export const getEnrichedInvoices = cache(
  async (): Promise<EnrichedInvoice[]> => {
    const supabase = await createClient();

    const enrichedInvoicesQuery = supabase.from("invoices").select(`
    *,
    supplier:suppliers (*),
    department:departments (*)
  `);

    type EnrichedInvoices = QueryData<typeof enrichedInvoicesQuery>;

    const { data, error } = await enrichedInvoicesQuery;

    if (error) {
      console.error("Error fetching invoices:", error);
      throw new Error("Failed to fetch invoices");
    }

    return (data as EnrichedInvoices) || [];
  }
);

export async function createInvoice(invoice: InvoiceInsert): Promise<Invoice> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .insert(invoice)
    .select()
    .single();

  if (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }

  return data;
}

export async function updateInvoice(
  id: number,
  updates: InvoiceUpdate
): Promise<Invoice> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
  return data;
}

export async function deleteInvoice(id: number): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("invoices").delete().eq("id", id);

  if (error) {
    console.error("Error deleting invoice:", error);
    throw new Error("Failed to delete invoice");
  }
}

export async function deleteInvoices(ids: number[]): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("invoices").delete().in("id", ids);

  if (error) {
    console.error("Error deleting invoices:", error);
    throw new Error("Failed to delete invoices");
  }
}

export async function payInvoice(
  id: number,
  paymentDate: Date
): Promise<Invoice> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .update({
      payment_date: paymentDate.toISOString(),
      status: "paid",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error paying invoice:", error);
    throw new Error("Failed to pay invoice");
  }
  return data;
}
