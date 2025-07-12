import { createClient } from "@/lib/supabase/server";
import { Department, DepartmentInsert, DepartmentUpdate } from "@/types";

export async function getDepartments(): Promise<
  (Department & {
    unpaid_invoice_count: number;
    unpaid_invoice_total: number;
  })[]
> {
  const supabase = await createClient();

  // Fetch departments with their unpaid invoices (status = 'unpaid')
  const { data, error } = await supabase
    .from("departments")
    .select(`*, invoices:invoices!invoices_department_id_fkey(status, amount)`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching departments:", error);
    throw new Error("Failed to fetch departments");
  }

  // Aggregate unpaid invoices for each department
  return (data || []).map((department) => {
    const invoices =
      (
        department as Department & {
          invoices?: { status: string; amount: number | null }[];
        }
      ).invoices || [];
    const unpaidInvoices = invoices.filter((i) => i.status === "unpaid");
    return {
      ...department,
      unpaid_invoice_count: unpaidInvoices.length,
      unpaid_invoice_total: unpaidInvoices.reduce(
        (sum, i) => sum + (i.amount || 0),
        0
      ),
    };
  });
}

export async function getDepartmentById(
  id: number
): Promise<Department | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching department:", error);
    return null;
  }

  return data;
}

export async function createDepartment(
  department: DepartmentInsert
): Promise<Department> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .insert(department)
    .select()
    .single();

  if (error) {
    console.error("Error creating department:", error);
    throw new Error("Failed to create department");
  }
  return data;
}

export async function updateDepartment(
  id: number,
  updates: DepartmentUpdate
): Promise<Department> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating department:", error);
    throw new Error("Failed to update department");
  }
  return data;
}

export async function deleteDepartment(id: number): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("departments").delete().eq("id", id);

  if (error) {
    console.error("Error deleting department:", error);
    throw new Error("Failed to delete department");
  }
}

export async function deleteDepartments(ids: number[]): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("departments").delete().in("id", ids);

  if (error) {
    console.error("Error deleting departments:", error);
    throw new Error("Failed to delete departments");
  }
}
