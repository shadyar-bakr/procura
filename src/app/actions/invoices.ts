"use server";

import { revalidatePath } from "next/cache";
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  payInvoice,
} from "@/lib/data/invoices";
import { ActionResponse, Invoice, InvoiceInsert, InvoiceUpdate } from "@/types";
import { handleActionError } from "@/lib/action-handler";
import { invoiceSchema } from "@/types/schemas";

const updateInvoiceSchema = invoiceSchema.partial();

export async function createInvoiceAction(
  formData: FormData
): Promise<ActionResponse<Invoice>> {
  try {
    const parsed = invoiceSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid form data",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    // Only pass DB fields
    const insertData: InvoiceInsert = {
      invoice_number: parsed.data.invoice_number,
      amount: parsed.data.amount,
      discount_amount: parsed.data.discount_amount ?? null,
      tax_amount: parsed.data.tax_amount ?? null,
      currency: parsed.data.currency ?? null,
      status: parsed.data.status ?? null,
      issue_date:
        parsed.data.issue_date instanceof Date
          ? parsed.data.issue_date.toISOString()
          : parsed.data.issue_date,
      due_date:
        parsed.data.due_date instanceof Date
          ? parsed.data.due_date.toISOString()
          : parsed.data.due_date,
      payment_date: parsed.data.payment_date
        ? parsed.data.payment_date instanceof Date
          ? parsed.data.payment_date.toISOString()
          : parsed.data.payment_date
        : null,
      notes: parsed.data.notes ?? null,
      supplier_id: parsed.data.supplier_id ?? null,
      department_id: parsed.data.department_id ?? null,
    };

    const data = await createInvoice(insertData);
    revalidatePath("/invoices");
    revalidatePath("/"); // Revalidate dashboard

    return {
      success: true,
      message: "Invoice created successfully",
      data,
    };
  } catch (error: unknown) {
    return handleActionError<Invoice>(error, "Failed to create invoice.");
  }
}

export async function updateInvoiceAction(
  id: number,
  formData: FormData
): Promise<ActionResponse<Invoice>> {
  try {
    const parsed = updateInvoiceSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid form data",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    // Only pass DB fields
    const updateData: InvoiceUpdate = {
      invoice_number: parsed.data.invoice_number,
      amount: parsed.data.amount,
      discount_amount: parsed.data.discount_amount ?? null,
      tax_amount: parsed.data.tax_amount ?? null,
      currency: parsed.data.currency ?? null,
      status: parsed.data.status ?? null,
      issue_date: parsed.data.issue_date
        ? parsed.data.issue_date instanceof Date
          ? parsed.data.issue_date.toISOString()
          : parsed.data.issue_date
        : undefined,
      due_date: parsed.data.due_date
        ? parsed.data.due_date instanceof Date
          ? parsed.data.due_date.toISOString()
          : parsed.data.due_date
        : undefined,
      payment_date: parsed.data.payment_date
        ? parsed.data.payment_date instanceof Date
          ? parsed.data.payment_date.toISOString()
          : parsed.data.payment_date
        : undefined,
      notes: parsed.data.notes ?? null,
      supplier_id: parsed.data.supplier_id ?? null,
      department_id: parsed.data.department_id ?? null,
    };

    const data = await updateInvoice(id, updateData);
    revalidatePath("/invoices");
    revalidatePath("/"); // Revalidate dashboard

    return {
      success: true,
      message: "Invoice updated successfully",
      data,
    };
  } catch (error: unknown) {
    return handleActionError<Invoice>(error, "Failed to update invoice.");
  }
}

export async function deleteInvoiceAction(id: number): Promise<ActionResponse> {
  try {
    await deleteInvoice(id);
    revalidatePath("/invoices");
    return { success: true, message: "Invoice deleted successfully" };
  } catch (error: unknown) {
    return handleActionError(error, "Failed to delete invoice.");
  }
}

export async function deleteInvoicesAction(
  ids: number[]
): Promise<ActionResponse> {
  try {
    await Promise.all(ids.map((id) => deleteInvoice(id)));
    revalidatePath("/invoices");
    return { success: true, message: "Invoices deleted successfully" };
  } catch (error: unknown) {
    return handleActionError(error, "Failed to delete invoices.");
  }
}

export async function payInvoiceAction(
  id: number,
  paymentDate: string
): Promise<ActionResponse> {
  try {
    await payInvoice(id, paymentDate);
    revalidatePath("/invoices");
    revalidatePath("/"); // Revalidate dashboard
    return { success: true, message: "Invoice paid successfully" };
  } catch (error: unknown) {
    return handleActionError(error, "Failed to pay invoice.");
  }
}
