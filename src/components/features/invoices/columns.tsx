"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Department, EnrichedInvoice, Supplier } from "@/types/index";
import { DataTableColumnHeader } from "@/components/shared/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { InvoiceForm, InvoiceFormValues } from "../invoices/invoice-form";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { GenericCellAction } from "@/components/shared/cell-action";
import { FormModal } from "@/components/shared/form-modal";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const getColumns = (
  suppliers: Supplier[],
  departments: Department[],
  onEdit: (id: string, data: InvoiceFormValues) => void,
  onDelete: (id: string) => void
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
    id: "supplier.name",
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
      return <div className="font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: "discount_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount" />
    ),
    cell: ({ row }) => {
      const discount = parseFloat(row.getValue("discount_amount") || "0");
      return <div className="font-medium">{formatCurrency(discount)}</div>;
    },
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
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
      const editComponent = (
        <FormModal<InvoiceFormValues>
          title="Edit Invoice"
          description="Update the details below to edit the invoice."
          onFormSubmit={(formData) =>
            onEdit(row.original.id.toString(), formData)
          }
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit
            </DropdownMenuItem>
          }
        >
          <InvoiceForm
            invoice={row.original}
            suppliers={suppliers}
            departments={departments}
            onSubmit={() => {}}
          />
        </FormModal>
      );

      return (
        <GenericCellAction
          data={row.original}
          onDelete={onDelete}
          editComponent={editComponent}
        />
      );
    },
  },
];
