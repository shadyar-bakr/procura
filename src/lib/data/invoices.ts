import { createClient } from "@/lib/supabase/server";
import {
  Invoice,
  EnrichedInvoice,
  InvoiceInsert,
  InvoiceUpdate,
} from "@/types";

export async function getInvoices(): Promise<EnrichedInvoice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      supplier:suppliers(*),
      department:departments(*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching invoices:", error);
    throw new Error("Failed to fetch invoices");
  }

  return data || [];
}

export async function getInvoiceById(
  id: number
): Promise<EnrichedInvoice | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      supplier:suppliers(*),
      department:departments(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }

  return data;
}

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
    throw error;
  }
}

export async function payInvoice(id: number): Promise<Invoice> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .update({ status: "paid", payment_date: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error paying invoice:", error);
    throw error;
  }

  return data;
}

export async function getInvoicesBySupplier(
  supplierId: number
): Promise<EnrichedInvoice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      supplier:suppliers(*),
      department:departments(*)
    `
    )
    .eq("supplier_id", supplierId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching invoices by supplier:", error);
    throw new Error("Failed to fetch invoices by supplier");
  }

  return data || [];
}

export async function getInvoicesByDepartment(
  departmentId: number
): Promise<EnrichedInvoice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      supplier:suppliers(*),
      department:departments(*)
    `
    )
    .eq("department_id", departmentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching invoices by department:", error);
    throw new Error("Failed to fetch invoices by department");
  }

  return data || [];
}
