import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";

export default function Loading() {
  return (
    <div className="p-4">
      <DataTableSkeleton columnCount={7} />
    </div>
  );
}
