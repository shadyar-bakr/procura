"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { PayInvoiceFormValues } from "@/types";
import { payInvoiceSchema } from "@/types/schemas";

interface PayInvoiceFormProps {
  onSubmit: (values: PayInvoiceFormValues) => void;
  isPending?: boolean;
  defaultValues?: Partial<PayInvoiceFormValues>;
}

export function PayInvoiceForm({
  onSubmit,
  isPending,
  defaultValues,
}: PayInvoiceFormProps) {
  const form = useForm<PayInvoiceFormValues>({
    resolver: zodResolver(payInvoiceSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="payment_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Payment Date</FormLabel>
              <DatePicker
                date={field.value}
                setDate={field.onChange}
                placeholder="Select a payment date"
                disabled={(date) => date > new Date()}
                captionLayout="dropdown"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Processing..." : "Submit Payment"}
        </Button>
      </form>
    </Form>
  );
}
