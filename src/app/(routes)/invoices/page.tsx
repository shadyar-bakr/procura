import { getEnrichedInvoices } from "@/lib/data/invoices";
import { getSuppliers } from "@/lib/data/suppliers";
import { getDepartments } from "@/lib/data/departments";
import { InvoicesClient } from "@/components/features/invoices/invoices-client";
import { PageError } from "@/components/shared/page-error";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  try {
    const [invoices, suppliers, departments] = await Promise.all([
      getEnrichedInvoices(),
      getSuppliers(),
      getDepartments(),
    ]);

    return (
      <InvoicesClient
        initialInvoices={invoices}
        suppliers={suppliers}
        departments={departments}
      />
    );
  } catch (error) {
    console.error("Error loading invoices:", error);

    return (
      <PageError
        title="Error Loading Invoices"
        message="Failed to load invoices data. Please try again later."
      />
    );
  }
}
