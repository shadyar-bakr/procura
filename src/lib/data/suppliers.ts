import { createClient } from "@/lib/supabase/server";
import { Supplier, SupplierInsert, SupplierUpdate } from "@/types";

export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching suppliers:", error);
    throw new Error("Failed to fetch suppliers");
  }

  return data || [];
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
    throw error;
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
    throw error;
  }

  return data;
}

export async function deleteSupplier(id: number): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("suppliers").delete().eq("id", id);

  if (error) {
    console.error("Error deleting supplier:", error);
    throw error;
  }
}
