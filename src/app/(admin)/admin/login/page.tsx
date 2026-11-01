"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid admin email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<{
        token: string;
        admin: { name: string; email: string; role: string; isMaster: boolean };
        message?: string;
      }>("/api/admin/auth/login", {
        email,
        password: password || undefined,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("ciq_admin_token", res.token);
      }

      toast.success(res.message || `Welcome, ${res.admin.name}!`);
      router.push("/admin");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Admin authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillMyEmail = () => {
    setEmail("biswassirsho@gmail.com");
    toast.info("Filled with your email (biswassirsho@gmail.com)!");
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 relative">
      <div className="card-interactive w-full max-w-md bg-surface-100/90 backdrop-blur-2xl border border-surface-200/90 rounded-3xl p-8 shadow-[0_20px_50px_rgba(58,15,52,0.1)] relative z-10">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-800 to-primary-950 border border-primary-700/60 text-accent-400 shadow-md">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Admin Command Center</h1>
          <p className="text-sm text-surface-600 mt-1">
            Zero-password Master Admin login & platform gateway
          </p>
        </div>

        {/* Passwordless Feature Highlight */}
        <div className="mb-6 p-4 rounded-2xl bg-primary-50/90 border border-primary-200/80 text-xs text-primary-950">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 font-bold text-primary-900 text-xs">
              <Sparkles className="w-4 h-4 text-accent-600" />
              Passwordless Master Admin
            </div>
            <button
              type="button"
              onClick={handleFillMyEmail}
              className="text-[11px] text-accent-700 font-bold underline hover:text-accent-900"
            >
              Fill biswassirsho@gmail.com
            </button>
          </div>
          <p className="text-surface-600 text-[11px] leading-relaxed">
            The first admin logs in using <strong>just their email ID</strong> with no password required. Your email is automatically linked to send all user verification OTPs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">
              Admin Email Address
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

          {showPasswordInput ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-surface-700 uppercase tracking-wider">
                  Admin Password (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPasswordInput(false)}
                  className="text-[11px] text-surface-500 hover:text-surface-800"
                >
                  Hide password
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-surface-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty for Master Admin"
                  className="w-full bg-white/90 border border-surface-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          ) : (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowPasswordInput(true)}
                className="text-[11px] text-surface-500 hover:text-surface-800 transition-colors"
              >
                + Optional: Sign in with password
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 hover:from-primary-800 hover:to-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-primary-900/30 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Connecting..." : "Enter Admin Portal (Email Only)"}
            <ArrowRight className="w-4 h-4 text-accent-400" />
          </Button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/admin/signup"
            className="text-xs font-semibold text-primary-700 hover:text-accent-600 transition-colors"
          >
            First time setting up? Register as Master Admin →
          </a>
        </div>

        <div className="mt-6 pt-6 border-t border-surface-200/80 text-center text-xs text-surface-500">
          <a href="/login" className="text-surface-600 hover:text-primary-800 font-medium transition-colors">
            ← Return to Candidate Portal
          </a>
        </div>
      </div>
    </div>
  );
}
