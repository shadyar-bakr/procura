import DashboardClient from "@/components/features/dashboard/dashboard-client";
import {
  getDashboardMetrics,
  getOverviewChartData,
  getTopSuppliersData,
  getTopDepartmentsData,
} from "@/lib/data/dashboard";
import { PageError } from "@/components/shared/page-error";
import { generateChartConfig } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    // Fetch all dashboard data in parallel for optimal performance
    const [metrics, overviewChartData, topSuppliersData, topDepartmentsData] =
      await Promise.all([
        getDashboardMetrics(),
        getOverviewChartData(),
        getTopSuppliersData(),
        getTopDepartmentsData(),
      ]);

    // Generate chart configs
    const topSuppliersConfig = generateChartConfig(topSuppliersData);

    const topDepartmentsConfig = generateChartConfig(topDepartmentsData);

    return (
      <DashboardClient
        isLoading={false}
        totalSuppliers={metrics.totalSuppliers}
        suppliersLastMonth={metrics.suppliersLastMonth}
        totalInvoices={metrics.totalInvoices}
        invoicesLastMonth={metrics.invoicesLastMonth}
        paidInvoicesAmount={metrics.paidInvoicesAmount}
        paidInvoicesLastMonth={metrics.paidInvoicesLastMonth}
        unpaidInvoicesAmount={metrics.unpaidInvoicesAmount}
        unpaidInvoicesLastMonth={metrics.unpaidInvoicesLastMonth}
        overviewChartData={overviewChartData}
        topSuppliersData={topSuppliersData}
        topSuppliersConfig={topSuppliersConfig}
        topDepartmentsData={topDepartmentsData}
        topDepartmentsConfig={topDepartmentsConfig}
      />
    );
  } catch (error) {
    console.error("Error loading dashboard:", error);

    return (
      <PageError
        title="Error Loading Dashboard"
        message="Failed to load dashboard data. Please try again later."
      />
    );
  }
}
