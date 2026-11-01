"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = useCallback(async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await api.post<{
        verified: boolean;
        token?: string;
        user?: { id: string; username: string };
        redirect?: string;
      }>("/api/auth/verify-otp", {
        userId,
        otp: code,
        type: "EMAIL_VERIFICATION",
      });

      if (res.token && typeof window !== "undefined") {
        localStorage.setItem("ciq_auth_token", res.token);
      }

      toast.success("Account verified! Logging you in...");
      router.push(res.redirect || "/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Verification failed. Please try again.");
      }
      // Clear OTP inputs
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  }, [otp, userId, router]);

  // Auto-submit when all digits entered
  useEffect(() => {
    if (otp.every((d) => d !== "")) {
      handleVerify();
    }
  }, [otp, handleVerify]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await api.post<{ message: string }>("/api/auth/resend-otp", { userId });
      toast.success("A new verification code has been sent to your email.");
      setCooldown(60);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Could not resend code. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  if (!userId) {
    return (
      <div className="text-center">
        <p className="text-surface-500 mb-4">
          Invalid verification link. Please sign up again.
        </p>
        <Button variant="outline" onClick={() => router.push("/signup")}>
          Go to Signup
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-800 to-primary-950 border border-primary-700/60 shadow-md">
          <ShieldCheck className="h-8 w-8 text-accent-400" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 mb-2">
          Verify Your Account
        </h1>
        <p className="text-surface-500 text-sm">
          {email ? (
            <>Enter the 6-digit code sent to <strong className="text-surface-800">{email}</strong></>
          ) : (
            "Enter the 6-digit code sent to your email"
          )}
        </p>
      </div>

      {/* OTP Input Grid */}
      <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-14 w-12 rounded-xl border-2 border-surface-200/90 bg-white/95 text-center text-xl font-black text-surface-900 
                       shadow-[0_2px_8px_rgba(58,15,52,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)]
                       transition-all duration-200 ease-out
                       focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-400/25 focus:scale-110 focus:shadow-[0_8px_24px_rgba(234,170,0,0.25)] focus:z-10
                       hover:border-surface-300 hover:scale-105"
          />
        ))}
      </div>

      <Button
        className="w-full mb-4"
        size="lg"
        onClick={handleVerify}
        loading={isVerifying}
        disabled={otp.some((d) => d === "")}
      >
        Verify Account
      </Button>

      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={cooldown > 0 || isResending}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 disabled:text-surface-400 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
          {cooldown > 0
            ? `Resend code in ${cooldown}s`
            : "Resend verification code"}
        </button>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="animate-pulse text-center p-8">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
