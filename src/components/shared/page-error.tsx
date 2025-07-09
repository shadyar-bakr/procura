import { AlertTriangle } from "lucide-react";

interface PageErrorProps {
  title: string;
  message: string;
}

export function PageError({ title, message }: PageErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-4 text-center">
      <AlertTriangle className="size-16 text-red-500" />
      <h1 className="text-2xl font-semibold text-red-600">{title}</h1>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
