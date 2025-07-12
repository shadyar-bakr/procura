"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { DepartmentWithUnpaidStats } from "@/types/index";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-table";
import { DepartmentForm } from "@/components/features/departments/department-form";
import { DepartmentFormValues } from "@/types";
import { format } from "date-fns";
import { GenericCellAction } from "@/components/shared/cell-action";
import { FormModal } from "@/components/shared/form-modal";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const getColumns = (
  onEdit: (id: string, data: DepartmentFormValues) => void,
  onDelete: (id: string) => void
): ColumnDef<DepartmentWithUnpaidStats>[] => [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => row.original.description || "No description",
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
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) =>
      row.original.updated_at
        ? format(new Date(row.original.updated_at), "PPP")
        : "N/A",
  },
  {
    accessorKey: "unpaid_invoice_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unpaid Invoices" />
    ),
    cell: ({ row }) => row.original.unpaid_invoice_count,
  },
  {
    accessorKey: "unpaid_invoice_total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unpaid Total" />
    ),
    cell: ({ row }) => row.original.unpaid_invoice_total.toLocaleString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const editComponent = (
        <FormModal<DepartmentFormValues>
          title="Edit Department"
          description="Update the details below to edit the department."
          onFormSubmit={(formData) =>
            onEdit(row.original.id.toString(), formData)
          }
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit
            </DropdownMenuItem>
          }
        >
          <DepartmentForm department={row.original} onSubmit={() => {}} />
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
