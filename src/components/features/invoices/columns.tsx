"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Department,
  EnrichedInvoice,
  InvoiceUpdate,
  Supplier,
  PayInvoiceFormValues,
} from "@/types/index";
import { DataTableColumnHeader } from "@/components/shared/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { InvoiceForm } from "../invoices/invoice-form";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { GenericCellAction } from "@/components/shared/cell-action";
import { FormModal } from "@/components/shared/form-modal";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PayInvoiceForm } from "./pay-invoice-form";
import { Badge } from "@/components/ui/badge";
import { CURRENCY } from "@/lib/constants";

export const getColumns = (
  suppliers: Supplier[],
  departments: Department[],
  onEdit: (id: string, data: InvoiceUpdate) => void,
  onDelete: (id: string) => void,
  onPay: (id: string, data: PayInvoiceFormValues) => void
): ColumnDef<EnrichedInvoice>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "invoice_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice #" />
    ),
    cell: ({ row }) => row.original.invoice_number,
  },
  {
    accessorKey: "supplier",
    id: "supplier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => row.original.supplier?.name || "N/A",
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => row.original.department?.name || "N/A",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const currency = row.original.currency;
      return (
        <div className="font-medium">{formatCurrency(amount, CURRENCY)}</div>
      );
    },
  },
  {
    accessorKey: "discount_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount" />
    ),
    cell: ({ row }) => {
      const discount = parseFloat(row.getValue("discount_amount") || "0");
      const currency = row.original.currency;
      return (
        <div className="font-medium">{formatCurrency(discount, CURRENCY)}</div>
      );
    },
  },
  {
    accessorKey: "total_after_discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total After Discount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(String(row.original.amount ?? 0));
      const discount = parseFloat(String(row.original.discount_amount ?? 0));
      const tax = parseFloat(String(row.original.tax_amount ?? 0));
      const total = amount - discount + tax;
      const currency = row.original.currency;
      return (
        <div className="font-medium">{formatCurrency(total, CURRENCY)}</div>
      );
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      if (status === "paid") {
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Paid
          </Badge>
        );
      }
      if (status === "unpaid") {
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Unpaid
          </Badge>
        );
      }
      if (status === "partial") {
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Partial
          </Badge>
        );
      }
      if (status === "cancelled") {
        return (
          <Badge className="bg-gray-200 text-gray-700 border-gray-300">
            Cancelled
          </Badge>
        );
      }
      return <span>{status}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) =>
      row.original.created_at
        ? format(new Date(row.original.created_at), "PPP")
        : "N/A",
  },
  {
    accessorKey: "issue_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issue Date" />
    ),
    cell: ({ row }) =>
      row.original.issue_date
        ? format(new Date(row.original.issue_date), "PPP")
        : "N/A",
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) =>
      row.original.due_date
        ? format(new Date(row.original.due_date), "PPP")
        : "N/A",
  },
  {
    accessorKey: "payment_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Date" />
    ),
    cell: ({ row }) =>
      row.original.payment_date
        ? format(new Date(row.original.payment_date), "PPP")
        : "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;

      // Utility to ensure all date fields are Date objects
      function ensureInvoiceDates(inv: EnrichedInvoice) {
        return {
          ...inv,
          issue_date: inv.issue_date ? new Date(inv.issue_date) : null,
          due_date: inv.due_date ? new Date(inv.due_date) : null,
          payment_date: inv.payment_date ? new Date(inv.payment_date) : null,
          created_at: inv.created_at ? new Date(inv.created_at) : null,
          updated_at: inv.updated_at ? new Date(inv.updated_at) : null,
        };
      }

      const payAction =
        invoice.status !== "paid" ? (
          <FormModal<PayInvoiceFormValues>
            key={`pay-modal-${invoice.id}`}
            title="Pay Invoice"
            description="Select a payment date for the invoice."
            onFormSubmit={(formData) => onPay(invoice.id.toString(), formData)}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Pay
              </DropdownMenuItem>
            }
          >
            <PayInvoiceForm
              onSubmit={() => {}}
              defaultValues={{
                payment_date:
                  ensureInvoiceDates(invoice).payment_date ?? undefined,
              }}
            />
          </FormModal>
        ) : null;

      const editAction = (
        <FormModal<InvoiceUpdate>
          key={`edit-modal-${invoice.id}`}
          title="Edit Invoice"
          description="Update the invoice details."
          onFormSubmit={(formData) => onEdit(invoice.id.toString(), formData)}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit
            </DropdownMenuItem>
          }
        >
          <InvoiceForm
            invoice={ensureInvoiceDates(invoice) as unknown as EnrichedInvoice}
            suppliers={suppliers}
            departments={departments}
            onSubmit={() => {}}
          />
        </FormModal>
      );

      return (
        <GenericCellAction
          data={invoice}
          onDelete={onDelete}
          editComponent={editAction}
          extraActions={payAction ? [payAction] : []}
        />
      );
    },
  },
];
