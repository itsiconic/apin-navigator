"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Crown,
  ShieldCheck,
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
  Star,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThreeDCard } from "@/components/ui/three-d-card";
import { PortfolioTemplateProps } from "./types";
import { getInitials } from "@/lib/utils";

export function ExecutiveTemplate({
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
    <div className="relative min-h-screen bg-[#080706] text-[#f7f4ea] font-serif overflow-x-hidden selection:bg-amber-500/30">
      {/* Drifting Gold Stardust & Ambient Warm Backlight */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[150px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-yellow-700/10 blur-[180px]" />
        {/* Subtle executive gold mesh */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#f59e0b 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-sans">
        {/* Executive Gold Trim Header */}
        {!isDashboardPreview && (
          <nav className="flex items-center justify-between p-4 rounded-2xl bg-[#121110]/90 border border-amber-500/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 flex items-center justify-center text-black shadow-md shadow-amber-500/30">
                <Crown className="h-4 w-4 text-black" />
              </div>
              <div>
                <span className="font-serif font-bold text-base tracking-wide text-amber-200">
                  APIN <span className="text-amber-500 font-sans text-xs uppercase tracking-widest font-extrabold ml-1">Executive</span>
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {onShareClick && (
                <Button
                  size="sm"
                  onClick={onShareClick}
                  variant="outline"
                  className="bg-[#1a1714] border-amber-500/40 text-amber-200 hover:bg-amber-500/20 text-xs rounded-xl"
                >
                  <Share2 className="h-3.5 w-3.5 mr-1" />
                  Share Portfolio
                </Button>
              )}
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-600/30"
                >
                  Executive Portal
                </Button>
              </Link>
            </div>
          </nav>
        )}

        {/* 3D Brushed Gold Hero Card */}
        <ThreeDCard maxTilt={5} depth={20} glare={true}>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#181614] via-[#121110] to-[#0c0b0a] border-2 border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.1)]">
            {/* Top gold metallic hairline */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

            {bannerUrl && (
              <div className="relative h-48 sm:h-64 w-full overflow-hidden border-b border-amber-500/30">
                <img
                  src={bannerUrl}
                  alt="Executive Cover"
                  className="w-full h-full object-cover filter brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0b0a]/70 to-[#0c0b0a]" />
              </div>
            )}

            <div className="p-8 sm:p-12 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Gold-Rimmed Avatar */}
                  {user.profilePhotoUrl ? (
                    <div className="relative">
                      <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] bg-black">
                        <img
                          src={user.profilePhotoUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-black shadow-md">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl bg-gradient-to-br from-amber-950 to-neutral-900 border-2 border-amber-400 flex items-center justify-center text-3xl font-serif font-black text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                      {getInitials(user.name)}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100 tracking-tight">
                        {user.name}
                      </h1>
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/40 text-xs font-serif font-semibold">
                        <Crown className="h-3 w-3 mr-1 text-amber-400" />
                        Executive Fellow
                      </Badge>
                    </div>

                    <p className="text-amber-200/80 text-sm sm:text-base font-serif italic max-w-xl">
                      {user.headline || "Principal Systems Architect & Technical Director"}
                    </p>

                    {(user.city || user.country) && (
                      <p className="text-xs text-neutral-400 flex items-center gap-1.5 font-sans">
                        <MapPin className="h-3.5 w-3.5 text-amber-500" />
                        {[user.city, user.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Direct Executive Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {socialMap.github && (
                    <a
                      href={socialMap.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#1f1c18] border border-amber-500/30 text-amber-200 hover:border-amber-400 text-xs transition-all hover:scale-105"
                      title="GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {socialMap.linkedin && (
                    <a
                      href={socialMap.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#1f1c18] border border-amber-500/30 text-amber-200 hover:border-amber-400 text-xs transition-all hover:scale-105"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {user.email && (
                    <a
                      href={`mailto:${user.email}?subject=Executive%20Inquiry`}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-xs shadow-lg shadow-amber-600/30 transition-all hover:scale-105 font-sans"
                    >
                      <Mail className="h-4 w-4" />
                      Contact Executive
                    </a>
                  )}
                  {onShareClick && (
                    <Button
                      size="sm"
                      onClick={onShareClick}
                      variant="outline"
                      className="bg-[#1f1c18] border-amber-500/40 text-amber-200 rounded-xl"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {user.about && (
                <div className="mt-8 pt-6 border-t border-amber-500/20 text-xs sm:text-sm text-neutral-300 font-serif leading-relaxed max-w-3xl">
                  {user.about}
                </div>
              )}
            </div>
          </div>
        </ThreeDCard>

        {/* 3D Skills Badges */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
            <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Verified Competencies &amp; Technical Standing
            </h2>
            <span className="text-xs text-amber-400 font-sans">
              {skills.length} Evaluated Metrics
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {skills.map((item, idx) => (
              <ThreeDCard key={idx} maxTilt={8} depth={12} glare={true}>
                <div className="p-4 rounded-xl bg-[#141210] border border-amber-500/30 hover:border-amber-400 transition-all space-y-2 h-full flex flex-col justify-between shadow-md">
                  <div>
                    <span className="text-[10px] font-sans text-neutral-400 block uppercase tracking-wider">
                      {item.skill.category?.name || "Discipline"}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-amber-100 mt-0.5">
                      {item.skill.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-amber-500/20 text-xs font-sans">
                    <span className="font-extrabold text-amber-400">
                      IQ {item.overallScore || item.assessmentScore || 85}%
                    </span>
                    {item.assessmentScore !== null && (
                      <span className="text-[10px] text-amber-300 flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        Honor
                      </span>
                    )}
                  </div>
                </div>
              </ThreeDCard>
            ))}
          </div>
        </div>

        {/* 3D Capstones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
            <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-amber-500" />
              Flagship Capstones &amp; Enterprise Architectures
            </h2>
            <span className="text-xs text-amber-400 font-sans">
              {projects.length} Showcased
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <ThreeDCard key={proj.id} maxTilt={6} depth={15} glare={true}>
                <div className="rounded-2xl bg-[#131110] border border-amber-500/40 hover:border-amber-400 transition-all overflow-hidden flex flex-col justify-between h-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
                  <div>
                    {proj.imageUrl ? (
                      <div
                        className="relative h-44 sm:h-52 w-full overflow-hidden bg-black cursor-pointer border-b border-amber-500/30"
                        onClick={() => setSelectedImage(proj.imageUrl!)}
                      >
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#131110] via-transparent to-transparent" />
                        <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-10 w-full bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-black border-b border-amber-500/20" />
                    )}

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/40 text-xs">
                          {proj.domain.replace("_", " ")}
                        </Badge>
                        <span className="text-xs font-semibold text-amber-400 font-sans">
                          {proj.progressPercentage}% Milestone
                        </span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-neutral-300 font-serif leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-amber-500/20 flex items-center justify-between mt-4 font-sans">
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      {proj.totalHoursLogged}h logged
                    </span>

                    <div className="flex gap-2">
                      {proj.repoUrl && (
                        <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs bg-[#1a1714] border-amber-500/30 text-amber-200 hover:border-amber-400 rounded-lg"
                          >
                            <Github className="h-3.5 w-3.5 mr-1" />
                            Source
                          </Button>
                        </a>
                      )}
                      {proj.liveDemoUrl && (
                        <a href={proj.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold rounded-lg shadow-md"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            Live System
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

        {/* Education */}
        {education && education.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2 border-b border-amber-500/30 pb-3">
              <GraduationCap className="h-5 w-5 text-amber-500" />
              Academic Pedigree &amp; Distinctions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-5 rounded-xl bg-[#141210] border border-amber-500/30 flex items-start justify-between gap-3 shadow-md"
                >
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-amber-100 text-sm">
                      {edu.degree || edu.type} {edu.branch ? `— ${edu.branch}` : ""}
                    </h4>
                    <p className="text-xs text-neutral-400 font-serif italic">
                      {edu.institution}
                    </p>
                  </div>
                  {edu.cgpa && (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/40 text-xs font-sans">
                      CGPA {edu.cgpa}
                    </Badge>
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
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.3)]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/80 text-amber-300"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedImage}
              alt="Executive Preview"
              className="max-h-[85vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

