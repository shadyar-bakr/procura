import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
});

export const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  contact_person: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  tax_id: z.string().optional(),
  notes: z.string().optional(),
});

export const invoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  discount_amount: z.coerce.number().optional(),
  tax_amount: z.coerce.number().optional(),
  currency: z.string().optional(),
  status: z.string().optional(),
  issue_date: z.string().min(1, "Issue date is required"),
  due_date: z.string().min(1, "Due date is required"),
  payment_date: z.string().optional(),
  notes: z.string().optional(),
  supplier_id: z.coerce.number().optional(),
  department_id: z.coerce.number().optional(),
});

export const invoiceFormSchema = invoiceSchema.extend({
  issue_date: z.date({ required_error: "Issue date is required" }),
  due_date: z.date({ required_error: "Due date is required" }),
  payment_date: z.date().optional().nullable(),
  supplier_id: z.coerce.number({
    required_error: "Supplier is required",
  }),
  department_id: z.coerce.number({
    required_error: "Department is required",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
