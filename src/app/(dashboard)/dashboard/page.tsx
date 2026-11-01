"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Target,
  FolderKanban,
  Briefcase,
  FileText,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ClipboardCheck,
  Award,
  Clock,
  Building2,
  Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ThreeDCard } from "@/components/ui/three-d-card";
import { api } from "@/lib/api-client";

interface DashboardSummary {
  profileName: string;
  completionScore: number;
  skillsCount: number;
  verifiedCount: number;
  projectsCount: number;
  hoursLogged: number;
  readinessScore: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>({
    profileName: "Engineer",
    completionScore: 65,
    skillsCount: 0,
    verifiedCount: 0,
    projectsCount: 0,
    hoursLogged: 0,
    readinessScore: 78,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [me, skills, projects, insights] = await Promise.all([
          api.get<any>("/api/auth/me").catch(() => null),
          api.get<any[]>("/api/skills?scope=me").catch(() => []),
          api.get<any[]>("/api/projects").catch(() => []),
          api.get<any>("/api/career/insights").catch(() => null),
        ]);

        const verified = (skills || []).filter((s: any) => s.assessmentScore !== null).length;
        const totalHours = (projects || []).reduce((acc: number, p: any) => acc + (p.totalHoursLogged || 0), 0);

        setSummary({
          profileName: me?.profile?.firstName || me?.username || "Candidate",
          completionScore: me?.profile?.completionScore || 70,
          skillsCount: skills?.length || 0,
          verifiedCount: verified,
          projectsCount: projects?.length || 0,
          hoursLogged: Math.round(totalHours * 10) / 10,
          readinessScore: insights?.overallReadiness || 75,
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const quickActions = [
    {
      icon: Target,
      title: "Skills & Taxonomy",
      description: `Track ${summary.skillsCount} technical skills with verified IQ competency tests.`,
      cta: "Manage Skills",
      href: "/dashboard/skills",
      bgColor: "#FAF5F9",
      iconColor: "#3A0F34",
    },
    {
      icon: ClipboardCheck,
      title: "Competency Assessments",
      description: "Standardized 30-question exams in JavaScript, TypeScript, and React.",
      cta: "Take Skill Exam",
      href: "/dashboard/assessments",
      bgColor: "#FEF9EB",
      iconColor: "#B45309",
    },
    {
      icon: FolderKanban,
      title: "AI Project Hub",
      description: "Adopt SIH challenges and hardware IoT builds with daily velocity logging.",
      cta: "Track Projects",
      href: "/dashboard/projects",
      bgColor: "#F3E8F1",
      iconColor: "#3A0F34",
    },
    {
      icon: Building2,
      title: "Sourced Internships",
      description: "Roles from Zepto, Razorpay, and Swiggy with live skill match scoring.",
      cta: "Browse Internships",
      href: "/dashboard/internships",
      bgColor: "#EDF1F5",
      iconColor: "#4F1647",
    },
    {
      icon: FileText,
      title: "AI Tailored Resume",
      description: "Generate role-specific ATS PDF resumes using your daily progress maps.",
      cta: "Build Tailored Resume",
      href: "/dashboard/resume",
      bgColor: "#FFF8E6",
      iconColor: "#9A6700",
    },
    {
      icon: Sparkles,
      title: "Interactive AI Advisor",
      description: "Ask questions and receive guided multiple-choice strategic next steps.",
      cta: "Start Decision Engine",
      href: "/dashboard/ai",
      bgColor: "#E9EFF3",
      iconColor: "#3A0F34",
    },
  ];

  return (
    <div className="space-y-8 animate-page-enter max-w-6xl mx-auto pb-16 perspective-1200">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 mb-1 tracking-tight">
            Welcome back, {summary.profileName}!
          </h1>
          <p className="text-sm text-surface-600">
            Your career progression engine is live. Track daily velocity, verify skills, and match opportunities.
          </p>
        </div>
        <Link href="/dashboard/ai">
          <Button variant="marigold" className="gap-2 shadow-marigold font-bold text-primary-950">
            <Sparkles className="h-4 w-4 text-primary-950 animate-pulse" />
            AI Decision Assistant
          </Button>
        </Link>
      </div>

      {/* Live Metrics Row with 3D Tilt */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ThreeDCard maxTilt={8} scale={1.02} className="rounded-2xl border border-surface-200/90 bg-white/88 backdrop-blur-xl p-5 shadow-[0_4px_16px_rgba(58,15,52,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] cursor-pointer">
          <p className="text-xs font-bold text-surface-500 uppercase tracking-wider depth-1">Exam Verified</p>
          <p className="text-3xl font-black text-accent-600 mt-1 depth-2">{summary.verifiedCount}</p>
          <span className="text-[11px] text-surface-500 mt-0.5 block">Standardized tests passed</span>
        </ThreeDCard>

        <ThreeDCard maxTilt={8} scale={1.02} className="rounded-2xl border border-surface-200/90 bg-white/88 backdrop-blur-xl p-5 shadow-[0_4px_16px_rgba(58,15,52,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] cursor-pointer">
          <p className="text-xs font-bold text-surface-500 uppercase tracking-wider depth-1">Active Capstones</p>
          <p className="text-3xl font-black text-surface-900 mt-1 depth-2">{summary.projectsCount}</p>
          <span className="text-[11px] text-surface-500 mt-0.5 block">Hardware & software builds</span>
        </ThreeDCard>

        <ThreeDCard maxTilt={8} scale={1.02} className="rounded-2xl border border-surface-200/90 bg-white/88 backdrop-blur-xl p-5 shadow-[0_4px_16px_rgba(58,15,52,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] cursor-pointer">
          <p className="text-xs font-bold text-surface-500 uppercase tracking-wider depth-1">Execution Hours</p>
          <p className="text-3xl font-black text-primary-700 mt-1 depth-2">{summary.hoursLogged}h</p>
          <span className="text-[11px] text-surface-500 mt-0.5 block">Logged on progress map</span>
        </ThreeDCard>

        <ThreeDCard maxTilt={8} scale={1.02} className="rounded-2xl border border-surface-200/90 bg-white/88 backdrop-blur-xl p-5 shadow-[0_4px_16px_rgba(58,15,52,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] cursor-pointer">
          <p className="text-xs font-bold text-surface-500 uppercase tracking-wider depth-1">Readiness Index</p>
          <p className="text-3xl font-black text-primary-700 mt-1 flex items-center gap-1 depth-2">
            <TrendingUp className="h-6 w-6 text-accent-500" />
            {summary.readinessScore}%
          </p>
          <span className="text-[11px] text-surface-500 mt-0.5 block">6-dimension readiness</span>
        </ThreeDCard>
      </div>

      {/* AI Next Steps 3D Banner */}
      <ThreeDCard
        maxTilt={5}
        scale={1.01}
        className="rounded-3xl bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 text-white border border-primary-700/60 shadow-[0_16px_40px_rgba(58,15,52,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden p-6 sm:p-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 depth-1">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-500/25 text-accent-400 border border-accent-400/40 shadow-xs">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-xs font-black text-accent-400 uppercase tracking-wider">
                Automated AI Progression Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight depth-2">
              What should you focus on today?
            </h2>
            <p className="text-xs sm:text-sm text-surface-200/95 leading-relaxed font-normal">
              The AI evaluated your profile, skills, and maker hobbies. Choose your next move: take a 30-question assessment, adopt an official SIH disaster relief project, or generate an ATS resume for Zepto.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0 depth-2">
            <Link href="/dashboard/assessments">
              <Button variant="marigold" className="text-xs gap-1.5 font-bold shadow-md text-primary-950">
                <ClipboardCheck className="h-4 w-4 text-primary-950" />
                Take Skill Exam
              </Button>
            </Link>
            <Link href="/dashboard/projects">
              <Button variant="outline" className="border-white/25 bg-white/10 text-white hover:bg-white/20 text-xs gap-1.5 font-semibold">
                <FolderKanban className="h-4 w-4 text-accent-400" />
                Log Daily Work
              </Button>
            </Link>
          </div>
        </div>
      </ThreeDCard>

      {/* Quick Actions 3D Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {quickActions.map((action, idx) => (
          <Link key={action.title} href={action.href} className="group block h-full">
            <ThreeDCard
              maxTilt={7}
              scale={1.02}
              className="h-full rounded-3xl border border-surface-200/90 bg-white/88 backdrop-blur-xl p-6 shadow-[0_6px_20px_rgba(58,15,52,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] group-hover:border-accent-400/60 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div
                  className="mb-3.5 inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg] depth-2"
                  style={{ backgroundColor: action.bgColor }}
                >
                  <action.icon className="h-5 w-5" style={{ color: action.iconColor }} />
                </div>
                <h3 className="text-base font-bold text-surface-900 group-hover:text-primary-800 transition-colors mb-2 depth-1">
                  {action.title}
                </h3>
                <p className="text-xs text-surface-600 leading-relaxed font-normal">{action.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-200/70 depth-1">
                <span className="text-xs font-bold text-primary-700 group-hover:text-accent-600 inline-flex items-center gap-1 transition-colors">
                  {action.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </ThreeDCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
