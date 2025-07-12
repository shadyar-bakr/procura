"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/types/schemas";
import { validateAndExtract } from "@/lib/utils";
import { cache } from "react";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const validatedFields = validateAndExtract(loginSchema, formData);

  if (!validatedFields.success) {
    const errorMessages = Object.values(validatedFields.errors)
      .flat()
      .join(", ");
    return redirect(`/login?message=${encodeURIComponent(errorMessages)}`);
  }

  const { error } = await supabase.auth.signInWithPassword(
    validatedFields.data
  );

  if (error) {
    return redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/"); // Revalidate the root path after sign out
  redirect("/login");
}

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
