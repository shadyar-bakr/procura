"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type DashboardCardProps = {
  totalSuppliers: number;
  suppliersLastMonth: number;
  totalInvoices: number;
  invoicesLastMonth: number;
  paidInvoicesAmount: number;
  paidInvoicesLastMonth: number;
  unpaidInvoicesAmount: number;
  unpaidInvoicesLastMonth: number;
};

const renderComparison = (value: number, text: string) => (
  <p className="text-xs text-muted-foreground flex items-center">
    {value >= 0 ? (
      <ArrowUp className="size-5 text-green-500" />
    ) : (
      <ArrowDown className="size-5 text-red-500" />
    )}
    {value} {text}
  </p>
);

export function DashboardCards({
  totalSuppliers,
  suppliersLastMonth,
  totalInvoices,
  invoicesLastMonth,
  paidInvoicesAmount,
  paidInvoicesLastMonth,
  unpaidInvoicesAmount,
  unpaidInvoicesLastMonth,
}: DashboardCardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
          <Users className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSuppliers}</div>
          {renderComparison(suppliersLastMonth, "in last 30 days")}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <ShoppingCart className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInvoices}</div>
          {renderComparison(invoicesLastMonth, "in last 30 days")}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
          <DollarSign className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(paidInvoicesAmount)}
          </div>
          {renderComparison(paidInvoicesLastMonth, ` invoices in last 30 days`)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
          <DollarSign className="size-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(unpaidInvoicesAmount)}
          </div>
          {renderComparison(
            unpaidInvoicesLastMonth,
            `invoices in last 30 days`
          )}
        </CardContent>
      </Card>
    </div>
  );
}
