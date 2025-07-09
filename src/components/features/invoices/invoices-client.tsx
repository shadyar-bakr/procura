"use client";

import { useMemo, useTransition, useCallback } from "react";
import { EnrichedInvoice, Department, Supplier, ActionResponse } from "@/types";
import { getColumns } from "@/components/features/invoices/columns";
import DataTable from "@/components/shared/data-table";
import { InvoiceFormValues } from "@/components/features/invoices/invoice-form";
import { toast } from "sonner";
import {
  createInvoiceAction,
  updateInvoiceAction,
} from "@/app/actions/invoices";
import { useRouter } from "next/navigation";
import { FormModal } from "@/components/shared/form-modal";
import { InvoiceForm } from "@/components/features/invoices/invoice-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface InvoicesClientProps {
  initialInvoices: EnrichedInvoice[];
  suppliers: Supplier[];
  departments: Department[];
  onDeleteInvoice: (id: number) => Promise<ActionResponse>;
  onDeleteInvoices: (ids: number[]) => Promise<ActionResponse>;
}

export function InvoicesClient({
  initialInvoices,
  suppliers,
  departments,
  onDeleteInvoice,
  onDeleteInvoices,
}: InvoicesClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteInvoice = useCallback(
    async (id: string) => {
      startTransition(async () => {
        const result = await onDeleteInvoice(parseInt(id));
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
    [onDeleteInvoice, router]
  );

  const handleDeleteSelectedInvoices = useCallback(
    async (selectedInvoices: EnrichedInvoice[]) => {
      const selectedIds = selectedInvoices.map((i) => i.id);
      startTransition(async () => {
        const result = await onDeleteInvoices(selectedIds);
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
    [onDeleteInvoices, router]
  );

  const handleAddInvoice = useCallback(
    async (data: InvoiceFormValues) => {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("invoice_number", data.invoice_number);
        formData.append("supplier_id", data.supplier_id);
        formData.append("department_id", data.department_id);
        formData.append("amount", data.amount.toString());
        if (data.discount_amount)
          formData.append("discount_amount", data.discount_amount.toString());
        if (data.tax_amount)
          formData.append("tax_amount", data.tax_amount.toString());
        if (data.currency) formData.append("currency", data.currency);
        if (data.status) formData.append("status", data.status);
        formData.append("issue_date", data.issue_date);
        formData.append("due_date", data.due_date);
        if (data.payment_date)
          formData.append("payment_date", data.payment_date);
        if (data.notes) formData.append("notes", data.notes);

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
      });
    },
    [router]
  );

  const handleEditInvoice = useCallback(
    async (id: string, data: InvoiceFormValues) => {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("invoice_number", data.invoice_number);
        formData.append("supplier_id", data.supplier_id);
        formData.append("department_id", data.department_id);
        formData.append("amount", data.amount.toString());
        if (data.discount_amount)
          formData.append("discount_amount", data.discount_amount.toString());
        if (data.tax_amount)
          formData.append("tax_amount", data.tax_amount.toString());
        if (data.currency) formData.append("currency", data.currency);
        if (data.status) formData.append("status", data.status);
        formData.append("issue_date", data.issue_date);
        formData.append("due_date", data.due_date);
        if (data.payment_date)
          formData.append("payment_date", data.payment_date);
        if (data.notes) formData.append("notes", data.notes);

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
      });
    },
    [router]
  );

  const invoiceColumns = useMemo(
    () =>
      getColumns(
        suppliers,
        departments,
        handleEditInvoice,
        handleDeleteInvoice
      ),
    [suppliers, departments, handleEditInvoice, handleDeleteInvoice]
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
          isLoading={isPending}
          filterColumn="invoice_number"
          filterColumnPlaceholder="Filter by invoice number..."
          onDeleteSelected={handleDeleteSelectedInvoices}
          initialColumnVisibility={{
            supplier: false,
            department: false,
          }}
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
