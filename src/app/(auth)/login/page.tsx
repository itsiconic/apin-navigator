"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, Mail, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/validations/schemas";
import { api, ApiError } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("otp");
  const [showPassword, setShowPassword] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Password-based submission
  const onSubmit = async (data: LoginInput) => {
    try {
      const result = await api.post<{
        user: {
          id: string;
          username: string;
          isVerified: boolean;
        };
      }>("/api/auth/login", data);

      if (!result.user.isVerified) {
        toast.info("Please verify your account first.");
        router.push(`/verify-otp?userId=${result.user.id}`);
        return;
      }

      toast.success(`Welcome back, ${result.user.username}!`);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // 6-digit OTP-based login / auto-signup
  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpEmail || !otpEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await api.post<{
        userId: string;
        email: string;
        username: string;
        isNewUser: boolean;
        message: string;
      }>("/api/auth/otp-login", { email: otpEmail });

      toast.success(res.message || "6-digit OTP code sent to your email!");
      const emailParam = `&email=${encodeURIComponent(res.email)}`;
      router.push(`/verify-otp?userId=${res.userId}${emailParam}`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Could not send verification OTP. Please try again.");
      }
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 mb-1">Candidate Portal</h1>
        <p className="text-surface-500 text-sm">Access your career intelligence dashboard</p>
      </div>

      {/* Login Mode Toggle Tabs with 3D Pill Animation */}
      <div className="grid grid-cols-2 p-1.5 mb-6 rounded-2xl bg-surface-200/80 border border-surface-300/80 text-xs font-semibold shadow-inner">
        <button
          type="button"
          onClick={() => setLoginMethod("otp")}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
            loginMethod === "otp"
              ? "bg-gradient-to-r from-primary-800 to-primary-950 text-white shadow-[0_4px_12px_rgba(58,15,52,0.25)] border border-accent-400/40 font-bold scale-[1.02]"
              : "text-surface-700 hover:text-surface-950 hover:bg-white/40"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-400" />
          <span>Email OTP (Fast)</span>
        </button>
        <button
          type="button"
          onClick={() => setLoginMethod("password")}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
            loginMethod === "password"
              ? "bg-gradient-to-r from-primary-800 to-primary-950 text-white shadow-[0_4px_12px_rgba(58,15,52,0.25)] border border-accent-400/40 font-bold scale-[1.02]"
              : "text-surface-700 hover:text-surface-950 hover:bg-white/40"
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Password</span>
        </button>
      </div>

      {loginMethod === "otp" ? (
        /* OTP Login Form */
        <form onSubmit={handleOtpLogin} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-primary-50/90 border border-primary-200/80 text-xs text-primary-950 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-primary-900 mb-1">
              <ShieldCheck className="w-4 h-4 text-accent-600" />
              Passwordless 6-Digit OTP Login
            </div>
            Enter your email to receive a 6-digit numerical OTP code dispatched by the platform administrator. Entering the code will log you straight in!
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">
              Your Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-surface-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={otpEmail}
                onChange={(e) => setOtpEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="w-full bg-white border border-surface-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            disabled={otpLoading}
          >
            {otpLoading ? "Sending OTP..." : "Send 6-Digit OTP to Login"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </form>
      ) : (
        /* Password Login Form */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Username, Email, or Phone"
            placeholder="johndoe or john@example.com"
            error={errors.identifier?.message}
            {...register("identifier")}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isSubmitting}
          >
            <LogIn className="h-4 w-4" />
            Log In with Password
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-surface-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Sign up with Email
        </Link>
      </p>

      <div className="mt-6 pt-4 border-t border-surface-200 text-center">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-primary-700 transition-colors"
        >
          <span>🛡️ First Admin Login (Email Only, No Password) →</span>
        </Link>
      </div>
    </div>
  );
}
