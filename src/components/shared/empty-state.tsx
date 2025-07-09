import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <PackageOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
