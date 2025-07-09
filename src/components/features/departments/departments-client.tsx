"use client";

import { useMemo, useTransition, useCallback } from "react";
import { Department, ActionResponse } from "@/types";
import { getColumns } from "@/components/features/departments/columns";
import DataTable from "@/components/shared/data-table";
import { DepartmentFormValues } from "@/components/features/departments/department-form";
import { toast } from "sonner";
import {
  createDepartmentAction,
  updateDepartmentAction,
} from "@/app/actions/departments";
import { useRouter } from "next/navigation";
import { FormModal } from "@/components/shared/form-modal";
import { DepartmentForm } from "@/components/features/departments/department-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

interface DepartmentsClientProps {
  initialDepartments: Department[];
  onDeleteDepartment: (id: number) => Promise<ActionResponse>;
  onDeleteDepartments: (ids: number[]) => Promise<ActionResponse>;
}

export function DepartmentsClient({
  initialDepartments,
  onDeleteDepartment,
  onDeleteDepartments,
}: DepartmentsClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteDepartment = useCallback(
    async (id: string) => {
      startTransition(async () => {
        const result = await onDeleteDepartment(parseInt(id));
        if (result.success) {
          toast.success(result.message);
          router.refresh();
        } else {
          toast.error(result.message, {
            description: result.error?.details || result.error?.message,
          });
        }
      });
    },
    [onDeleteDepartment, router]
  );

  const handleDeleteSelectedDepartments = useCallback(
    async (selectedDepartments: Department[]) => {
      const selectedIds = selectedDepartments.map((d) => d.id);
      startTransition(async () => {
        const result = await onDeleteDepartments(selectedIds);
        if (result.success) {
          toast.success(result.message);
          router.refresh();
        } else {
          toast.error(result.message, {
            description: result.error?.details || result.error?.message,
          });
        }
      });
    },
    [onDeleteDepartments, router]
  );

  const handleAddDepartment = useCallback(
    async (data: DepartmentFormValues) => {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.description) {
          formData.append("description", data.description);
        }

        const result = await createDepartmentAction(formData);
        if (result.success) {
          toast.success(result.message);
          router.refresh();
        } else {
          toast.error(result.message);
          if (result.errors) {
            Object.values(result.errors).forEach((error) => {
              if (Array.isArray(error)) {
                error.forEach((e) => toast.error(e));
              }
            });
          }
        }
      });
    },
    [router]
  );

  const handleEditDepartment = useCallback(
    async (id: string, data: DepartmentFormValues) => {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.description) {
          formData.append("description", data.description);
        }

        const result = await updateDepartmentAction(parseInt(id), formData);
        if (result.success) {
          toast.success(result.message);
          router.refresh();
        } else {
          toast.error(result.message);
          if (result.errors) {
            Object.values(result.errors).forEach((error) => {
              if (Array.isArray(error)) {
                error.forEach((e) => toast.error(e));
              }
            });
          }
        }
      });
    },
    [router]
  );

  const departmentColumns = useMemo(
    () => getColumns(handleEditDepartment, handleDeleteDepartment),
    [handleEditDepartment, handleDeleteDepartment]
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Departments</h1>
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
      </div>
      <div className="mt-4">
        <DataTable
          columns={departmentColumns}
          data={initialDepartments}
          isLoading={isPending}
          filterColumn="name"
          filterColumnPlaceholder="Filter by name..."
          onDeleteSelected={handleDeleteSelectedDepartments}
          emptyState={
            <EmptyState
              title="No Departments Found"
              description="Get started by creating a new department."
              buttonText="Create Department"
              onButtonClick={() => {
                // This is a bit of a hack to trigger the modal which is outside the datatable
                // A better implementation would involve lifting state up.
                const trigger = document.querySelector(
                  '[aria-haspopup="dialog"]'
                ) as HTMLButtonElement;
                if (trigger) trigger.click();
              }}
            />
          }
        />
      </div>
    </div>
  );
}
