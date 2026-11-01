"use client";

import Link from "next/link";
import {
  Brain,
  Target,
  Code2,
  Briefcase,
  FileText,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThreeDCard } from "@/components/ui/three-d-card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent perspective-1200 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-surface-200/80 bg-white/82 backdrop-blur-2xl shadow-[0_2px_14px_rgba(58,15,52,0.03)] transition-all">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 shadow-[0_4px_12px_rgba(58,15,52,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-accent-400/40 group-hover:scale-105 group-hover:rotate-[-3deg] transition-all duration-300">
                <Brain className="h-5 w-5 text-accent-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-surface-900 leading-tight">
                  AP<span className="text-accent-500 font-black">IN</span>
                </span>
                <span className="text-[9px] font-bold text-surface-500 tracking-wider uppercase hidden sm:block">
                  Academic Project &amp; Internship Navigator
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-semibold text-surface-600 hover:text-primary-800 hover:-translate-y-0.5 transition-all"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-semibold text-surface-600 hover:text-primary-800 hover:-translate-y-0.5 transition-all"
              >
                How It Works
              </a>
              <a
                href="#for-students"
                className="text-sm font-semibold text-surface-600 hover:text-primary-800 hover:-translate-y-0.5 transition-all"
              >
                For Students
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-surface-700 font-semibold hover:bg-surface-100/90 hover:text-primary-800"
                >
                  Candidate Login
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-surface-300/80 bg-white/85 backdrop-blur-xs text-surface-800 hover:bg-surface-100 hover:border-primary-400/80 font-semibold shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5 mr-1 text-primary-700" />
                  Admin Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="marigold" size="sm" className="shadow-marigold font-bold text-primary-950">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Floating 3D Ambient Light Spheres in Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[500px] rounded-full bg-gradient-to-b from-surface-200/60 via-primary-100/30 to-transparent blur-3xl float-slow-3d" />
          <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-accent-200/25 blur-3xl float-3d" />
          <div className="absolute top-60 -right-20 w-96 h-96 rounded-full bg-primary-200/20 blur-3xl float-reverse-3d" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* 3D Floating Pill Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-surface-300/90 px-4 py-1.5 mb-6 shadow-[0_4px_18px_rgba(58,15,52,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] float-3d cursor-default">
              <Sparkles className="h-4 w-4 text-accent-500 animate-pulse" />
              <span className="text-sm font-bold text-primary-950">
                APIN — Academic Project &amp; Internship Navigator
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-surface-900 leading-tight">
              Your Career Journey,{" "}
              <span className="bg-gradient-to-r from-primary-700 via-primary-500 to-accent-500 bg-clip-text text-transparent">
                Intelligently Guided
              </span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-surface-600 max-w-2xl mx-auto leading-relaxed font-normal">
              From proctored competency exams and daily velocity tracking to ATS-tailored
              resumes and verified internships. Powered by deep AI career intelligence.
            </p>

            {/* Dual 3D Portal Cards: Candidate Login vs Admin Login */}
            <div className="mt-12 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {/* Card 1: Candidate Portal */}
              <ThreeDCard
                maxTilt={9}
                scale={1.02}
                className="p-6 rounded-3xl bg-white/90 backdrop-blur-2xl border border-surface-200/95 shadow-[0_12px_36px_rgba(58,15,52,0.07),inset_0_1px_1px_rgba(255,255,255,0.95)] group h-full flex flex-col justify-between"
              >
                <div>
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/80 border border-primary-200/90 flex items-center justify-center text-primary-700 mb-4 group-hover:scale-110 group-hover:rotate-[-4deg] transition-all duration-300 shadow-xs">
                    <Users className="h-5 w-5 text-primary-700" />
                  </div>
                  <h3 className="text-xl font-bold text-surface-900 depth-2">
                    Candidate Portal
                  </h3>
                  <p className="text-xs text-surface-600 mt-1.5 mb-5 leading-relaxed depth-1">
                    For students & job seekers. Complete profile, solve SIH challenges,
                    take 30-question assessments, and get matched.
                  </p>
                </div>
                <div className="flex gap-2.5 depth-2 pt-2">
                  <Link href="/login" className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-bold hover:border-primary-400"
                    >
                      User Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button variant="marigold" size="sm" className="w-full text-xs font-bold shadow-xs">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </ThreeDCard>

              {/* Card 2: Admin Command Portal (Deep Aubergine Velvet Luxury Glass with Marigold) */}
              <ThreeDCard
                maxTilt={9}
                scale={1.02}
                className="p-6 rounded-3xl bg-gradient-to-br from-primary-800 via-primary-700 to-primary-950 backdrop-blur-2xl border border-primary-600/60 shadow-[0_16px_40px_rgba(58,15,52,0.25),inset_0_1px_1px_rgba(255,255,255,0.25)] text-white group h-full flex flex-col justify-between"
              >
                <div>
                  <div className="h-11 w-11 rounded-2xl bg-white/12 border border-white/20 flex items-center justify-center text-accent-400 mb-4 group-hover:scale-110 group-hover:rotate-[4deg] transition-all duration-300 shadow-xs">
                    <Shield className="h-5 w-5 text-accent-400" />
                  </div>
                  <div className="flex items-center justify-between depth-2">
                    <h3 className="text-xl font-bold text-white">
                      Admin Command
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-500/25 text-accent-300 border border-accent-400/50 text-[10px] font-extrabold shadow-xs">
                      Master Setup
                    </span>
                  </div>
                  <p className="text-xs text-surface-200/90 mt-1.5 mb-5 leading-relaxed depth-1">
                    Zero verification needed for first admin. Automatically connects your Gmail to dispatch candidate OTPs.
                  </p>
                </div>
                <div className="flex gap-2.5 depth-2 pt-2">
                  <Link href="/admin/login" className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    >
                      Admin Login
                    </Button>
                  </Link>
                  <Link href="/admin/signup" className="flex-1">
                    <Button
                      variant="marigold"
                      size="sm"
                      className="w-full text-xs font-bold shadow-xs text-primary-950"
                    >
                      1st Admin Setup
                    </Button>
                  </Link>
                </div>
              </ThreeDCard>
            </div>

            {/* Trust Indicators with 3D Pop */}
            <div className="mt-14 flex items-center justify-center gap-8 text-sm text-surface-600 font-medium">
              <div className="flex items-center gap-2 hover:-translate-y-0.5 transition-transform">
                <Shield className="h-4.5 w-4.5 text-primary-700" />
                <span>Your data, your control</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 hover:-translate-y-0.5 transition-transform">
                <Zap className="h-4.5 w-4.5 text-accent-500" />
                <span>AI-verified skill evidence</span>
              </div>
              <div className="hidden md:flex items-center gap-2 hover:-translate-y-0.5 transition-transform">
                <CheckCircle2 className="h-4.5 w-4.5 text-success-600" />
                <span>No fabricated credentials</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with 3D Tilt */}
      <section id="features" className="py-24 bg-surface-100/50 backdrop-blur-md relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-surface-900">
              Everything You Need to Launch Your Career
            </h2>
            <p className="mt-4 text-lg text-surface-600 max-w-2xl mx-auto">
              A complete career intelligence platform that connects your skills, projects,
              experience, and opportunities into one powerful profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <ThreeDCard
                key={feature.title}
                maxTilt={8}
                scale={1.02}
                className="group relative rounded-3xl border border-surface-200/90 bg-white/88 backdrop-blur-xl p-7 shadow-[0_8px_24px_-4px_rgba(58,15,52,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] cursor-pointer h-full"
              >
                <div
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-black/5 shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg] depth-2"
                  style={{ backgroundColor: feature.bgColor }}
                >
                  <feature.icon
                    className="h-6 w-6"
                    style={{ color: feature.iconColor }}
                  />
                </div>
                <h3 className="text-lg font-bold text-surface-900 mb-2 depth-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-600 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </ThreeDCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works with 3D Steps */}
      <section id="how-it-works" className="py-24 bg-transparent relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-surface-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-surface-600">
              Your career journey in four intelligent steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center group">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+36px)] w-[calc(100%-72px)] h-[2px] bg-gradient-to-r from-accent-400/80 via-primary-300/40 to-surface-200" />
                )}
                <div className="card-interactive relative inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/90 backdrop-blur-xl border border-surface-300/90 mb-5 shadow-[0_8px_24px_rgba(58,15,52,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] cursor-pointer group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                  <step.icon className="h-8 w-8 text-primary-700 transition-transform duration-300 group-hover:scale-110" />
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-primary-700 to-accent-500 text-white text-xs font-black shadow-md border-2 border-white">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-surface-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-surface-600 leading-relaxed font-normal">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Students Section with 3D Radar Stats */}
      <section id="for-students" className="py-24 bg-surface-100/60 backdrop-blur-md relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent-100/90 border border-accent-300/80 px-4 py-1.5 mb-6 shadow-xs float-3d">
                <GraduationCap className="h-4 w-4 text-accent-700" />
                <span className="text-sm font-bold text-accent-950">
                  Built for Students
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-surface-900 mb-6 leading-tight">
                Not Just a Resume Builder.{" "}
                <span className="text-primary-700">A Career Companion.</span>
              </h2>
              <p className="text-lg text-surface-600 mb-8 leading-relaxed font-normal">
                APIN (Academic Project &amp; Internship Navigator) accompanies you from your first semester to your dream job.
                Every skill you learn, every capstone project you build, every assessment you master
                contributes to your verified progression profile.
              </p>
              <ul className="space-y-4">
                {studentBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 group">
                    <CheckCircle2 className="h-5 w-5 text-accent-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-surface-700 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link href="/signup">
                  <Button variant="marigold" size="lg" className="shadow-marigold font-bold text-primary-950">
                    Create Your Profile
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* 3D Stats Card */}
            <ThreeDCard maxTilt={7} scale={1.015} className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-surface-200/90 shadow-[0_20px_50px_rgba(58,15,52,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] p-8">
              <h3 className="text-lg font-bold text-surface-900 mb-6 depth-2">
                Career Readiness Overview
              </h3>
              <div className="space-y-5">
                {readinessIndicators.map((indicator) => (
                  <div key={indicator.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-surface-700">
                        {indicator.label}
                      </span>
                      <span className="text-sm font-black text-primary-900">
                        {indicator.value}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-surface-200/90 overflow-hidden shadow-inner">
                      <div
                        className="h-2.5 rounded-full transition-all duration-700 ease-out progress-liquid"
                        style={{
                          width: `${indicator.value}%`,
                          backgroundColor: indicator.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-surface-200/80 depth-2">
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-accent-50/80 border border-accent-200/80 shadow-xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-200/90 text-accent-700 shadow-xs">
                    <Lightbulb className="h-5 w-5 text-accent-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-surface-900">
                      AI Recommendation
                    </p>
                    <p className="text-xs text-surface-600">
                      Complete a React assessment to improve Technical Readiness
                    </p>
                  </div>
                </div>
              </div>
            </ThreeDCard>
          </div>
        </div>
      </section>

      {/* CTA Section (Deep Aubergine Velvet 3D Luxury Glass) */}
      <section className="py-24 bg-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <ThreeDCard
            maxTilt={6}
            scale={1.01}
            className="rounded-3xl bg-gradient-to-br from-primary-950 via-primary-800 to-primary-900 border border-primary-600/60 backdrop-blur-2xl p-12 sm:p-16 relative overflow-hidden shadow-[0_25px_60px_rgba(58,15,52,0.32),inset_0_1px_1px_rgba(255,255,255,0.2)] text-white"
          >
            {/* Decorative subtle glass rings */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-400/15 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none float-slow-3d" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none float-reverse-3d" />

            <div className="relative depth-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                Start Your Career Intelligence Journey
              </h2>
              <p className="text-lg text-surface-200/95 mb-8 max-w-xl mx-auto font-normal leading-relaxed">
                Join students who are building evidence-based career profiles
                that go far beyond a traditional resume.
              </p>
              <Link href="/signup">
                <Button
                  variant="marigold"
                  size="xl"
                  className="shadow-marigold font-bold text-primary-950 hover:brightness-105"
                >
                  Get Started — It&apos;s Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ThreeDCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200/80 bg-white/75 backdrop-blur-xl py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-700 to-primary-800 text-white shadow-xs">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-surface-900 leading-tight">
                  AP<span className="text-accent-500 font-black">IN</span>
                </span>
                <span className="text-[9px] font-semibold text-surface-500 uppercase tracking-wider">
                  Academic Project &amp; Internship Navigator
                </span>
              </div>
            </div>
            <p className="text-sm text-surface-500">
              &copy; {new Date().getFullYear()} APIN — Academic Project &amp; Internship Navigator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ================================================
   Data
   ================================================ */

const features = [
  {
    icon: Target,
    title: "Skill Intelligence",
    description:
      "Go beyond self-rating. Assessments, projects, and experience feed into a multi-signal skill profile with evidence-backed scoring.",
    bgColor: "#FAF5F9",
    iconColor: "#5C1956",
  },
  {
    icon: Code2,
    title: "Smart Assessments",
    description:
      "Comprehensive skill assessments with MCQ, coding challenges, debugging, and real-world scenarios — scored by topic and difficulty.",
    bgColor: "#FEF9EB",
    iconColor: "#C78D00",
  },
  {
    icon: Lightbulb,
    title: "AI Project Recommendations",
    description:
      "Get personalized project ideas based on your skills, gaps, interests, and career goals. Track progress with milestones and daily updates.",
    bgColor: "#FAF5F9",
    iconColor: "#3A0F34",
  },
  {
    icon: Briefcase,
    title: "Opportunity Matching",
    description:
      "Discover internships and jobs that match your verified skills. See exactly what aligns, what's missing, and how to prepare.",
    bgColor: "#FDF1CD",
    iconColor: "#9E6C00",
  },
  {
    icon: FileText,
    title: "Intelligent Resume",
    description:
      "Generate job-specific, ATS-optimized resumes from your evidence-based profile. No fabricated credentials — only verified data.",
    bgColor: "#EDF1F4",
    iconColor: "#37434D",
  },
  {
    icon: BarChart3,
    title: "Career Intelligence",
    description:
      "Multi-dimensional readiness indicators across technical skills, projects, interview prep, and portfolio — not a single magic score.",
    bgColor: "#FAF5F9",
    iconColor: "#883280",
  },
];

const steps = [
  {
    icon: Users,
    title: "Build Your Profile",
    description: "Add education, skills, interests, and career goals through guided onboarding.",
  },
  {
    icon: Target,
    title: "Assess & Build",
    description: "Take skill assessments, start projects, track progress, and collect evidence.",
  },
  {
    icon: TrendingUp,
    title: "Match & Prepare",
    description: "Discover opportunities, analyze job requirements, and generate targeted resumes.",
  },
  {
    icon: Star,
    title: "Launch Your Career",
    description: "Apply with confidence using your evidence-based profile and AI-powered preparation.",
  },
];

const studentBenefits = [
  "Multi-signal skill assessment — not just self-rating",
  "AI-generated projects tailored to your gaps and goals",
  "Evidence-based resume generation — no fabricated data",
  "Internship & job matching with transparent explanations",
  "Career readiness across 6 dimensions, not one magic number",
  "Works for technical AND non-technical career paths",
  "Historical data preserved — your career story grows with you",
];

const readinessIndicators = [
  { label: "Technical Readiness", value: 78, color: "#3A0F34" }, // Deep Aubergine
  { label: "Project Readiness", value: 65, color: "#EAAA00" }, // Marigold
  { label: "Internship Readiness", value: 54, color: "#5C1956" }, // Aubergine Plum
  { label: "Resume Readiness", value: 42, color: "#C78D00" }, // Burnished Gold
  { label: "Interview Readiness", value: 38, color: "#748493" }, // Ice Silver Slate
  { label: "Portfolio Readiness", value: 25, color: "#883280" }, // Aubergine Accent
];
