"use client";

import { SupplierWithUnpaidStats, SupplierFormValues } from "@/types";
import { getColumns } from "@/components/features/suppliers/columns";
import DataTable from "@/components/shared/data-table";
import { toast } from "sonner";
import {
  createSupplierAction,
  deleteSupplierAction,
  deleteSuppliersAction,
  updateSupplierAction,
} from "@/app/actions/suppliers";
import { useRouter } from "next/navigation";
import { FormModal } from "@/components/shared/form-modal";
import { SupplierForm } from "@/components/features/suppliers/supplier-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { handleAction } from "@/lib/utils";

interface SuppliersClientProps {
  initialSuppliers: SupplierWithUnpaidStats[];
}

export function SuppliersClient({ initialSuppliers }: SuppliersClientProps) {
  const router = useRouter();

  const handleDeleteSupplier = async (id: string) => {
    const result = await deleteSupplierAction(parseInt(id));
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message, {
        description: result.error?.details || result.error?.message,
      });
    }
  };

  const handleDeleteSelectedSuppliers = async (
    selectedSuppliers: SupplierWithUnpaidStats[]
  ) => {
    const selectedIds = selectedSuppliers.map((s) => s.id);
    const result = await deleteSuppliersAction(selectedIds);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message, {
        description: result.error?.details || result.error?.message,
      });
    }
  };

  const handleAddSupplier = async (data: SupplierFormValues) => {
    const success = await handleAction(createSupplierAction, data, false);
    if (success) {
      router.refresh();
    }
  };

  const handleEditSupplier = async (id: string, data: SupplierFormValues) => {
    const success = await handleAction(
      (values) =>
        updateSupplierAction(parseInt(id), values as SupplierFormValues),
      data,
      false
    );
    if (success) {
      router.refresh();
    }
  };

  const supplierColumns = getColumns(handleEditSupplier, handleDeleteSupplier);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Suppliers</h1>
      </div>
      <div className="mt-4">
        <DataTable<SupplierWithUnpaidStats, unknown>
          columns={supplierColumns}
          data={initialSuppliers}
          isLoading={false}
          filterColumn="name"
          filterColumnPlaceholder="Filter by name..."
          onDeleteSelected={handleDeleteSelectedSuppliers}
          initialColumnVisibility={{
            email: false,
            notes: false,
          }}
          toolbar={
            <FormModal
              title="Add New Supplier"
              description="Fill in the details below to add a new supplier."
              onFormSubmit={handleAddSupplier}
              trigger={
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Supplier
                </Button>
              }
            >
              <SupplierForm onSubmit={() => {}} />
            </FormModal>
          }
          emptyState={
            <EmptyState
              title="No Suppliers Found"
              description="There are no suppliers to display."
            />
          }
        />
      </div>
    </div>
  );
}
