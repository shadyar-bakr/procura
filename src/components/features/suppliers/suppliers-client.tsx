"use client";

import { useMemo, useTransition, useCallback } from "react";
import { Supplier, ActionResponse } from "@/types";
import { getColumns } from "@/components/features/suppliers/columns";
import DataTable from "@/components/shared/data-table";
import { SupplierFormValues } from "@/components/features/suppliers/supplier-form";
import { toast } from "sonner";
import {
  createSupplierAction,
  updateSupplierAction,
} from "@/app/actions/suppliers";
import { useRouter } from "next/navigation";
import { FormModal } from "@/components/shared/form-modal";
import { SupplierForm } from "@/components/features/suppliers/supplier-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface SuppliersClientProps {
  initialSuppliers: Supplier[];
  onDeleteSupplier: (id: number) => Promise<ActionResponse>;
  onDeleteSuppliers: (ids: number[]) => Promise<ActionResponse>;
}

export function SuppliersClient({
  initialSuppliers,
  onDeleteSupplier,
  onDeleteSuppliers,
}: SuppliersClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteSupplier = useCallback(
    async (id: string) => {
      startTransition(async () => {
        const result = await onDeleteSupplier(parseInt(id));
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
    [onDeleteSupplier, router]
  );

  const handleDeleteSelectedSuppliers = useCallback(
    async (selectedSuppliers: Supplier[]) => {
      const selectedIds = selectedSuppliers.map((s) => s.id);
      startTransition(async () => {
        const result = await onDeleteSuppliers(selectedIds);
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
    [onDeleteSuppliers, router]
  );

  const handleAddSupplier = useCallback(
    async (data: SupplierFormValues) => {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.address) formData.append("address", data.address);
        if (data.contact_person)
          formData.append("contact_person", data.contact_person);
        if (data.email) formData.append("email", data.email);
        if (data.phone) formData.append("phone", data.phone);
        if (data.tax_id) formData.append("tax_id", data.tax_id);
        if (data.notes) formData.append("notes", data.notes);

        const result = await createSupplierAction(formData);
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

  const handleEditSupplier = useCallback(
    async (id: string, data: SupplierFormValues) => {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.address) formData.append("address", data.address);
        if (data.contact_person)
          formData.append("contact_person", data.contact_person);
        if (data.email) formData.append("email", data.email);
        if (data.phone) formData.append("phone", data.phone);
        if (data.tax_id) formData.append("tax_id", data.tax_id);
        if (data.notes) formData.append("notes", data.notes);

        const result = await updateSupplierAction(parseInt(id), formData);
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

  const supplierColumns = useMemo(
    () => getColumns(handleEditSupplier, handleDeleteSupplier),
    [handleEditSupplier, handleDeleteSupplier]
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Suppliers</h1>
      </div>
      <div className="mt-4">
        <DataTable
          columns={supplierColumns}
          data={initialSuppliers}
          isLoading={isPending}
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
        />
      </div>
    </div>
  );
}
