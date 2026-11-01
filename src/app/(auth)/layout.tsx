import { Brain } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-transparent perspective-1200 overflow-x-hidden">
      {/* Left — Branding Panel (Ice Silver Glass with Deep Aubergine & Marigold accents) */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col justify-between bg-gradient-to-br from-surface-200/90 via-surface-100/95 to-surface-200/90 backdrop-blur-2xl border-r border-surface-300/80 p-12 relative overflow-hidden preserve-3d">
        {/* Decorative 3D floating glass rings */}
        <div className="absolute top-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full border border-primary-300/30 bg-primary-500/8 backdrop-blur-md pointer-events-none float-slow-3d" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[320px] h-[320px] rounded-full border border-accent-300/40 bg-accent-500/8 backdrop-blur-md pointer-events-none float-reverse-3d" />

        <div className="relative depth-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-800 to-primary-950 shadow-[0_4px_16px_rgba(58,15,52,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-primary-700/60 group-hover:scale-105 group-hover:rotate-[-3deg] transition-all duration-300">
              <Brain className="h-6 w-6 text-accent-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-surface-900 leading-tight">
                AP<span className="text-accent-500">IN</span>
              </span>
              <span className="text-[10px] font-bold text-surface-500 tracking-wider uppercase">
                Academic Project &amp; Internship Navigator
              </span>
            </div>
          </Link>
        </div>

        <div className="relative depth-1">
          <div className="inline-block px-3.5 py-1 rounded-full bg-accent-100/95 border border-accent-300/80 text-xs font-black text-accent-950 mb-4 shadow-xs float-3d">
            Student Intelligence System
          </div>
          <h2 className="text-3xl font-extrabold text-surface-900 leading-tight mb-4">
            Your Career Journey,
            <br />
            <span className="bg-gradient-to-r from-primary-800 via-primary-600 to-accent-600 bg-clip-text text-transparent">
              Intelligently Guided
            </span>
          </h2>
          <p className="text-surface-600 text-base leading-relaxed font-normal">
            Build an evidence-based career profile with AI-powered skill assessments,
            project recommendations, and opportunity matching.
          </p>
        </div>

        <div className="relative">
          <p className="text-xs text-surface-500 font-medium">
            &copy; {new Date().getFullYear()} APIN — Academic Project &amp; Internship Navigator. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right — Auth Form Area with Floating 3D Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-transparent">
        <div className="card-interactive preserve-3d w-full max-w-[460px] p-8 sm:p-10 rounded-3xl bg-white/92 backdrop-blur-2xl border border-surface-200/95 shadow-[0_25px_60px_-10px_rgba(58,15,52,0.12),inset_0_1px_1px_rgba(255,255,255,0.95)] animate-page-enter">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 depth-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-800 shadow-sm border border-accent-400/40">
                <Brain className="h-5 w-5 text-accent-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-surface-900 leading-tight">
                  AP<span className="text-accent-500">IN</span>
                </span>
                <span className="text-[9px] font-bold text-surface-500 tracking-wider uppercase">
                  Academic Project &amp; Internship Navigator
                </span>
              </div>
            </Link>
          </div>

          <div className="depth-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
