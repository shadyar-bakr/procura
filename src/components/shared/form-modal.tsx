"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import React from "react";

interface FormModalProps<TFormValues> {
  title: string;
  description: string;
  trigger: React.ReactNode;
  children: React.ReactElement<{ onSubmit: (data: TFormValues) => void }>;
  onFormSubmit: (data: TFormValues) => void;
}

export function FormModal<TFormValues>({
  title,
  description,
  trigger,
  children,
  onFormSubmit,
}: FormModalProps<TFormValues>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (data: TFormValues) => {
    onFormSubmit(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="min-w-max max-w-max">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {React.cloneElement(children, { onSubmit: handleSubmit })}
      </DialogContent>
    </Dialog>
  );
}
