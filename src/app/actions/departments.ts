"use server";

import { revalidatePath } from "next/cache";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/lib/data/departments";
import { ActionResponse } from "@/types";
import { handleActionError } from "@/lib/action-handler";
import { Department } from "@/types/index";
import { departmentSchema } from "@/types/schemas";

export async function createDepartmentAction(
  formData: FormData
): Promise<ActionResponse<Department>> {
  const validatedFields = departmentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await createDepartment(validatedFields.data);
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
  formData: FormData
): Promise<ActionResponse<Department>> {
  const validatedFields = departmentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const data = await updateDepartment(id, validatedFields.data);
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
