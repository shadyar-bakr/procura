"use server";

import { revalidatePath } from "next/cache";
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  payInvoice,
} from "@/lib/data/invoices";
import {
  ActionResponse,
  Invoice,
  InvoiceInsert,
  InvoiceUpdate,
  PayInvoiceFormValues,
} from "@/types";
import { handleActionError } from "@/lib/action-handler";
import { invoiceSchema } from "@/types/schemas";
import { payInvoiceSchema } from "@/types/schemas";

export async function createInvoiceAction(
  formData: FormData
): Promise<ActionResponse<Invoice>> {
  try {
    const validatedFields = invoiceSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid form data",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Only pass DB fields
    const insertData: InvoiceInsert = {
      invoice_number: validatedFields.data.invoice_number,
      amount: validatedFields.data.amount,
      due_date: validatedFields.data.due_date.toISOString(),
      issue_date: validatedFields.data.issue_date.toISOString(),
      currency: validatedFields.data.currency ?? null,
      status: validatedFields.data.status ?? null,
      payment_date: validatedFields.data.payment_date?.toISOString() ?? null,
      department_id: validatedFields.data.department_id,
      supplier_id: validatedFields.data.supplier_id,
      notes: validatedFields.data.notes,
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
    const validatedFields = invoiceSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid form data",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Only pass DB fields
    const updateData: InvoiceUpdate = {
      invoice_number: validatedFields.data.invoice_number,
      amount: validatedFields.data.amount,
      discount_amount: validatedFields.data.discount_amount ?? null,
      tax_amount: validatedFields.data.tax_amount ?? null,
      currency: validatedFields.data.currency ?? null,
      status: validatedFields.data.status ?? null,
      issue_date: validatedFields.data.issue_date?.toISOString(),
      due_date: validatedFields.data.due_date?.toISOString(),
      payment_date: validatedFields.data.payment_date?.toISOString() ?? null,
      notes: validatedFields.data.notes,
      supplier_id: validatedFields.data.supplier_id,
      department_id: validatedFields.data.department_id,
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
  data: PayInvoiceFormValues
): Promise<ActionResponse<Invoice>> {
  try {
    const parsed = payInvoiceSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid form data",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const paidData = await payInvoice(id, parsed.data.payment_date);
    revalidatePath("/invoices");
    revalidatePath("/"); // Revalidate dashboard

    return {
      success: true,
      message: "Invoice paid successfully",
      data: paidData,
    };
  } catch (error: unknown) {
    return handleActionError<Invoice>(error, "Failed to pay invoice.");
  }
}
