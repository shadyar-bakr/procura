"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Supplier, SupplierFormValues } from "@/types/index";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-table";
import { SupplierForm } from "./supplier-form";
import { format } from "date-fns";
import { GenericCellAction } from "@/components/shared/cell-action";
import { FormModal } from "@/components/shared/form-modal";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const getColumns = (
  onEdit: (id: string, data: SupplierFormValues) => void,
  onDelete: (id: string) => void
): ColumnDef<Supplier>[] => [
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
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "contact_person",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Person" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
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
    id: "actions",
    cell: ({ row }) => {
      const editComponent = (
        <FormModal<SupplierFormValues>
          title="Edit Supplier"
          description="Update the details below to edit the supplier."
          onFormSubmit={(formData) =>
            onEdit(row.original.id.toString(), formData)
          }
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit
            </DropdownMenuItem>
          }
        >
          <SupplierForm supplier={row.original} onSubmit={() => {}} />
        </FormModal>
      );
      return (
        <GenericCellAction
          data={row.original}
          onDelete={onDelete}
          editComponent={editComponent}
          deleteConfirmationText="This action cannot be undone and will permanently delete this supplier."
        />
      );
    },
  },
];
