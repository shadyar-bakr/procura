"use server";

import { revalidatePath } from "next/cache";
import {
  createSupplier,
  updateSupplier,
  deleteSupplier,
  deleteSuppliers,
} from "@/lib/data/suppliers";
import {
  ActionResponse,
  Supplier,
  SupplierFormValues,
  SupplierInsert,
  SupplierUpdate,
} from "@/types";
import { handleActionError } from "@/lib/action-handler";
import { supplierSchema } from "@/types/schemas";
import { validateAndExtract } from "@/lib/utils";

const updateSupplierSchema = supplierSchema.partial();

export async function createSupplierAction(
  values: SupplierFormValues
): Promise<ActionResponse<Supplier>> {
  try {
    const validatedFields = validateAndExtract(supplierSchema, values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid form data",
        errors: validatedFields.errors,
      };
    }

    // Only pass DB fields
    const insertData: SupplierInsert = {
      name: validatedFields.data.name,
      address: validatedFields.data.address || null,
      contact_person: validatedFields.data.contact_person || null,
      email: validatedFields.data.email || null,
      phone: validatedFields.data.phone || null,
      tax_id: validatedFields.data.tax_id || null,
      notes: validatedFields.data.notes || null,
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
  values: SupplierFormValues
): Promise<ActionResponse<Supplier>> {
  try {
    const validatedFields = validateAndExtract(updateSupplierSchema, values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid form data",
        errors: validatedFields.errors,
      };
    }

    // Only pass DB fields
    const updateData: SupplierUpdate = {
      name: validatedFields.data.name,
      address: validatedFields.data.address || null,
      contact_person: validatedFields.data.contact_person || null,
      email: validatedFields.data.email || null,
      phone: validatedFields.data.phone || null,
      tax_id: validatedFields.data.tax_id || null,
      notes: validatedFields.data.notes || null,
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
    await deleteSuppliers(ids);
    revalidatePath("/suppliers");
    return {
      success: true,
      message: "Suppliers deleted successfully",
    };
  } catch (error: unknown) {
    return handleActionError(error, "Failed to delete suppliers.");
  }
}
