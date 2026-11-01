"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { signupSchema, type SignupInput } from "@/validations/schemas";
import { api, ApiError } from "@/lib/api-client";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false as unknown as true,
    },
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      const result = await api.post<{
        userId: string;
        requiresVerification: boolean;
      }>("/api/auth/signup", data);

      toast.success("Account created! Please check your email for the verification code.");
      const emailParam = data.email ? `&email=${encodeURIComponent(data.email)}` : "";
      router.push(`/verify-otp?userId=${result.userId}${emailParam}`);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            setError(field as keyof SignupInput, {
              message: messages[0],
            });
          });
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Create your account</h1>
        <p className="text-surface-500">Start building your career intelligence profile</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          placeholder="johndoe"
          error={errors.username?.message}
          {...register("username")}
        />

        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          hint="We'll send a verification code to this email"
          {...register("email")}
        />

        <Input
          label="Phone (optional)"
          type="tel"
          placeholder="+91 9876543210"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
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

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 transition-colors"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
            {...register("termsAccepted")}
          />
          <label htmlFor="terms" className="text-sm text-surface-600">
            I agree to the{" "}
            <button
              type="button"
              onClick={() => setLegalModal("terms")}
              className="text-primary-600 hover:underline font-medium cursor-pointer"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => setLegalModal("privacy")}
              className="text-primary-600 hover:underline font-medium cursor-pointer"
            >
              Privacy Policy
            </button>
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-sm text-danger-500">{errors.termsAccepted.message}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={isSubmitting}
        >
          <UserPlus className="h-4 w-4" />
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-surface-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-primary-700 hover:text-accent-600 transition-colors"
        >
          Log in
        </Link>
      </p>

      {/* Terms of Service & Privacy Policy Modal */}
      <Dialog open={legalModal !== null} onOpenChange={(open) => !open && setLegalModal(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {legalModal === "terms" ? "Terms of Service" : "Privacy Policy"}
            </DialogTitle>
            <DialogDescription>
              {legalModal === "terms"
                ? "Please review our terms governing platform usage and skill certification."
                : "Learn how APIN (Academic Project & Internship Navigator) protects your data and evaluation credentials."}
            </DialogDescription>
          </DialogHeader>

          <div className="text-xs text-surface-600 space-y-3 leading-relaxed py-2">
            {legalModal === "terms" ? (
              <>
                <p>
                  <strong>1. Acceptance of Terms:</strong> By creating an account on APIN (Academic Project & Internship Navigator), you agree to comply with all applicable laws, codes of academic integrity, and terms outlined herein.
                </p>
                <p>
                  <strong>2. Authentic Evidence:</strong> Users agree to submit truthful information regarding project velocity, github repositories, and competency assessment answers. Automated testing and AI telemetry verify examination validity.
                </p>
                <p>
                  <strong>3. Account Responsibility:</strong> You are responsible for safeguarding your credentials, OTP verification codes, and maintaining active contact details for verification dispatch.
                </p>
                <p>
                  <strong>4. Service Availability:</strong> APIN (Academic Project & Internship Navigator) strives for continuous uptime and provides AI guidance, assessment grading, and internship matching on an as-is professional development basis.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>1. Data Collection:</strong> We collect your account identifiers (email, username, optional phone), educational history, verified assessment responses, and project execution logs.
                </p>
                <p>
                  <strong>2. Purpose of Use:</strong> Your data is used exclusively to generate career readiness radar scores, calibrate ATS resumes, match relevant internships, and power the AI career advisor.
                </p>
                <p>
                  <strong>3. Recruiter Privacy:</strong> Your portfolio is only shareable when you explicitly provide your verified public link. We never sell your personal data or assessment telemetry to third-party ad networks.
                </p>
                <p>
                  <strong>4. Security:</strong> Session tokens and credentials are encrypted using industry-standard hashing (bcrypt and salted tokens) and transmitted over secure HTTPS channels.
                </p>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="marigold"
              className="w-full text-xs font-bold"
              onClick={() => setLegalModal(null)}
            >
              I Understand & Agree
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
