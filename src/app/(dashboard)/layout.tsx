"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Brain,
  LayoutDashboard,
  User,
  Target,
  ClipboardCheck,
  FolderKanban,
  Briefcase,
  Building2,
  FileText,
  Globe,
  Send,
  TrendingUp,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api-client";
import { getInitials } from "@/lib/utils";

interface UserData {
  id: string;
  username: string;
  email: string | null;
  profile: {
    firstName: string | null;
    lastName: string | null;
    preferredName: string | null;
    profilePhotoUrl?: string | null;
    headline: string | null;
    onboardingComplete: boolean;
    onboardingStep: number;
    completionScore: number;
  } | null;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Target, label: "Skills", href: "/dashboard/skills" },
  { icon: ClipboardCheck, label: "Assessments", href: "/dashboard/assessments" },
  { icon: FolderKanban, label: "Projects", href: "/dashboard/projects" },
  { icon: Building2, label: "Internships", href: "/dashboard/internships" },
  { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs" },
  { icon: FileText, label: "Resume", href: "/dashboard/resume" },
  { icon: Globe, label: "Portfolio", href: "/dashboard/portfolio" },
  { icon: Send, label: "Applications", href: "/dashboard/applications" },
  { icon: TrendingUp, label: "Career Intelligence", href: "/dashboard/career" },
  { icon: Sparkles, label: "AI Assistant", href: "/dashboard/ai" },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await api.get<UserData>("/api/auth/me");
        setUser(data);

        // Redirect to onboarding if not complete
        if (data.profile && !data.profile.onboardingComplete) {
          router.push("/onboarding");
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/85 backdrop-blur-xl border border-surface-200/90 shadow-[0_16px_40px_rgba(58,15,52,0.12)]">
          <div className="h-10 w-10 rounded-full border-2 border-surface-300 border-t-accent-500 animate-spin" />
          <p className="text-sm font-semibold text-primary-900">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const displayName =
    user?.profile?.preferredName ||
    user?.profile?.firstName ||
    user?.username ||
    "User";

  return (
    <div className="min-h-screen bg-transparent">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Frosted Ice Silver Luxury Glass with 3D Depth) */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white/88 backdrop-blur-2xl border-r border-surface-200/90 shadow-[4px_0_30px_rgba(58,15,52,0.06)] flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo with 3D Brand Badge */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-surface-200/70">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 shadow-[0_4px_12px_rgba(58,15,52,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-accent-400/50 group-hover:scale-105 group-hover:rotate-[-3deg] transition-all duration-300">
              <Brain className="h-4.5 w-4.5 text-accent-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-surface-900 leading-tight">
                AP<span className="text-accent-500 font-black">IN</span>
              </span>
              <span className="text-[8.5px] font-bold text-surface-500 tracking-wider uppercase leading-tight">
                Academic Project &amp; Internship Navigator
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav with 3D Pill Elevation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-primary-50 via-white to-accent-50 text-primary-950 font-bold shadow-[0_4px_16px_rgba(58,15,52,0.08),0_1px_3px_rgba(234,170,0,0.12)] border border-accent-400/60 translate-x-1"
                      : "text-surface-600 hover:bg-white/80 hover:text-surface-900 hover:translate-x-1 hover:shadow-xs"
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-accent-500 shadow-[0_0_8px_rgba(234,170,0,0.8)]" />
                  )}
                  <item.icon
                    className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-accent-600 ml-1" : "text-surface-400 group-hover:text-primary-700"
                    }`}
                  />
                  <span>{item.label}</span>
                  <ChevronRight
                    className={`h-3.5 w-3.5 ml-auto transition-all duration-200 ${
                      isActive ? "opacity-100 text-accent-500 translate-x-0.5" : "opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-surface-200/70 px-3 py-3 space-y-1.5">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary-50 text-primary-900 font-bold border border-accent-400/50 shadow-xs"
                    : "text-surface-600 hover:bg-white/80 hover:text-surface-900 hover:translate-x-1"
                }`}
              >
                <item.icon className={`h-4.5 w-4.5 ${isActive ? "text-accent-600" : "text-surface-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-surface-600 hover:bg-danger-50 hover:text-danger-600 hover:translate-x-1 transition-all duration-200 w-full cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 text-surface-400" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar with 3D Blur & Ambient Drop Shadow */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/82 backdrop-blur-2xl border-b border-surface-200/90 shadow-[0_2px_12px_rgba(58,15,52,0.03)] transition-all">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-surface-500 hover:text-surface-900 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          {/* User Profile Pill with 3D Hover Elevation */}
          <div className="flex items-center gap-3 py-1.5 px-3 rounded-2xl bg-white/70 backdrop-blur-md border border-surface-200/80 shadow-[0_2px_8px_rgba(58,15,52,0.04)] hover:shadow-[0_4px_14px_rgba(58,15,52,0.08)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-surface-900 leading-tight">{displayName}</p>
              <p className="text-xs text-surface-400">@{user?.username}</p>
            </div>
            <Avatar className="h-9 w-9 border-2 border-accent-400/40 shadow-xs">
              {user?.profile?.profilePhotoUrl && (
                <AvatarImage src={user.profile.profilePhotoUrl} alt={displayName} className="object-cover" />
              )}
              <AvatarFallback className="text-xs font-bold bg-primary-100 text-primary-900">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content with Silky Smooth 3D Entrance on Route Changes */}
        <main key={pathname} className="p-4 sm:p-6 lg:p-8 animate-page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
