import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { LoginFormSkeleton } from "@/components/auth/login-form-skeleton";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
