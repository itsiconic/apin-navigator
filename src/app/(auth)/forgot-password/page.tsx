"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/validations/schemas";
import { api, ApiError } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const res = await api.post<{ devResetUrl?: string; message: string }>("/api/auth/forgot-password", data);
      setSent(true);
      if (res?.devResetUrl) {
        setDevResetUrl(res.devResetUrl);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  if (sent) {
    return (
      <div className="animate-fade-in text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-50">
          <CheckCircle2 className="h-8 w-8 text-success-600" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Check your email</h1>
        <p className="text-surface-500 mb-6">
          If an account exists with that email, we&apos;ve sent a password reset link.
          Please check your inbox and spam folder.
        </p>

        {devResetUrl && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs">
            <p className="font-semibold text-amber-800 mb-1">🛠 Development Helper</p>
            <p className="text-amber-700 mb-3">
              Email delivery is in mock/dev mode. You can proceed directly with the generated link:
            </p>
            <a href={devResetUrl} className="inline-block">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs">
                Proceed to Reset Password →
              </Button>
            </a>
          </div>
        )}

        <Link href="/login">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
          <Mail className="h-6 w-6 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Forgot your password?</h1>
        <p className="text-surface-500">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={isSubmitting}
        >
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-surface-500">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
