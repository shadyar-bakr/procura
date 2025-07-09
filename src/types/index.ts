import { Tables } from "./database.types";

// Base types from Supabase
export type Department = Tables<"departments">;
export type Supplier = Tables<"suppliers">;
export type Invoice = Tables<"invoices">;

// Enhanced types with relationships
export type EnrichedInvoice = Invoice & {
  supplier?: Supplier | null;
  department?: Department | null;
};

// Insert and Update types for forms
export type DepartmentInsert = {
  name: string;
  description?: string;
};

export type DepartmentUpdate = {
  name?: string;
  description?: string;
};

export type SupplierInsert = {
  name: string;
  address?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  tax_id?: string;
  notes?: string;
};

export type SupplierUpdate = {
  name?: string;
  address?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  tax_id?: string;
  notes?: string;
};

export type InvoiceInsert = {
  invoice_number: string;
  amount: number;
  discount_amount?: number;
  tax_amount?: number;
  currency?: string;
  status?: string;
  issue_date: string;
  due_date: string;
  payment_date?: string;
  notes?: string;
  supplier_id?: number;
  department_id?: number;
};

export type InvoiceUpdate = {
  invoice_number?: string;
  amount?: number;
  discount_amount?: number;
  tax_amount?: number;
  currency?: string;
  status?: string;
  issue_date?: string;
  due_date?: string;
  payment_date?: string;
  notes?: string;
  supplier_id?: number;
  department_id?: number;
};

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
