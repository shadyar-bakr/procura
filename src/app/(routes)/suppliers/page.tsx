import { getSuppliers } from "@/lib/data/suppliers";
import {
  deleteSupplierAction,
  deleteSuppliersAction,
} from "@/app/actions/suppliers";
import { SuppliersClient } from "@/components/features/suppliers/suppliers-client";
import { PageError } from "@/components/shared/page-error";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  try {
    const suppliers = await getSuppliers();

    return (
      <SuppliersClient
        initialSuppliers={suppliers}
        onDeleteSupplier={deleteSupplierAction}
        onDeleteSuppliers={deleteSuppliersAction}
      />
    );
  } catch (error) {
    console.error("Error loading suppliers:", error);

    return (
      <PageError
        title="Error Loading Suppliers"
        message="Failed to load suppliers data. Please try again later."
      />
    );
  }
}
