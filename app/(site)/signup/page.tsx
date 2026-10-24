import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard, FormSkeleton } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Roʻyxatdan oʻtish", robots: { index: false } };

export default function SignUpPage() {
  return (
    <AuthCard title="Roʻyxatdan oʻtish" subtitle="Universitetlarni saqlang va keyinroq solishtiring.">
      <Suspense fallback={<FormSkeleton />}>
        <SignUpForm />
      </Suspense>
    </AuthCard>
  );
}
