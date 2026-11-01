"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Cpu,
  Zap,
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
  Radio,
  Crosshair,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThreeDCard } from "@/components/ui/three-d-card";
import { PortfolioTemplateProps } from "./types";
import { getInitials } from "@/lib/utils";

export function CyberpunkTemplate({
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
    <div className="relative min-h-screen bg-[#07070d] text-cyan-50 font-sans overflow-x-hidden selection:bg-cyan-500/40">
      {/* 3D Perspective Holographic Cyber Grid Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        {/* Top scanline beam */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-80" />

        {/* 3D Floor Grid */}
        <div
          className="absolute -bottom-40 left-[-20%] right-[-20%] h-[600px] opacity-25"
          style={{
            transform: "perspective(450px) rotateX(65deg)",
            backgroundImage:
              "linear-gradient(to right, #00f0ff 1px, transparent 1px), linear-gradient(to bottom, #ff007f 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Cyber Neon Glow Cones */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-fuchsia-600/10 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Holographic Header Bar */}
        {!isDashboardPreview && (
          <nav className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.15)]">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                <Terminal className="h-4 w-4" />
              </div>
              <div className="font-mono">
                <span className="font-black text-sm tracking-widest text-cyan-400">
                  APIN://CYBER.SYS
                </span>
                <span className="text-[9px] text-fuchsia-400 block -mt-1 font-semibold">
                  STATUS: ONLINE
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {onShareClick && (
                <Button
                  size="sm"
                  onClick={onShareClick}
                  variant="outline"
                  className="bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 text-xs font-mono"
                >
                  <Share2 className="h-3.5 w-3.5 mr-1" />
                  BROADCAST
                </Button>
              )}
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-black font-extrabold text-xs font-mono shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  <Zap className="h-3.5 w-3.5 mr-1 text-black" />
                  INITIATE
                </Button>
              </Link>
            </div>
          </nav>
        )}

        {/* 3D Cyber Card Hero */}
        <ThreeDCard maxTilt={7} depth={22} glare={true}>
          <div className="relative rounded-2xl overflow-hidden bg-slate-950/90 border border-cyan-500/40 shadow-[0_0_35px_rgba(0,240,255,0.15)] group">
            {/* Corner Tech Brackets */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-500/60 select-none">
              ┌[TELEMETRY_ONLINE]
            </div>
            <div className="absolute top-2 right-2 text-[10px] font-mono text-fuchsia-500/60 select-none">
              [SEC_LEVEL_01]┐
            </div>

            {/* Custom Banner */}
            {bannerUrl && (
              <div className="relative h-48 sm:h-60 w-full overflow-hidden border-b border-cyan-500/30">
                <img
                  src={bannerUrl}
                  alt="Cyberpunk Theme Banner"
                  className="w-full h-full object-cover filter contrast-110 saturate-125"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950" />
                <div className="absolute top-3 right-4 px-2 py-0.5 rounded bg-black/70 border border-cyan-400/50 text-[10px] font-mono text-cyan-300">
                  GRID_OVERLAY::ACTIVE
                </div>
              </div>
            )}

            <div className="p-6 sm:p-10 relative pt-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Cyber Avatar with Hologram Frame */}
                  {user.profilePhotoUrl ? (
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 opacity-75 blur-sm animate-pulse" />
                      <img
                        src={user.profilePhotoUrl}
                        alt={user.name}
                        className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover border-2 border-cyan-300 bg-black"
                      />
                      <div className="absolute bottom-0 right-0 bg-fuchsia-500 text-black font-mono font-black text-[9px] px-1 rounded">
                        LVL.99
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-3xl font-black font-mono text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                      {getInitials(user.name)}
                    </div>
                  )}

                  <div className="space-y-1.5 font-mono">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400">
                        {user.name}
                      </h1>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/60 rounded">
                        [VERIFIED_NEURAL_IQ]
                      </span>
                    </div>

                    <p className="text-cyan-200/80 text-xs sm:text-sm font-semibold max-w-xl">
                      &gt; {user.headline || "CYBER_ARCHITECT & DECENTRALIZED ENGINEER"}
                    </p>

                    {(user.city || user.country) && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-fuchsia-400" />
                        NODE://{[user.city, user.country].filter(Boolean).join(".")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Social Visor Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {socialMap.github && (
                    <a
                      href={socialMap.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 text-xs transition-all hover:scale-105"
                      title="GitHub Matrix"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {socialMap.linkedin && (
                    <a
                      href={socialMap.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-fuchsia-950/50 border border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-500/20 text-xs transition-all hover:scale-105"
                      title="LinkedIn Feed"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {user.email && (
                    <a
                      href={`mailto:${user.email}?subject=ENCRYPTED_COMMS_VIA_APIN`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs font-mono shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all hover:scale-105"
                    >
                      <Radio className="h-3.5 w-3.5" />
                      PULSE SIGNAL
                    </a>
                  )}
                  {onShareClick && (
                    <Button
                      size="sm"
                      onClick={onShareClick}
                      variant="outline"
                      className="bg-black/60 border-cyan-500/40 text-cyan-300 text-xs rounded-lg font-mono"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {user.about && (
                <div className="mt-6 pt-6 border-t border-cyan-500/20 font-mono text-xs text-cyan-100/70 leading-relaxed max-w-3xl">
                  <span className="text-fuchsia-400 mr-2">root@telemetry:~$</span>
                  {user.about}
                </div>
              )}
            </div>
          </div>
        </ThreeDCard>

        {/* 3D Skills Hex Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono">
            <h2 className="text-base sm:text-lg font-black text-cyan-400 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-fuchsia-400" />
              CYBER_CAPABILITIES // VERIFIED_SKILLS ({skills.length})
            </h2>
            <span className="text-[11px] text-fuchsia-400">
              SYS_TELEMETRY: VALIDATED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {skills.map((item, idx) => (
              <ThreeDCard key={idx} maxTilt={12} depth={15} glare={true}>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 hover:border-fuchsia-400/80 transition-all space-y-2 h-full flex flex-col justify-between font-mono hover:shadow-[0_0_15px_rgba(255,0,127,0.2)]">
                  <div>
                    <span className="text-[9px] text-cyan-400/70 block uppercase">
                      {item.skill.category?.name || "MODULE"}
                    </span>
                    <p className="font-bold text-xs text-white mt-0.5">{item.skill.name}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-cyan-500/20 text-[11px]">
                    <span className="font-black text-cyan-300">
                      SCORE: {item.overallScore || item.assessmentScore || 85}%
                    </span>
                    <Crosshair className="h-3 w-3 text-fuchsia-400" />
                  </div>
                </div>
              </ThreeDCard>
            ))}
          </div>
        </div>

        {/* 3D Capstones in Cyber HUD frames */}
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono">
            <h2 className="text-base sm:text-lg font-black text-cyan-400 flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-cyan-400" />
              ENGINEERED_SYSTEMS // DEPLOYMENTS ({projects.length})
            </h2>
            <span className="text-[11px] text-cyan-500">LIVE_ARTIFACTS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <ThreeDCard key={proj.id} maxTilt={7} depth={18} glare={true}>
                <div className="rounded-2xl bg-slate-950 border border-cyan-500/40 hover:border-fuchsia-500/70 transition-all overflow-hidden flex flex-col justify-between h-full group shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(255,0,127,0.25)]">
                  <div>
                    {/* Project Screenshot with Neon Frame */}
                    {proj.imageUrl ? (
                      <div
                        className="relative h-44 sm:h-52 w-full overflow-hidden bg-black cursor-pointer border-b border-cyan-500/30"
                        onClick={() => setSelectedImage(proj.imageUrl!)}
                      >
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter saturate-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-cyan-300 text-[10px] font-mono border border-cyan-400/50">
                          ARTIFACT_PREVIEW
                        </div>
                        <div className="absolute top-2 right-2 p-1.5 rounded bg-black/80 text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-16 w-full bg-gradient-to-r from-cyan-950/60 to-fuchsia-950/60 border-b border-cyan-500/20" />
                    )}

                    <div className="p-6 space-y-3 font-mono">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                          {proj.domain.replace("_", " ")}
                        </span>
                        <span className="text-xs font-black text-fuchsia-400">
                          {proj.progressPercentage}% COMPILED
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-cyan-100/70 font-sans leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-cyan-500/20 flex items-center justify-between mt-4 font-mono">
                    <span className="text-[11px] text-cyan-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-fuchsia-400" />
                      {proj.totalHoursLogged}H_EXECUTION
                    </span>

                    <div className="flex gap-2">
                      {proj.repoUrl && (
                        <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs bg-slate-900 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 font-mono"
                          >
                            <Github className="h-3.5 w-3.5 mr-1" />
                            REPO
                          </Button>
                        </a>
                      )}
                      {proj.liveDemoUrl && (
                        <a href={proj.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-gradient-to-r from-cyan-400 to-fuchsia-600 hover:from-cyan-300 hover:to-fuchsia-500 text-black font-black font-mono shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            EXECUTE
                          </Button>
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
          <div className="space-y-4 font-mono">
            <h2 className="text-base sm:text-lg font-black text-cyan-400 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-fuchsia-400" />
              ACADEMIC_REGISTRY // PEDIGREE
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">
                      {edu.degree || edu.type} {edu.branch ? `— ${edu.branch}` : ""}
                    </h4>
                    <p className="text-xs text-cyan-300/60 font-sans">{edu.institution}</p>
                  </div>
                  {edu.cgpa && (
                    <Badge className="bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/50 text-xs">
                      CGPA {edu.cgpa}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.5)]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded bg-black/80 text-cyan-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedImage}
              alt="Cyber Preview"
              className="max-h-[85vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

