"use server";

import { revalidatePath } from "next/cache";
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "@/lib/data/invoices";
import { ActionResponse, Invoice } from "@/types";
import { handleActionError } from "@/lib/action-handler";
import { invoiceSchema } from "@/types/schemas";

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

    const data = await createInvoice(parsed.data);
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

const updateInvoiceSchema = invoiceSchema.partial();

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

    const data = await updateInvoice(id, parsed.data);
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
