"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  Mail,
  Send,
  CheckCircle2,
  XCircle,
  RefreshCw,
  LogOut,
  ExternalLink,
  Settings,
  Sparkles,
  KeyRound,
  FileText,
  Bell,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AdminNotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: {
    username?: string;
    email?: string;
    otp?: string;
  };
  createdAt: string;
}

interface UserItem {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  isVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
  _count: {
    userProjects: number;
    userSkills: number;
    assessmentSubmissions: number;
  };
}

interface EmailConfig {
  provider: "smtp" | "resend" | "mock";
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  fromEmail: string;
  fromName: string;
  resendApiKey: string;
  isActive: boolean;
  hasPassword?: boolean;
}

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  provider: string;
  status: "SENT" | "FAILED";
  error: string | null;
  sentAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"email" | "users" | "logs" | "notifications">("email");
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Administrator");

  // Email Config State
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    provider: "smtp",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    smtpSecure: false,
    fromEmail: "",
    fromName: "APIN Verification",
    resendApiKey: "",
    isActive: true,
  });
  const [savingConfig, setSavingConfig] = useState(false);

  // Test Email State
  const [testEmail, setTestEmail] = useState("biswassirsho@gmail.com");
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    testCodeSent?: string;
    recommendation?: string;
  } | null>(null);

  // Users State
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [verifyingUserId, setVerifyingUserId] = useState<string | null>(null);

  // Email Logs State
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [logStats, setLogStats] = useState({ total: 0, sent: 0, failed: 0, successRate: 100 });

  // Notifications State
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("ciq_admin_token") : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch Admin session
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth/me", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        router.push("/admin/login");
        return false;
      }
      const data = await res.json();
      setAdminName(data.data?.admin?.name || "Admin");
      return true;
    } catch {
      router.push("/admin/login");
      return false;
    }
  }, [router]);

  // Load Data
  const loadEmailConfig = async () => {
    try {
      const res = await fetch("/api/admin/email-config", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.config) {
          setEmailConfig({
            provider: data.data.config.provider || "smtp",
            smtpHost: data.data.config.smtpHost || "smtp.gmail.com",
            smtpPort: data.data.config.smtpPort || 587,
            smtpUser: data.data.config.smtpUser || "",
            smtpPass: data.data.config.smtpPass || "",
            smtpSecure: Boolean(data.data.config.smtpSecure),
            fromEmail: data.data.config.fromEmail || "",
            fromName: data.data.config.fromName || "APIN Verification",
            resendApiKey: data.data.config.resendApiKey || "",
            isActive: Boolean(data.data.config.isActive),
            hasPassword: Boolean(data.data.config.hasPassword),
          });
        }
      }
    } catch {
      // Ignored
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data?.users || []);
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadLogs = async () => {
    try {
      const res = await fetch("/api/admin/email-logs", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data?.logs || []);
        if (data.data?.stats) {
          setLogStats(data.data.stats);
        }
      }
    } catch {
      // Ignored
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data?.notifications || []);
        setUnreadNotifications(data.data?.unreadCount || 0);
      }
    } catch {
      // Ignored
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "POST",
        headers: getAuthHeaders(),
      });
      setUnreadNotifications(0);
      loadNotifications();
      toast.success("All notifications marked as read.");
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    checkAuth().then((authed) => {
      if (authed) {
        Promise.all([
          loadEmailConfig(),
          loadUsers(),
          loadLogs(),
          loadNotifications(),
        ]).finally(() => {
          setLoading(false);
        });
      }
    });
  }, [checkAuth]);

  // Save Email Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await fetch("/api/admin/email-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(emailConfig),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to save configuration");
      }

      toast.success("System email configuration saved successfully!");
      loadEmailConfig();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error saving config");
    } finally {
      setSavingConfig(false);
    }
  };

  // Test Email Dispatch
  const handleSendTestEmail = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      toast.error("Please enter a valid recipient email.");
      return;
    }

    setTestingEmail(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/email-config/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ toEmail: testEmail }),
      });

      const data = await res.json();
      if (data.data) {
        setTestResult(data.data);
        if (data.data.success) {
          toast.success(`Verification email sent to ${testEmail}!`);
        } else {
          toast.error("Dispatch failed: " + data.data.message);
        }
      } else {
        toast.error(data.error?.message || "Test dispatch failed.");
      }
      loadLogs();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error testing email");
    } finally {
      setTestingEmail(false);
    }
  };

  // Direct Manual User Verification
  const handleVerifyUser = async (userId: string, email: string | null) => {
    setVerifyingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/verify`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to verify user");
      }
      toast.success(data.data?.message || `User verified!`);
      loadUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error verifying user");
    } finally {
      setVerifyingUserId(null);
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("ciq_admin_token");
    }
    router.push("/admin/login");
  };

  // Preset button for Gmail
  const applyGmailPreset = () => {
    setEmailConfig((prev) => ({
      ...prev,
      provider: "smtp",
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpSecure: false,
      fromName: prev.fromName || "APIN Verification",
    }));
    toast.info("Applied Google Gmail SMTP preset! Enter your Gmail address & 16-character App Password below.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#180416] flex items-center justify-center text-surface-300">
        <RefreshCw className="w-8 h-8 animate-spin text-accent-500" />
      </div>
    );
  }

  const verifiedCount = users.filter((u) => u.isVerified).length;
  const pendingCount = users.filter((u) => !u.isVerified).length;

  return (
    <div className="min-h-screen bg-[#180416] text-surface-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-primary-900/80 bg-[#21061f]/85 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-800/80 border border-primary-600/60 flex items-center justify-center text-accent-400 shadow-md">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white">AP<span className="text-accent-400">IN</span> Administrator</span>
                <span className="px-2 py-0.5 rounded-full bg-accent-500/15 text-accent-300 border border-accent-500/30 text-xs font-semibold">
                  SUPER_ADMIN
                </span>
              </div>
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">
                Academic Project &amp; Internship Navigator &bull; Welcome, {adminName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-200/10 hover:bg-surface-200/20 text-xs font-medium text-surface-200 border border-surface-200/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-accent-400" />
              Candidate View
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-primary-800/80 hover:bg-primary-900/70 text-surface-200 text-xs"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-interactive p-5 rounded-2xl bg-[#280824]/75 border border-primary-800/70 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between text-surface-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Candidates</span>
              <Users className="w-4 h-4 text-accent-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{users.length}</div>
            <p className="text-xs text-surface-400 mt-1">Platform user accounts</p>
          </div>

          <div className="card-interactive p-5 rounded-2xl bg-[#280824]/75 border border-primary-800/70 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between text-surface-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Verified Accounts</span>
              <CheckCircle2 className="w-4 h-4 text-accent-400" />
            </div>
            <div className="text-3xl font-extrabold text-accent-400">{verifiedCount}</div>
            <p className="text-xs text-surface-400 mt-1">Active verified users</p>
          </div>

          <div className="card-interactive p-5 rounded-2xl bg-[#280824]/75 border border-primary-800/70 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between text-surface-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending OTP</span>
              <AlertCircle className="w-4 h-4 text-accent-500" />
            </div>
            <div className="text-3xl font-extrabold text-accent-400">{pendingCount}</div>
            <p className="text-xs text-surface-400 mt-1">Awaiting account verification</p>
          </div>

          <div className="card-interactive p-5 rounded-2xl bg-[#280824]/75 border border-primary-800/70 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between text-surface-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Mailer</span>
              <Mail className="w-4 h-4 text-accent-400" />
            </div>
            <div className="text-2xl font-bold text-white uppercase">{emailConfig.provider}</div>
            <p className="text-xs text-surface-400 mt-1">
              {emailConfig.provider === "smtp" ? "Nodemailer (Gmail/SMTP)" : emailConfig.provider}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-primary-900/80 pb-2">
          <button
            onClick={() => setActiveTab("email")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "email"
                ? "bg-accent-500 text-surface-950 font-bold shadow-md shadow-accent-500/25"
                : "text-surface-300 hover:text-white hover:bg-primary-900/50"
            }`}
          >
            <Settings className="w-4 h-4" />
            Email Dispatch & Gmail Setup
          </button>
          <button
            onClick={() => {
              setActiveTab("users");
              loadUsers();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "users"
                ? "bg-accent-500 text-surface-950 font-bold shadow-md shadow-accent-500/25"
                : "text-surface-300 hover:text-white hover:bg-primary-900/50"
            }`}
          >
            <Users className="w-4 h-4" />
            Candidate Directory ({users.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("logs");
              loadLogs();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "logs"
                ? "bg-accent-500 text-surface-950 font-bold shadow-md shadow-accent-500/25"
                : "text-surface-300 hover:text-white hover:bg-primary-900/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            Delivery Logs ({logs.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("notifications");
              loadNotifications();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all relative ${
              activeTab === "notifications"
                ? "bg-accent-500 text-surface-950 font-bold shadow-md shadow-accent-500/25"
                : "text-surface-300 hover:text-white hover:bg-primary-900/50"
            }`}
          >
            <Bell className="w-4 h-4" />
            Candidate Alerts ({notifications.length})
            {unreadNotifications > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-accent-500 text-surface-950 text-[10px] font-bold">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: EMAIL CONFIGURATION & LIVE GMAIL DISPATCH */}
        {activeTab === "email" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Configuration Form */}
            <div className="card-interactive lg:col-span-7 bg-[#280824]/75 border border-primary-800/70 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary-900/80">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-accent-400" />
                    Outgoing Email Gateway Settings
                  </h2>
                  <p className="text-xs text-surface-400 mt-0.5">
                    Configure the platform email account that sends 6-digit OTPs to Gmail inboxes
                  </p>
                </div>

                <button
                  type="button"
                  onClick={applyGmailPreset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-500/15 hover:bg-accent-500/25 text-accent-300 border border-accent-500/30 text-xs font-semibold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                  Apply Gmail Preset
                </button>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                {/* Provider Selector */}
                <div>
                  <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-2">
                    Email Delivery Provider
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "smtp", label: "Gmail / SMTP", desc: "Real Nodemailer SMTP" },
                      { id: "resend", label: "Resend API", desc: "Cloud Email API" },
                      { id: "mock", label: "Mock (Dev)", desc: "Terminal Log Only" },
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() =>
                          setEmailConfig({ ...emailConfig, provider: p.id as EmailConfig["provider"] })
                        }
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          emailConfig.provider === p.id
                            ? "bg-primary-900/90 border-accent-500 text-white shadow-md shadow-accent-500/10"
                            : "bg-[#1c051a] border-primary-900/70 text-surface-400 hover:border-primary-700"
                        }`}
                      >
                        <div className="font-semibold text-sm">{p.label}</div>
                        <div className="text-[11px] text-surface-400">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SMTP / Gmail Fields */}
                {emailConfig.provider === "smtp" && (
                  <div className="p-4 rounded-2xl bg-[#1b0519]/70 border border-primary-800/80 space-y-4">
                    <div className="text-xs font-semibold text-accent-400 flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      Gmail SMTP Credentials
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-surface-300 mb-1">
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={emailConfig.smtpHost}
                          onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                          placeholder="smtp.gmail.com"
                          className="w-full bg-[#1b0519] border border-primary-800/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-accent-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-surface-300 mb-1">
                          Port (587 TLS or 465 SSL)
                        </label>
                        <input
                          type="number"
                          value={emailConfig.smtpPort}
                          onChange={(e) =>
                            setEmailConfig({ ...emailConfig, smtpPort: parseInt(e.target.value, 10) })
                          }
                          className="w-full bg-[#1b0519] border border-primary-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-accent-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-surface-300 mb-1">
                        Gmail Address / SMTP Username
                      </label>
                      <input
                        type="text"
                        value={emailConfig.smtpUser}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-[#1b0519] border border-primary-800/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-accent-500"
                      />
                      <p className="text-[11px] text-surface-400 mt-1">
                        The Gmail account from which all candidate OTP codes will be sent.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-surface-300 mb-1">
                        Gmail App Password (16 Letters)
                      </label>
                      <input
                        type="password"
                        value={emailConfig.smtpPass}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpPass: e.target.value })}
                        placeholder={emailConfig.hasPassword ? "•••••••••••• (Saved)" : "abcd efgh ijkl mnop"}
                        className="w-full bg-[#1b0519] border border-primary-800/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-accent-500 font-mono"
                      />
                      <div className="mt-2 p-2.5 rounded-xl bg-accent-500/10 border border-accent-500/25 text-accent-200 text-xs leading-relaxed">
                        💡 <strong>How to get a Gmail App Password:</strong> Go to your Google Account → Security → 2-Step Verification → At the bottom select <strong>App passwords</strong> → Generate one named &quot;APIN&quot; → Copy the 16 letters here.
                      </div>
                    </div>
                  </div>
                )}

                {/* Resend Fields */}
                {emailConfig.provider === "resend" && (
                  <div className="p-4 rounded-2xl bg-[#1b0519]/70 border border-primary-800/80 space-y-3">
                    <label className="block text-xs font-medium text-surface-300 mb-1">
                      Resend API Key
                    </label>
                    <input
                      type="password"
                      value={emailConfig.resendApiKey}
                      onChange={(e) => setEmailConfig({ ...emailConfig, resendApiKey: e.target.value })}
                      placeholder="re_123456789..."
                      className="w-full bg-[#1b0519] border border-primary-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-accent-500"
                    />
                  </div>
                )}

                {/* Sender Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={emailConfig.fromName}
                      onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                      placeholder="APIN Verification"
                      className="w-full bg-[#1b0519] border border-primary-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-accent-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">
                      From Email (Display)
                    </label>
                    <input
                      type="email"
                      value={emailConfig.fromEmail}
                      onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                      placeholder={emailConfig.smtpUser || "noreply@apin.dev"}
                      className="w-full bg-[#1b0519] border border-primary-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-accent-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={savingConfig}
                  className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-surface-950 font-bold py-3 rounded-xl transition-all shadow-md shadow-accent-500/20"
                >
                  {savingConfig ? "Saving Configuration..." : "Save Email Configuration"}
                </Button>
              </form>
            </div>

            {/* Right Column: Live Test Email & Diagnostics */}
            <div className="lg:col-span-5 space-y-6">
              {/* Test Email Box */}
              <div className="card-interactive bg-[#280824]/75 border border-primary-800/70 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary-900/80">
                  <Send className="w-5 h-5 text-accent-400" />
                  <h3 className="font-bold text-white text-base">Live Gmail OTP Test</h3>
                </div>

                <p className="text-xs text-surface-400 mb-4 leading-relaxed">
                  Enter your Gmail address below to test the connection and send a real 6-digit verification code right now.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">
                      Destination Email Address
                    </label>
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="biswassirsho@gmail.com"
                      className="w-full bg-[#1b0519] border border-primary-800/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-accent-500"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={testingEmail}
                    className="w-full bg-primary-800 hover:bg-primary-700 text-white border border-accent-500/40 font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                  >
                    {testingEmail ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-accent-400" />
                        Dispatching to Gmail...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-accent-400" />
                        Send Live Test 6-Digit OTP
                      </>
                    )}
                  </Button>
                </div>

                {/* Test Feedback Result */}
                {testResult && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs leading-relaxed ${
                      testResult.success
                        ? "bg-accent-500/10 border-accent-500/30 text-accent-200"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm mb-1">
                      {testResult.success ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-accent-400" />
                          Delivery Succeeded!
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          Delivery Failed
                        </>
                      )}
                    </div>
                    <p>{testResult.message}</p>
                    {testResult.testCodeSent && (
                      <p className="mt-2 font-mono text-sm font-bold tracking-wider text-accent-300">
                        Code Sent: {testResult.testCodeSent}
                      </p>
                    )}
                    {testResult.recommendation && (
                      <p className="mt-2 text-accent-300 bg-accent-500/10 p-2 rounded-lg border border-accent-500/20">
                        <strong>Advice:</strong> {testResult.recommendation}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Status Info */}
              <div className="card-interactive bg-[#21061f]/60 border border-primary-900/80 rounded-3xl p-6 text-xs text-surface-400 space-y-3">
                <h4 className="font-semibold text-white text-sm">Real System Delivery Check</h4>
                <ul className="space-y-2 list-disc list-inside text-surface-400">
                  <li>
                    When candidate signs up on <strong>/signup</strong>, system calls <code className="text-accent-400 font-mono">sendOtpEmail()</code>.
                  </li>
                  <li>
                    If Gmail SMTP is saved here, <strong>nodemailer</strong> connects directly to Google&apos;s SMTP relay (<code className="text-accent-400 font-mono">smtp.gmail.com:587</code>).
                  </li>
                  <li>
                    The recipient receives the official 6-digit numeric OTP in their Gmail inbox instantly.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CANDIDATE DIRECTORY & DIRECT VERIFICATION */}
        {activeTab === "users" && (
          <div className="card-interactive bg-[#280824]/75 border border-primary-800/70 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary-900/80">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent-400" />
                  Candidate Directory & Account Management
                </h2>
                <p className="text-xs text-surface-400 mt-0.5">
                  View candidates and manually verify any account with 1-click administrative override
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={loadUsers}
                disabled={loadingUsers}
                className="border-primary-800/80 text-surface-200 text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingUsers ? "animate-spin" : ""}`} />
                Refresh List
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-primary-900/80 text-xs uppercase tracking-wider text-surface-400">
                    <th className="pb-3 font-semibold">Candidate</th>
                    <th className="pb-3 font-semibold">Contact Email</th>
                    <th className="pb-3 font-semibold">Joined Date</th>
                    <th className="pb-3 font-semibold">Activity</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-900/60">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-primary-900/30 transition-colors">
                      <td className="py-4">
                        <div className="font-semibold text-white">{user.username}</div>
                        <div className="text-xs text-surface-500 font-mono">{user.id}</div>
                      </td>
                      <td className="py-4">
                        <span className="text-surface-300">{user.email || "—"}</span>
                      </td>
                      <td className="py-4 text-xs text-surface-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-xs text-surface-400">
                        <span className="text-accent-400 font-semibold">{user._count.userProjects}</span> projects •{" "}
                        <span className="text-primary-300 font-semibold">{user._count.userSkills}</span> skills
                      </td>
                      <td className="py-4">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-500/15 text-accent-300 border border-accent-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Pending OTP
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        {!user.isVerified ? (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyUser(user.id, user.email)}
                            disabled={verifyingUserId === user.id}
                            className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-surface-950 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
                          >
                            {verifyingUserId === user.id ? "Verifying..." : "Verify Now"}
                          </Button>
                        ) : (
                          <span className="text-xs text-surface-500">Active Account</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-surface-500">
                        No candidates registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: OUTBOUND DELIVERY LOGS */}
        {activeTab === "logs" && (
          <div className="card-interactive bg-[#280824]/75 border border-primary-800/70 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary-900/80">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent-400" />
                  Email Delivery Audit Trail
                </h2>
                <p className="text-xs text-surface-400 mt-0.5">
                  Real-time log of every verification OTP email dispatched by the system
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-surface-400">
                  Delivery Rate: <strong className="text-accent-400">{logStats.successRate}%</strong>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadLogs}
                  className="border-primary-800/80 text-surface-200 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Refresh Logs
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-primary-900/80 text-xs uppercase tracking-wider text-surface-400">
                    <th className="pb-3 font-semibold">Recipient</th>
                    <th className="pb-3 font-semibold">Subject</th>
                    <th className="pb-3 font-semibold">Gateway</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Dispatched At</th>
                    <th className="pb-3 font-semibold">Diagnostic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-900/60">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-primary-900/30 transition-colors">
                      <td className="py-3.5 font-medium text-white">{log.to}</td>
                      <td className="py-3.5 text-xs text-surface-300">{log.subject}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#1c051a] border border-primary-800/60 text-surface-300">
                          {log.provider}
                        </span>
                      </td>
                      <td className="py-3.5">
                        {log.status === "SENT" ? (
                          <span className="inline-flex items-center gap-1 text-xs text-accent-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            DELIVERED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-semibold">
                            <XCircle className="w-3.5 h-3.5" />
                            FAILED
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-xs text-surface-400">
                        {new Date(log.sentAt).toLocaleTimeString()} · {new Date(log.sentAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 text-xs text-surface-500 font-mono max-w-xs truncate">
                        {log.error || "OK"}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-surface-500">
                        No delivery logs recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CANDIDATE REGISTRATION ALERTS */}
        {activeTab === "notifications" && (
          <div className="card-interactive bg-[#280824]/75 border border-primary-800/70 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary-900/80">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-accent-400" />
                  Candidate Registration & System Alerts
                </h2>
                <p className="text-xs text-surface-400 mt-0.5">
                  Real-time alerts sent to the Master Admin when candidates register or request OTPs
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="border-primary-800/80 text-surface-200 text-xs"
                >
                  Mark All as Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadNotifications}
                  className="border-primary-800/80 text-surface-200 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Refresh Alerts
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`card-interactive p-4 rounded-2xl border transition-all ${
                    !n.isRead
                      ? "bg-primary-950/80 border-accent-500/50 shadow-sm"
                      : "bg-[#20061e]/60 border-primary-900/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{n.title}</span>
                        {!n.isRead && (
                          <span className="px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-300 border border-accent-500/40 text-[10px] font-bold">
                            NEW
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-[#1b0519] text-surface-400 text-[10px] font-mono border border-primary-800/60">
                          {n.type}
                        </span>
                      </div>
                      <p className="text-xs text-surface-300 leading-relaxed">{n.message}</p>
                      {n.metadata && (
                        <div className="mt-2 flex items-center gap-3 text-[11px] text-surface-400 font-mono">
                          {n.metadata.email && <span>Email: {n.metadata.email}</span>}
                          {n.metadata.otp && (
                            <span className="text-accent-400 font-bold bg-accent-500/10 px-2 py-0.5 rounded border border-accent-500/30">
                              Dispatched OTP: {n.metadata.otp}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-surface-500 whitespace-nowrap">
                      {new Date(n.createdAt).toLocaleTimeString()} · {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-12 text-surface-500 text-sm">
                  No alerts received yet. New candidate sign-ups will appear here instantly!
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
