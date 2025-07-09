import { z } from "zod";

// Based on public.Tables.departments
export const departmentSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().nullable().optional(),
  created_at: z.coerce.date().nullable().optional(),
  updated_at: z.coerce.date().nullable().optional(),
});

// Based on public.Tables.suppliers
export const supplierSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, "Name is required"),
  address: z.string().nullable().optional(),
  contact_person: z.string().nullable().optional(),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .nullable()
    .optional(),
  phone: z.string().nullable().optional(),
  tax_id: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.coerce.date().nullable().optional(),
  updated_at: z.coerce.date().nullable().optional(),
});

// Based on public.Tables.invoices
export const invoiceSchema = z.object({
  id: z.coerce.number().optional(),
  invoice_number: z.string().min(1, { message: "Invoice number is required" }),
  amount: z.coerce.number().min(0, { message: "Amount must be positive" }),
  currency: z.enum(["IQD", "USD"]).nullable().optional(),
  status: z
    .enum(["paid", "unpaid", "partial", "cancelled"])
    .nullable()
    .optional(),
  supplier_id: z.coerce.number().nullable().optional(),
  department_id: z.coerce.number().nullable().optional(),
  issue_date: z.coerce.date({ required_error: "Issue date is required" }),
  due_date: z.coerce.date({ required_error: "Due date is required" }),
  payment_date: z.coerce.date().nullable().optional(),
  discount_amount: z.coerce.number().nullable().optional(),
  tax_amount: z.coerce.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.coerce.date().nullable().optional(),
  updated_at: z.coerce.date().nullable().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const payInvoiceSchema = z.object({
  payment_date: z.coerce.date({
    required_error: "A payment date is required.",
  }),
});
