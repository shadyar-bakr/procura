export interface Department {
  id: string;
  code: string;
  name: string;
  paidInvoices?: string;
  unpaidInvoices?: string;
  suppliers?: Supplier[];
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  location: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  notes: string;
  invoices?: Invoice[];
}

export interface Invoice {
  id: string;
  code: string;
  supplierId: string;
  departmentIds: string[];
  status: "Paid" | "Unpaid";
  amount: number;
  discount: number;
  totalAmount?: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
}

export interface EnrichedInvoice extends Omit<Invoice, "totalAmount"> {
  supplier?: Supplier;
  departments?: Department[];
  totalAmount: number;
}
