"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Department } from "@/types/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import { departmentSchema } from "@/types/schemas";
import { z } from "zod";

export type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  department?: Department | null;
  onSubmit: (data: DepartmentFormValues) => void;
}

export function DepartmentForm({ department, onSubmit }: DepartmentFormProps) {
  const isEditMode = !!department;

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name,
        description: department.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [department, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Optional description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">{isEditMode ? "Update" : "Save"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
