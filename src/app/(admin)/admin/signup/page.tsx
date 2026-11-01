"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, User, KeyRound, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gmailAppPassword, setGmailAppPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          gmailAppPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to create Admin account");
      }

      if (data.data?.token) {
        localStorage.setItem("ciq_admin_token", data.data.token);
      }

      toast.success(data.data?.message || "Master Admin activated successfully!");
      router.push("/admin");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error creating admin account");
    } finally {
      setLoading(false);
    }
  };

  const handleFillPreset = () => {
    setName("Sirsho Biswas");
    setEmail("biswassirsho@gmail.com");
    setPassword("Admin@123456");
    toast.info("Filled with your details! Enter your 16-letter Gmail App Password below.");
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 relative">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl p-8 shadow-[0_16px_40px_rgba(120,95,65,0.08)] relative z-10">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100/80 border border-primary-200/80 text-primary-700 shadow-sm">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Master Admin Registration</h1>
          <p className="text-sm text-surface-500 mt-1">
            Zero email verification required • Instant platform sender connection
          </p>
        </div>

        {/* First Admin Notice Card */}
        <div className="mb-6 p-4 rounded-2xl bg-primary-50/80 border border-primary-200/70 text-xs text-primary-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-primary-900">
            <Sparkles className="w-4 h-4 text-primary-600" />
            Automatic Platform Link
          </div>
          <p className="leading-relaxed text-surface-600">
            As the <strong>1st Master Administrator</strong>, your account is immediately verified with zero wait. Your registered email will automatically become the website&apos;s official gateway to send 6-digit verification OTPs to candidates!
          </p>
          <button
            type="button"
            onClick={handleFillPreset}
            className="mt-2 text-xs text-primary-700 font-semibold underline hover:text-primary-900"
          >
            Click to fill your credentials (biswassirsho@gmail.com)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
              Admin Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-surface-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sirsho Biswas"
                className="w-full bg-white/90 border border-surface-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
              Admin Email (Will be used to send user OTPs)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-surface-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="biswassirsho@gmail.com"
                className="w-full bg-white/90 border border-surface-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-surface-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-white/90 border border-surface-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Google Gmail 16-Letter App Password</span>
              <span className="text-[11px] text-primary-700 font-normal">Recommended for live Gmail</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-surface-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={gmailAppPassword}
                onChange={(e) => setGmailAppPassword(e.target.value)}
                placeholder="abcd efgh ijkl mnop"
                className="w-full bg-white/90 border border-surface-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-surface-500 mt-1 leading-relaxed">
              Generate from{" "}
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noreferrer"
                className="text-primary-700 underline font-medium"
              >
                myaccount.google.com/apppasswords
              </a>{" "}
              (Security → 2-Step Verification → App passwords). If left blank, you can also connect it later in the Admin Dashboard.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-primary-700/20 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Activating Master Admin..." : "Activate Master Admin & Connect Website"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-surface-200/80 flex items-center justify-between text-xs text-surface-500">
          <Link href="/admin/login" className="hover:text-surface-900 transition-colors">
            Already have an Admin account? Log in
          </Link>
          <Link href="/" className="hover:text-surface-900 transition-colors">
            ← Home
          </Link>
        </div>
      </div>
    </div>
  );
}
