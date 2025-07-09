import { createClient } from "@/lib/supabase/server";
import { DashboardMetrics, ChartData, OverviewChartData } from "@/types";
import { INVOICE_STATUS } from "@/lib/constants";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    // Get all data in parallel for efficiency
    const [
      { data: suppliers, error: suppliersError },
      { data: invoices, error: invoicesError },
      { data: paidInvoices, error: paidInvoicesError },
      { data: unpaidInvoices, error: unpaidInvoicesError },
    ] = await Promise.all([
      supabase.from("suppliers").select("id, created_at"),
      supabase
        .from("invoices")
        .select("id, created_at, amount, discount_amount, status"),
      supabase
        .from("invoices")
        .select("amount, discount_amount, created_at")
        .eq("status", INVOICE_STATUS.PAID),
      supabase
        .from("invoices")
        .select("amount, discount_amount, created_at")
        .eq("status", INVOICE_STATUS.UNPAID),
    ]);

    if (
      suppliersError ||
      invoicesError ||
      paidInvoicesError ||
      unpaidInvoicesError
    ) {
      throw new Error("Failed to fetch dashboard data");
    }

    // Calculate metrics
    const totalSuppliers = suppliers?.length || 0;
    const suppliersLastMonth =
      suppliers?.filter(
        (s) => s.created_at && new Date(s.created_at) > thirtyDaysAgo
      ).length || 0;

    const totalInvoices = invoices?.length || 0;
    const invoicesLastMonth =
      invoices?.filter(
        (i) => i.created_at && new Date(i.created_at) > thirtyDaysAgo
      ).length || 0;

    const paidInvoicesAmount =
      paidInvoices?.reduce(
        (acc, inv) => acc + (inv.amount - (inv.discount_amount || 0)),
        0
      ) || 0;

    const paidInvoicesLastMonth =
      paidInvoices
        ?.filter((i) => i.created_at && new Date(i.created_at) > thirtyDaysAgo)
        .reduce(
          (acc, inv) => acc + (inv.amount - (inv.discount_amount || 0)),
          0
        ) || 0;

    const unpaidInvoicesAmount =
      unpaidInvoices?.reduce(
        (acc, inv) => acc + (inv.amount - (inv.discount_amount || 0)),
        0
      ) || 0;

    const unpaidInvoicesLastMonth =
      unpaidInvoices
        ?.filter((i) => i.created_at && new Date(i.created_at) > thirtyDaysAgo)
        .reduce(
          (acc, inv) => acc + (inv.amount - (inv.discount_amount || 0)),
          0
        ) || 0;

    return {
      totalSuppliers,
      suppliersLastMonth,
      totalInvoices,
      invoicesLastMonth,
      paidInvoicesAmount,
      paidInvoicesLastMonth,
      unpaidInvoicesAmount,
      unpaidInvoicesLastMonth,
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw new Error("Failed to fetch dashboard metrics");
  }
}

export async function getOverviewChartData(): Promise<OverviewChartData[]> {
  const supabase = await createClient();

  try {
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("created_at, amount, discount_amount, status");

    if (error) {
      throw new Error("Failed to fetch invoice overview data");
    }

    // Group invoices by month for the last 6 months
    const monthlyData: Record<string, { paid: number; unpaid: number }> = {};
    const currentDate = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthKey = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      monthlyData[monthKey] = { paid: 0, unpaid: 0 };
    }

    invoices?.forEach((invoice) => {
      if (!invoice.created_at) return;

      const invoiceDate = new Date(invoice.created_at);
      const monthKey = invoiceDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (monthlyData[monthKey]) {
        const amount = invoice.amount - (invoice.discount_amount || 0);
        if (invoice.status === INVOICE_STATUS.PAID) {
          monthlyData[monthKey].paid += amount;
        } else {
          monthlyData[monthKey].unpaid += amount;
        }
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      paid: data.paid,
      unpaid: data.unpaid,
    }));
  } catch (error) {
    console.error("Error fetching overview chart data:", error);
    throw new Error("Failed to fetch overview chart data");
  }
}

export async function getTopSuppliersData(): Promise<ChartData[]> {
  const supabase = await createClient();

  try {
    const { data: invoices, error } = await supabase.from("invoices").select(`
        amount,
        discount_amount,
        supplier:suppliers(name)
      `);

    if (error) {
      throw new Error("Failed to fetch top suppliers data");
    }

    // Aggregate by supplier
    const supplierTotals: Record<string, number> = {};

    invoices?.forEach((invoice) => {
      if (invoice.supplier?.name) {
        const amount = invoice.amount - (invoice.discount_amount || 0);
        supplierTotals[invoice.supplier.name] =
          (supplierTotals[invoice.supplier.name] || 0) + amount;
      }
    });

    // Get top 5 suppliers
    return Object.entries(supplierTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, total], index) => ({
        name,
        total,
        fill: `var(--chart-${index + 1})`,
      }));
  } catch (error) {
    console.error("Error fetching top suppliers data:", error);
    throw new Error("Failed to fetch top suppliers data");
  }
}

export async function getTopDepartmentsData(): Promise<ChartData[]> {
  const supabase = await createClient();

  try {
    const { data: invoices, error } = await supabase.from("invoices").select(`
        amount,
        discount_amount,
        department:departments(name)
      `);

    if (error) {
      throw new Error("Failed to fetch top departments data");
    }

    // Aggregate by department
    const departmentTotals: Record<string, number> = {};

    invoices?.forEach((invoice) => {
      if (invoice.department?.name) {
        const amount = invoice.amount - (invoice.discount_amount || 0);
        departmentTotals[invoice.department.name] =
          (departmentTotals[invoice.department.name] || 0) + amount;
      }
    });

    // Get top 5 departments
    return Object.entries(departmentTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, total], index) => ({
        name,
        total,
        fill: `var(--chart-${index + 1})`,
      }));
  } catch (error) {
    console.error("Error fetching top departments data:", error);
    throw new Error("Failed to fetch top departments data");
  }
}
