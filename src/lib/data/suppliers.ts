import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  Supplier,
  SupplierInsert,
  SupplierUpdate,
  SupplierWithUnpaidStats,
  InvoiceData,
} from "@/types";
import { calculateUnpaidInvoiceStats, processRawInvoices } from "@/lib/utils";

export const getSuppliers = cache(
  async (): Promise<SupplierWithUnpaidStats[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("suppliers")
      .select(`*, invoices:invoices!invoices_supplier_id_fkey(status, amount)`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching suppliers:", error);
      throw new Error("Failed to fetch suppliers");
    }

    type RawInvoiceFromSupabase = {
      status: string | null;
      amount: number;
    };

    type RawSupplierFromSupabase = Supplier & {
      invoices?: RawInvoiceFromSupabase[];
    };

    return (data || []).map((supplier: RawSupplierFromSupabase) => {
      const rawInvoices = supplier.invoices || [];

      const processedInvoices: InvoiceData[] = processRawInvoices(rawInvoices);

      const stats = calculateUnpaidInvoiceStats(processedInvoices);

      return {
        ...supplier,
        ...stats,
      } as SupplierWithUnpaidStats;
    });
  }
);

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
