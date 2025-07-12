"use client";

import { DepartmentWithUnpaidStats, DepartmentFormValues } from "@/types";
import { getColumns } from "@/components/features/departments/columns";
import DataTable from "@/components/shared/data-table";
import { DepartmentForm } from "@/components/features/departments/department-form";
import { toast } from "sonner";
import {
  createDepartmentAction,
  deleteDepartmentAction,
  deleteDepartmentsAction,
  updateDepartmentAction,
} from "@/app/actions/departments";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";
import { FormModal } from "@/components/shared/form-modal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { handleAction } from "@/lib/utils";

interface DepartmentsClientProps {
  initialDepartments: DepartmentWithUnpaidStats[];
}

export function DepartmentsClient({
  initialDepartments,
}: DepartmentsClientProps) {
  const router = useRouter();

  const handleDeleteDepartment = async (id: string) => {
    const result = await deleteDepartmentAction(parseInt(id));
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message, {
        description: result.error?.details || result.error?.message,
      });
    }
  };

  const handleDeleteSelectedDepartments = async (
    selectedDepartments: DepartmentWithUnpaidStats[]
  ) => {
    const selectedIds = selectedDepartments.map((d) => d.id);
    const result = await deleteDepartmentsAction(selectedIds);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message, {
        description: result.error?.details || result.error?.message,
      });
    }
  };

  const handleAddDepartment = async (data: DepartmentFormValues) => {
    const success = await handleAction(createDepartmentAction, data, false);
    if (success) {
      router.refresh();
    }
  };

  const handleEditDepartment = async (
    id: string,
    data: DepartmentFormValues
  ) => {
    const success = await handleAction(
      (values) =>
        updateDepartmentAction(parseInt(id), values as DepartmentFormValues),
      data,
      false
    );
    if (success) {
      router.refresh();
    }
  };

  const departmentColumns = getColumns(
    handleEditDepartment,
    handleDeleteDepartment
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Departments</h1>
      </div>
      <div className="mt-4">
        <DataTable<DepartmentWithUnpaidStats, unknown>
          columns={departmentColumns}
          data={initialDepartments}
          isLoading={false}
          filterColumn="name"
          filterColumnPlaceholder="Filter by name..."
          onDeleteSelected={handleDeleteSelectedDepartments}
          emptyState={
            <EmptyState
              title="No Departments Found"
              description="There are no departments to display."
            />
          }
          toolbar={
            <FormModal
              title="Add New Department"
              description="Fill in the details below to add a new department."
              onFormSubmit={handleAddDepartment}
              trigger={
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              }
            >
              <DepartmentForm onSubmit={() => {}} />
            </FormModal>
          }
        />
      </div>
    </div>
  );
}
