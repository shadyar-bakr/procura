import { getDepartments } from "@/lib/data/departments";
import { DepartmentsClient } from "@/components/features/departments/departments-client";
import { PageError } from "@/components/shared/page-error";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  try {
    const departments = await getDepartments();

    return <DepartmentsClient initialDepartments={departments} />;
  } catch (error) {
    console.error("Error loading departments:", error);

    return (
      <PageError
        title="Error Loading Departments"
        message="Failed to load departments data. Please try again later."
      />
    );
  }
}
