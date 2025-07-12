"use server";

import { revalidatePath } from "next/cache";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/lib/data/departments";
import {
  ActionResponse,
  Department,
  DepartmentFormValues,
  DepartmentInsert,
  DepartmentUpdate,
} from "@/types";
import { handleActionError } from "@/lib/action-handler";
import { departmentSchema } from "@/types/schemas";
import { validateAndExtract } from "@/lib/utils";

const updateDepartmentSchema = departmentSchema.partial();

export async function createDepartmentAction(
  values: DepartmentFormValues
): Promise<ActionResponse<Department>> {
  const validatedFields = validateAndExtract(departmentSchema, values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.errors,
    };
  }

  // Only pass DB fields
  const insertData: DepartmentInsert = {
    name: validatedFields.data.name,
    description: validatedFields.data.description || null,
  };

  try {
    const data = await createDepartment(insertData);
    revalidatePath("/departments");
    return {
      success: true,
      message: "Department created successfully.",
      data,
    };
  } catch (error: unknown) {
    return handleActionError<Department>(error, "Failed to create department.");
  }
}

export async function updateDepartmentAction(
  id: number,
  values: DepartmentFormValues
): Promise<ActionResponse<Department>> {
  const validatedFields = validateAndExtract(updateDepartmentSchema, values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.errors,
    };
  }

  // Only pass DB fields
  const updateData: DepartmentUpdate = {
    name: validatedFields.data.name,
    description: validatedFields.data.description || null,
  };

  try {
    const data = await updateDepartment(id, updateData);
    revalidatePath("/departments");
    return {
      success: true,
      message: "Department updated successfully",
      data,
    };
  } catch (error: unknown) {
    return handleActionError<Department>(error, "Failed to update department.");
  }
}

export async function deleteDepartmentAction(
  id: number
): Promise<ActionResponse> {
  try {
    await deleteDepartment(id);
    revalidatePath("/departments");
    return { success: true, message: "Department deleted successfully" };
  } catch (error: unknown) {
    return handleActionError(error, "Failed to delete department.");
  }
}

export async function deleteDepartmentsAction(
  ids: number[]
): Promise<ActionResponse> {
  try {
    await Promise.all(ids.map((id) => deleteDepartment(id)));
    revalidatePath("/departments");

    return {
      success: true,
      message: `${ids.length} departments deleted successfully`,
    };
  } catch (error: unknown) {
    return handleActionError(
      error,
      "Failed to delete one or more departments."
    );
  }
}
