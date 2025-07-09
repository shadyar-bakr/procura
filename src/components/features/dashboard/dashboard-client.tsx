"use client";

import { DashboardCards } from "@/components/features/dashboard/dashboard-cards";
import { InvoiceOverviewChart } from "@/components/features/dashboard/invoice-overview-chart";
import { BarChart } from "@/components/features/dashboard/bar-chart";
import { DashboardSkeleton } from "./dashboard-skeleton";

type DashboardClientProps = {
  isLoading?: boolean;
  totalSuppliers: number;
  suppliersLastMonth: number;
  totalInvoices: number;
  invoicesLastMonth: number;
  paidInvoicesAmount: number;
  paidInvoicesLastMonth: number;
  unpaidInvoicesAmount: number;
  unpaidInvoicesLastMonth: number;
  overviewChartData: { month: string; paid: number; unpaid: number }[];
  topSuppliersData: { name: string; total: number; fill: string }[];
  topSuppliersConfig: { [key: string]: { label: string; color: string } };
  topDepartmentsData: { name: string; total: number; fill: string }[];
  topDepartmentsConfig: { [key: string]: { label: string; color: string } };
};

export default function DashboardClient({
  isLoading,
  totalSuppliers,
  suppliersLastMonth,
  totalInvoices,
  invoicesLastMonth,
  paidInvoicesAmount,
  paidInvoicesLastMonth,
  unpaidInvoicesAmount,
  unpaidInvoicesLastMonth,
  overviewChartData,
  topSuppliersData,
  topSuppliersConfig,
  topDepartmentsData,
  topDepartmentsConfig,
}: DashboardClientProps) {
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      <h1 className="sr-only">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Col 1 */}
        <div className="flex flex-col space-y-4">
          <DashboardCards
            totalSuppliers={totalSuppliers}
            suppliersLastMonth={suppliersLastMonth}
            totalInvoices={totalInvoices}
            invoicesLastMonth={invoicesLastMonth}
            paidInvoicesAmount={paidInvoicesAmount}
            paidInvoicesLastMonth={paidInvoicesLastMonth}
            unpaidInvoicesAmount={unpaidInvoicesAmount}
            unpaidInvoicesLastMonth={unpaidInvoicesLastMonth}
          />
          <InvoiceOverviewChart data={overviewChartData} className="flex-1" />
        </div>

        {/* Col 2 */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <BarChart
            title="Top 5 Suppliers"
            data={topSuppliersData}
            config={topSuppliersConfig}
            className="flex-1"
          />
          <BarChart
            title="Top 5 Departments"
            data={topDepartmentsData}
            config={topDepartmentsConfig}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
