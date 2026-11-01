"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Play,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Clock,
  Award,
  FolderKanban,
  GraduationCap,
  Share2,
  Maximize2,
  X,
  Code,
  HardDrive,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThreeDCard } from "@/components/ui/three-d-card";
import { PortfolioTemplateProps } from "./types";
import { getInitials } from "@/lib/utils";

export function DevRetroTemplate({
  user,
  bannerUrl,
  skills,
  projects,
  education,
  isDashboardPreview,
  onShareClick,
}: PortfolioTemplateProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const socialMap: Record<string, string> = {};
  user.socialProfiles?.forEach((s) => {
    socialMap[s.platform.toLowerCase()] = s.url;
  });

  return (
    <div className="relative min-h-screen bg-[#050b07] text-[#34d399] font-mono overflow-x-hidden selection:bg-emerald-500/40 selection:text-black">
      {/* CRT Scanline & Phosphor Overlay */}
      <div className="pointer-events-none fixed inset-0 z-20 opacity-[0.12] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      <div
        className="pointer-events-none fixed inset-0 z-20 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 3px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Retro CRT Navigation Bar */}
        {!isDashboardPreview && (
          <nav className="flex items-center justify-between p-3.5 rounded-lg bg-[#07130c] border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-emerald-400 font-black text-sm flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-emerald-400 animate-pulse" />
                APIN_V2.0@HOST:~#
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {onShareClick && (
                <button
                  onClick={onShareClick}
                  className="px-3 py-1 text-xs border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/20 transition-colors flex items-center gap-1 rounded"
                >
                  <Share2 className="h-3 w-3" />
                  $ share --url
                </button>
              )}
              <Link href="/signup">
                <button className="px-3 py-1 text-xs bg-emerald-500 text-black font-extrabold hover:bg-emerald-400 transition-colors flex items-center gap-1 rounded shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  <Play className="h-3 w-3 fill-black" />
                  INIT_SYS
                </button>
              </Link>
            </div>
          </nav>
        )}

        {/* 3D CRT Terminal Hero */}
        <ThreeDCard maxTilt={6} depth={18} glare={true}>
          <div className="relative rounded-xl overflow-hidden bg-[#07130b] border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            {/* Terminal Window Chrome Titlebar */}
            <div className="flex items-center justify-between px-4 py-2 bg-emerald-950/70 border-b border-emerald-500/30 text-[11px] text-emerald-400">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-bold">session_bash // user@{user.username || "dev"}</span>
              </div>
              <span className="text-emerald-400/60 font-semibold text-[10px]">VT100 PHOSPHOR 80x25</span>
            </div>

            {bannerUrl && (
              <div className="relative h-44 sm:h-56 w-full overflow-hidden border-b border-emerald-500/30">
                <img
                  src={bannerUrl}
                  alt="Terminal Banner"
                  className="w-full h-full object-cover filter contrast-125 saturate-50 hue-rotate-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07130b]/80 to-[#07130b]" />
              </div>
            )}

            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* CRT Green Tint Avatar */}
                  {user.profilePhotoUrl ? (
                    <div className="relative border-2 border-emerald-400 rounded-lg p-1 bg-black shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                      <img
                        src={user.profilePhotoUrl}
                        alt={user.name}
                        className="h-24 w-24 sm:h-28 sm:w-28 rounded object-cover filter contrast-125 brightness-95"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded border-2 border-emerald-400 bg-black flex items-center justify-center text-3xl font-black text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                      {getInitials(user.name)}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="text-xs text-emerald-500/80">
                      $ cat /etc/candidate_identity.cfg
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                      {user.name}
                      <span className="inline-block w-2.5 h-6 bg-emerald-400 animate-pulse" />
                    </h1>
                    <p className="text-emerald-300 text-xs sm:text-sm font-semibold max-w-xl">
                      ROLE: {user.headline || "Full-Stack Software Engineer & Hacker"}
                    </p>
                    {(user.city || user.country) && (
                      <p className="text-[11px] text-emerald-400/70 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        LOC: {[user.city, user.country].filter(Boolean).join(" / ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Commands / Social Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {socialMap.github && (
                    <a
                      href={socialMap.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 border border-emerald-500/40 bg-black hover:bg-emerald-500/20 text-emerald-300 text-xs rounded transition-colors"
                      title="GitHub"
                    >
                      git clone
                    </a>
                  )}
                  {socialMap.linkedin && (
                    <a
                      href={socialMap.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 border border-emerald-500/40 bg-black hover:bg-emerald-500/20 text-emerald-300 text-xs rounded transition-colors"
                      title="LinkedIn"
                    >
                      ping linkedin
                    </a>
                  )}
                  {user.email && (
                    <a
                      href={`mailto:${user.email}?subject=TERMINAL_QUERY`}
                      className="px-3.5 py-1.5 bg-emerald-500 text-black font-extrabold text-xs rounded shadow-[0_0_10px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition-colors"
                    >
                      mail -s "hire"
                    </a>
                  )}
                  {onShareClick && (
                    <button
                      onClick={onShareClick}
                      className="p-1.5 border border-emerald-500/40 bg-black text-emerald-300 rounded"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {user.about && (
                <div className="p-3.5 rounded bg-black/60 border border-emerald-500/20 text-xs text-emerald-200/80 leading-relaxed">
                  <span className="text-emerald-400 font-bold">$ cat bio.txt</span>
                  <p className="mt-1">{user.about}</p>
                </div>
              )}
            </div>
          </div>
        </ThreeDCard>

        {/* 3D Skills Terminal Array */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-400" />
              $ ./benchmark_skills --verified
            </h2>
            <span className="text-xs text-emerald-400/80">
              [{skills.length} MODULES LOADED]
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {skills.map((item, idx) => (
              <ThreeDCard key={idx} maxTilt={10} depth={12} glare={true}>
                <div className="p-3.5 rounded bg-[#07130b] border border-emerald-500/30 hover:border-emerald-400 transition-all space-y-2 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-emerald-400/60 block uppercase">
                      TYPE: {item.skill.category?.name || "SYS"}
                    </span>
                    <p className="font-bold text-xs text-white mt-0.5">{item.skill.name}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20 text-[11px]">
                    <span className="font-bold text-emerald-400">
                      IQ: {item.overallScore || item.assessmentScore || 80}%
                    </span>
                    <span className="text-[9px] text-emerald-500 font-bold">[OK]</span>
                  </div>
                </div>
              </ThreeDCard>
            ))}
          </div>
        </div>

        {/* 3D Capstones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-emerald-400" />
              $ ls -la /var/projects/
            </h2>
            <span className="text-xs text-emerald-400/80">
              TOTAL {projects.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <ThreeDCard key={proj.id} maxTilt={6} depth={15} glare={true}>
                <div className="rounded-xl bg-[#07130b] border border-emerald-500/40 hover:border-emerald-400 transition-all overflow-hidden flex flex-col justify-between h-full group">
                  <div>
                    {proj.imageUrl ? (
                      <div
                        className="relative h-44 sm:h-52 w-full overflow-hidden bg-black cursor-pointer border-b border-emerald-500/30"
                        onClick={() => setSelectedImage(proj.imageUrl!)}
                      >
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover filter contrast-125 brightness-90 group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 text-[10px] text-emerald-400 border border-emerald-500/40">
                          UI_DUMP.RAW
                        </div>
                        <div className="absolute top-2 right-2 p-1.5 rounded bg-black/80 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-8 bg-emerald-950/40 border-b border-emerald-500/20 px-3 flex items-center text-[10px] text-emerald-400">
                        drwxr-xr-x {proj.domain.toLowerCase()}
                      </div>
                    )}

                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="border border-emerald-500/40 px-1.5 py-0.5 rounded text-[10px]">
                          {proj.domain.replace("_", " ")}
                        </span>
                        <span className="text-emerald-400 font-bold">
                          {proj.progressPercentage}% COMPILED
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-emerald-200/70 leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-emerald-500/20 flex items-center justify-between mt-3 text-xs">
                    <span className="text-emerald-400/80">
                      RUNTIME: {proj.totalHoursLogged}h
                    </span>

                    <div className="flex gap-2">
                      {proj.repoUrl && (
                        <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer">
                          <button className="px-2.5 py-1 text-xs border border-emerald-500/40 hover:bg-emerald-500/20 rounded">
                            git repo
                          </button>
                        </a>
                      )}
                      {proj.liveDemoUrl && (
                        <a href={proj.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                          <button className="px-2.5 py-1 text-xs bg-emerald-500 text-black font-extrabold rounded hover:bg-emerald-400">
                            execute --run
                          </button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </ThreeDCard>
            ))}
          </div>
        </div>

        {/* Education Log */}
        {education && education.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 border-b border-emerald-500/30 pb-2">
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              $ cat /etc/education_credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded bg-[#07130b] border border-emerald-500/30 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-white">
                      {edu.degree || edu.type} {edu.branch ? `— ${edu.branch}` : ""}
                    </h4>
                    <p className="text-emerald-400/70">{edu.institution}</p>
                  </div>
                  {edu.cgpa && (
                    <span className="border border-emerald-500/40 px-2 py-0.5 rounded text-[11px] text-emerald-300">
                      CGPA {edu.cgpa}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] border-2 border-emerald-400 p-1 bg-black shadow-[0_0_30px_rgba(16,185,129,0.5)]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-emerald-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedImage}
              alt="Raw Preview"
              className="max-h-[85vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

