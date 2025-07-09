import { z } from "zod";

export const departmentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().nullable().optional(),
  created_at: z.date().nullable().optional(),
  updated_at: z.date().nullable().optional(),
});

export const supplierSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  address: z.string().nullable().optional(),
  contact_person: z.string().nullable().optional(),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .nullable()
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(
      /^07\d{9}$/,
      "Please enter a valid Iraqi phone number (e.g., 07XXXXXXXXX)."
    )
    .nullable()
    .optional()
    .or(z.literal("")),
  tax_id: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.date().nullable().optional(),
  updated_at: z.date().nullable().optional(),
});

export const invoiceSchema = z.object({
  id: z.number().optional(),
  invoice_number: z
    .string({ required_error: "Invoice number is required" })
    .min(1, "Invoice number is required"),
  amount: z.coerce
    .number({ required_error: "Amount is required" })
    .positive("Amount must be a positive number"),
  discount_amount: z.coerce.number().nullable().optional(),
  tax_amount: z.coerce.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  status: z
    .enum(["paid", "unpaid", "partial", "cancelled"])
    .nullable()
    .optional(),
  issue_date: z.date({ required_error: "Issue date is required" }),
  due_date: z.date({ required_error: "Due date is required" }),
  payment_date: z.date().nullable().optional(),
  notes: z.string().nullable().optional(),
  supplier_id: z.coerce.number().nullable().optional(),
  department_id: z.coerce.number().nullable().optional(),
  created_at: z.date().nullable().optional(),
  updated_at: z.date().nullable().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
