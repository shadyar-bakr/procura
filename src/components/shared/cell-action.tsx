"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ConfirmationDialog } from "./confirmation-dialog";

interface CellActionProps<T extends { id: number | string }> {
  data: T;
  onDelete: (id: string) => void;
  editComponent: React.ReactNode;
  deleteConfirmationText?: string;
}

export function GenericCellAction<T extends { id: number | string }>({
  data,
  onDelete,
  editComponent,
  deleteConfirmationText = "This action cannot be undone.",
}: CellActionProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {editComponent}
        <ConfirmationDialog
          title="Are you sure?"
          description={deleteConfirmationText}
          onConfirm={() => onDelete(data.id.toString())}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Delete
          </DropdownMenuItem>
        </ConfirmationDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
