import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard, FormSkeleton } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Kirish", robots: { index: false } };

export default function SignInPage() {
  return (
    <AuthCard title="Kirish" subtitle="Saqlangan universitetlaringizga qayting.">
      <Suspense fallback={<FormSkeleton />}>
        <SignInForm />
      </Suspense>
    </AuthCard>
  );
}
