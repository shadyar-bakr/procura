"use client";

import {
  EnrichedInvoice,
  Department,
  Supplier,
  InvoiceInsert,
  InvoiceUpdate,
  PayInvoiceFormValues,
} from "@/types";
import { getColumns } from "@/components/features/invoices/columns";
import DataTable from "@/components/shared/data-table";
import { toast } from "sonner";
import {
  createInvoiceAction,
  updateInvoiceAction,
  payInvoiceAction,
  deleteInvoiceAction,
  deleteInvoicesAction,
} from "@/app/actions/invoices";
import { useRouter } from "next/navigation";
import { FormModal } from "@/components/shared/form-modal";
import { InvoiceForm } from "@/components/features/invoices/invoice-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

interface InvoicesClientProps {
  initialInvoices: EnrichedInvoice[];
  suppliers: Supplier[];
  departments: Department[];
}

export function InvoicesClient({
  initialInvoices,
  suppliers,
  departments,
}: InvoicesClientProps) {
  const router = useRouter();

  const handlePayInvoice = async (id: string, data: PayInvoiceFormValues) => {
    const result = await payInvoiceAction(parseInt(id), data);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message, {
        description: result.error?.details || result.error?.message,
      });
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    const result = await deleteInvoiceAction(parseInt(id));
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message, {
        description: result.error?.details || result.error?.message,
      });
    }
  };

  const handleDeleteSelectedInvoices = async (
    selectedInvoices: EnrichedInvoice[]
  ) => {
    const selectedIds = selectedInvoices.map((i) => i.id);
    const result = await deleteInvoicesAction(selectedIds);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message, {
        description: result.error?.details || result.error?.message,
      });
    }
  };

  const handleAddInvoice = async (data: InvoiceInsert) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const result = await createInvoiceAction(formData);
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
  };

  const handleEditInvoice = async (id: string, data: InvoiceUpdate) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const result = await updateInvoiceAction(parseInt(id), formData);
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
  };

  const invoiceColumns = getColumns(
    suppliers,
    departments,
    handleEditInvoice,
    handleDeleteInvoice,
    handlePayInvoice
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoices</h1>
      </div>
      <div className="mt-4">
        <DataTable
          columns={invoiceColumns}
          data={initialInvoices}
          isLoading={false}
          filterColumn="invoice_number"
          filterColumnPlaceholder="Filter by invoice number..."
          onDeleteSelected={handleDeleteSelectedInvoices}
          initialColumnVisibility={{
            created_at: false,
          }}
          emptyState={
            <EmptyState
              title="No Invoices Found"
              description="There are no invoices to display."
            />
          }
          toolbar={
            <FormModal
              title="Add New Invoice"
              description="Fill in the details below to add a new invoice."
              onFormSubmit={handleAddInvoice}
              trigger={
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Invoice
                </Button>
              }
            >
              <InvoiceForm
                suppliers={suppliers}
                departments={departments}
                onSubmit={() => {}}
              />
            </FormModal>
          }
        />
      </div>
    </div>
  );
}
