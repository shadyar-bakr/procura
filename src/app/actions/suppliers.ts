"use server";

import { revalidatePath } from "next/cache";
import {
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/lib/data/suppliers";
import {
  ActionResponse,
  Supplier,
  SupplierInsert,
  SupplierUpdate,
} from "@/types";
import { handleActionError } from "@/lib/action-handler";
import { supplierSchema } from "@/types/schemas";

const updateSupplierSchema = supplierSchema.partial();

export async function createSupplierAction(
  formData: FormData
): Promise<ActionResponse<Supplier>> {
  try {
    const parsed = supplierSchema.safeParse(
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
    const insertData: SupplierInsert = {
      name: parsed.data.name,
      address: parsed.data.address ?? null,
      contact_person: parsed.data.contact_person ?? null,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      tax_id: parsed.data.tax_id ?? null,
      notes: parsed.data.notes ?? null,
    };

    const data = await createSupplier(insertData);
    revalidatePath("/suppliers");

    return {
      success: true,
      message: "Supplier created successfully.",
      data,
    };
  } catch (error: unknown) {
    return handleActionError<Supplier>(error, "Failed to create supplier.");
  }
}

export async function updateSupplierAction(
  id: number,
  formData: FormData
): Promise<ActionResponse<Supplier>> {
  try {
    const parsed = updateSupplierSchema.safeParse(
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
    const updateData: SupplierUpdate = {
      name: parsed.data.name,
      address: parsed.data.address ?? null,
      contact_person: parsed.data.contact_person ?? null,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      tax_id: parsed.data.tax_id ?? null,
      notes: parsed.data.notes ?? null,
    };

    const data = await updateSupplier(id, updateData);
    revalidatePath("/suppliers");

    return {
      success: true,
      message: "Supplier updated successfully",
      data,
    };
  } catch (error: unknown) {
    return handleActionError<Supplier>(error, "Failed to update supplier.");
  }
}

export async function deleteSupplierAction(
  id: number
): Promise<ActionResponse> {
  try {
    await deleteSupplier(id);
    revalidatePath("/suppliers");
    return {
      success: true,
      message: "Supplier deleted successfully",
    };
  } catch (error: unknown) {
    return handleActionError(error, "Failed to delete supplier.");
  }
}

export async function deleteSuppliersAction(
  ids: number[]
): Promise<ActionResponse> {
  try {
    await Promise.all(ids.map((id) => deleteSupplier(id)));
    revalidatePath("/suppliers");
    return {
      success: true,
      message: "Selected suppliers deleted successfully",
    };
  } catch (error: unknown) {
    return handleActionError(error, "Failed to delete one or more suppliers.");
  }
}
