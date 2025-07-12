import { createClient } from "@/lib/supabase/server";
import {
  Supplier,
  SupplierInsert,
  SupplierUpdate,
  SupplierWithUnpaidStats,
  InvoiceData,
} from "@/types";

export async function getSuppliers(): Promise<SupplierWithUnpaidStats[]> {
  const supabase = await createClient();

  // Fetch suppliers with their unpaid invoices (status = 'unpaid')
  const { data, error } = await supabase
    .from("suppliers")
    .select(`*, invoices:invoices!invoices_supplier_id_fkey(status, amount)`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching suppliers:", error);
    throw new Error("Failed to fetch suppliers");
  }

  // Aggregate unpaid invoices for each supplier
  return (data || []).map((supplier) => {
    const invoices =
      (supplier as Supplier & { invoices: InvoiceData[] }).invoices || [];
    const unpaidInvoices = invoices.filter(
      (invoice: InvoiceData) => invoice.status === "unpaid"
    );

    return {
      ...supplier,
      unpaid_invoice_count: unpaidInvoices.length,
      unpaid_invoice_total: unpaidInvoices.reduce(
        (sum: number, invoice: InvoiceData) => sum + (invoice.amount || 0),
        0
      ),
    } as SupplierWithUnpaidStats;
  });
}

export async function getSupplierById(id: number): Promise<Supplier | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching supplier:", error);
    return null;
  }

  return data;
}

export async function createSupplier(
  supplier: SupplierInsert
): Promise<Supplier> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .insert(supplier)
    .select()
    .single();

  if (error) {
    console.error("Error creating supplier:", error);
    throw new Error("Failed to create supplier");
  }
  return data;
}

export async function updateSupplier(
  id: number,
  updates: SupplierUpdate
): Promise<Supplier> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating supplier:", error);
    throw new Error("Failed to update supplier");
  }
  return data;
}

export async function deleteSupplier(id: number): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("suppliers").delete().eq("id", id);

  if (error) {
    console.error("Error deleting supplier:", error);
    throw new Error("Failed to delete supplier");
  }
}

export async function deleteSuppliers(ids: number[]): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("suppliers").delete().in("id", ids);

  if (error) {
    console.error("Error deleting suppliers:", error);
    throw new Error("Failed to delete suppliers");
  }
}
