"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/types/schemas";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    const errorMessages = parsed.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return redirect(`/login?message=${encodeURIComponent(errorMessages)}`);
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const parsed = signupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    const errorMessages = parsed.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return redirect(`/login?message=${encodeURIComponent(errorMessages)}`);
  }

  const { error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    return redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function isLoggedIn() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session !== null;
}
