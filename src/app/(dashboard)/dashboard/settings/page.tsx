"use client";

import { useState, useEffect } from "react";
import { Settings, Shield, Bell, Key, User, Palette, Eye, EyeOff, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api, ApiError } from "@/lib/api-client";

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem("ciq_pref_email_alerts");
    const savedDigest = localStorage.getItem("ciq_pref_weekly_digest");
    const savedMatch = localStorage.getItem("ciq_pref_match_alerts");
    if (savedAlerts !== null) setEmailAlerts(savedAlerts === "true");
    if (savedDigest !== null) setWeeklyDigest(savedDigest === "true");
    if (savedMatch !== null) setMatchNotifications(savedMatch === "true");
  }, []);

  const handleToggleAlerts = (checked: boolean) => {
    setEmailAlerts(checked);
    localStorage.setItem("ciq_pref_email_alerts", String(checked));
    toast.success("Notification preferences updated");
  };

  const handleToggleDigest = (checked: boolean) => {
    setWeeklyDigest(checked);
    localStorage.setItem("ciq_pref_weekly_digest", String(checked));
    toast.success("AI digest schedule updated");
  };

  const handleToggleMatch = (checked: boolean) => {
    setMatchNotifications(checked);
    localStorage.setItem("ciq_pref_match_alerts", String(checked));
    toast.success("Match alert preferences updated");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      toast.error("Password must contain uppercase, lowercase, and numbers.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await api.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to update password. Please check your credentials.");
      }
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Account & Platform Settings</h1>
        <p className="text-sm text-surface-500">
          Manage your notifications, credentials, and AI career evaluation cadence.
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary-600" />
              Notification & Cadence Preferences
            </CardTitle>
            <CardDescription className="text-xs">
              Configure daily project logging reminders and new internship & job match alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-surface-800">Daily Project Execution Reminder</p>
                <p className="text-xs text-surface-500">Receive evening prompt to log daily build velocity and hours</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => handleToggleAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-100">
              <div>
                <p className="text-sm font-semibold text-surface-800">Weekly AI Career Intelligence Digest</p>
                <p className="text-xs text-surface-500">Weekly report on skill mastery shifts, velocity ratings, and matched roles</p>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => handleToggleDigest(e.target.checked)}
                className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-100">
              <div>
                <p className="text-sm font-semibold text-surface-800">Instant Sourced Opportunity Alerts</p>
                <p className="text-xs text-surface-500">Get notified when a new job or internship has &gt;85% match score</p>
              </div>
              <input
                type="checkbox"
                checked={matchNotifications}
                onChange={(e) => handleToggleMatch(e.target.checked)}
                className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              Security & Credentials
            </CardTitle>
            <CardDescription className="text-xs">
              Update your account password and review authentication security controls.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  label="Current Password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 transition-colors"
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    label="New Password"
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <Input
                  type="password"
                  label="Confirm New Password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-surface-400">
                  Password must include 8+ chars with uppercase, lowercase, and numbers.
                </p>
                <Button type="submit" size="sm" loading={savingPassword}>
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Active Session & Platform Info */}
        <Card className="bg-surface-50 border-surface-200">
          <CardContent className="p-4 flex items-center justify-between text-xs text-surface-500">
            <div className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              <span>Session encrypted with JSON Web Tokens (HTTP-only secure cookies)</span>
            </div>
            <Badge variant="outline" className="text-[11px] bg-white border-surface-200 text-surface-600">
              APIN (Academic Project &amp; Internship Navigator) v1.0.0
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
