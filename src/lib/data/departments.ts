import { createClient } from "@/lib/supabase/server";
import {
  Department,
  DepartmentInsert,
  DepartmentUpdate,
  DepartmentWithUnpaidStats,
  InvoiceData,
} from "@/types";
import { calculateUnpaidInvoiceStats } from "@/lib/utils";

export async function getDepartments(): Promise<DepartmentWithUnpaidStats[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .select(`*, invoices:invoices!invoices_department_id_fkey(status, amount)`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching departments:", error);
    throw new Error("Failed to fetch departments");
  }

  type RawInvoiceFromSupabase = {
    status: string | null;
    amount: number;
  };

  type RawDepartmentFromSupabase = Department & {
    invoices?: RawInvoiceFromSupabase[];
  };

  return (data || []).map((department: RawDepartmentFromSupabase) => {
    const rawInvoices = department.invoices || [];

    const processedInvoices: InvoiceData[] = rawInvoices
      .filter(
        (
          inv
        ): inv is RawInvoiceFromSupabase & { status: InvoiceData["status"] } =>
          inv.status !== null &&
          ["unpaid", "paid", "partial", "cancelled"].includes(inv.status)
      )
      .map((inv) => ({
        status: inv.status,
        amount: inv.amount,
      }));

    const stats = calculateUnpaidInvoiceStats(processedInvoices);

    return {
      ...department,
      ...stats,
    } as DepartmentWithUnpaidStats;
  });
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
