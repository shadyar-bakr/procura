import { z } from "zod";
import {
  departmentSchema,
  invoiceSchema,
  payInvoiceSchema,
  supplierSchema,
} from "./schemas";
import { Tables, TablesInsert, TablesUpdate } from "./database.types";

// Base types from Supabase
export type Department = Tables<"departments">;
export type Supplier = Tables<"suppliers">;
export type Invoice = Tables<"invoices">;

// Form value types from Zod schemas
export type DepartmentFormValues = z.infer<typeof departmentSchema>;
export type SupplierFormValues = z.infer<typeof supplierSchema>;
export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
export type PayInvoiceFormValues = z.infer<typeof payInvoiceSchema>;

// Enhanced types with relationships
export type EnrichedInvoice = Invoice & {
  supplier?: Supplier | null;
  department?: Department | null;
};

// Enriched types with unpaid invoice stats
export type SupplierWithUnpaidStats = Supplier & {
  unpaid_invoice_count: number;
  unpaid_invoice_total: number;
};

export type DepartmentWithUnpaidStats = Department & {
  unpaid_invoice_count: number;
  unpaid_invoice_total: number;
};

export interface InvoiceData {
  status: "unpaid" | "paid" | "partial" | "cancelled";
  amount: number | null;
}

// Use DB-generated types for inserts/updates
export type DepartmentInsert = TablesInsert<"departments">;
export type DepartmentUpdate = TablesUpdate<"departments">;
export type SupplierInsert = TablesInsert<"suppliers">;
export type SupplierUpdate = TablesUpdate<"suppliers">;
export type InvoiceInsert = TablesInsert<"invoices">;
export type InvoiceUpdate = TablesUpdate<"invoices">;

// Dashboard specific types
export type DashboardMetrics = {
  totalSuppliers: number;
  suppliersLastMonth: number;
  totalInvoices: number;
  invoicesLastMonth: number;
  paidInvoicesAmount: number;
  paidInvoicesLastMonth: number;
  unpaidInvoicesAmount: number;
  unpaidInvoicesLastMonth: number;
};

export type ChartData = {
  name: string;
  total: number;
  fill: string;
};

export type OverviewChartData = {
  month: string;
  paid: number;
  unpaid: number;
};

// Generic action response type for server actions
export type ActionResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code?: string;
    details?: string | null;
    message: string;
  };
  errors?: Record<string, string[] | undefined>;
};
