"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  FolderKanban,
  GraduationCap,
  Share2,
  Layers,
  ArrowUpRight,
  Maximize2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThreeDCard } from "@/components/ui/three-d-card";
import { PortfolioTemplateProps } from "./types";
import { getInitials } from "@/lib/utils";

export function AuroraTemplate({
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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-purple-500/30">
      {/* 3D Liquid Aurora Ambient Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-purple-600/25 via-indigo-600/20 to-transparent blur-[140px] animate-pulse" />
        <div className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-teal-500/20 via-emerald-600/15 to-transparent blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-pink-500/20 via-purple-700/15 to-transparent blur-[160px]" />
        {/* Subtle grid mesh */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Top Floating Glass Navigation (Public Mode) */}
        {!isDashboardPreview && (
          <nav className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-2xl">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  AP<span className="text-purple-400">IN</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-1 font-medium">
                  Verified Candidate
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {onShareClick && (
                <Button
                  size="sm"
                  onClick={onShareClick}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white gap-1.5 text-xs rounded-xl"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share Showcase
                </Button>
              )}
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30"
                >
                  Join APIN
                  <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </nav>
        )}

        {/* 3D Hero Glass Card */}
        <ThreeDCard maxTilt={6} depth={20} glare={true}>
          <div className="relative rounded-3xl overflow-hidden bg-white/[0.04] backdrop-blur-2xl border border-white/15 shadow-2xl transition-all duration-300 hover:border-purple-400/40">
            {/* Custom Banner if set */}
            {bannerUrl && (
              <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                <img
                  src={bannerUrl}
                  alt="Portfolio Cover Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950" />
              </div>
            )}

            <div className="p-6 sm:p-10 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* 3D Glass Avatar */}
                  {user.profilePhotoUrl ? (
                    <div className="relative group">
                      <img
                        src={user.profilePhotoUrl}
                        alt={user.name}
                        className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-2 border-purple-400/50 shadow-2xl shadow-purple-500/20"
                      />
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-white text-[9px] font-bold">
                        ✓
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 border-2 border-purple-400/50 shadow-2xl shadow-purple-500/20 flex items-center justify-center text-3xl font-extrabold text-white">
                      {getInitials(user.name)}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                        {user.name}
                      </h1>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/40 text-xs gap-1 font-semibold backdrop-blur-md">
                        <Sparkles className="h-3 w-3 text-purple-400" />
                        Prismatic Aurora
                      </Badge>
                    </div>

                    <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl">
                      {user.headline || "Full-Stack Engineer & Distributed Systems Builder"}
                    </p>

                    {(user.city || user.country) && (
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-purple-400" />
                        {[user.city, user.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions & Socials */}
                <div className="flex flex-wrap items-center gap-2">
                  {socialMap.github && (
                    <a
                      href={socialMap.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 text-xs transition-all hover:scale-105"
                      title="GitHub Profile"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {socialMap.linkedin && (
                    <a
                      href={socialMap.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs transition-all hover:scale-105"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {user.email && (
                    <a
                      href={`mailto:${user.email}?subject=Opportunity%20via%20APIN`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Contact Me
                    </a>
                  )}
                  {onShareClick && (
                    <Button
                      size="sm"
                      onClick={onShareClick}
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs rounded-xl"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {user.about && (
                <div className="mt-6 pt-6 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {user.about}
                </div>
              )}
            </div>
          </div>
        </ThreeDCard>

        {/* 3D Verified Engineering Skills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-400" />
              Exam-Verified Skills &amp; Intelligence Score
            </h2>
            <span className="text-xs text-purple-300/80 font-mono">
              {skills.length} Validated Credentials
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {skills.map((item, idx) => (
              <ThreeDCard key={idx} maxTilt={10} depth={12} glare={true}>
                <div className="p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-purple-400/50 transition-all space-y-2 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                      {item.skill.category?.name || "Engineering"}
                    </span>
                    <p className="font-bold text-sm text-white mt-0.5">{item.skill.name}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-xs font-semibold text-purple-400">
                      IQ {item.overallScore || item.assessmentScore || 80}%
                    </span>
                    {item.assessmentScore !== null && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </ThreeDCard>
            ))}
          </div>
        </div>

        {/* 3D Capstone Projects with Screenshots */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-purple-400" />
              Featured Capstone Builds &amp; SIH Projects
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {projects.length} Published
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <ThreeDCard key={proj.id} maxTilt={6} depth={15} glare={true}>
                <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 hover:border-purple-400/50 transition-all overflow-hidden flex flex-col justify-between h-full group">
                  <div>
                    {/* Project Image Preview if available */}
                    {proj.imageUrl ? (
                      <div
                        className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900 cursor-pointer"
                        onClick={() => setSelectedImage(proj.imageUrl!)}
                      >
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-16 w-full bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-slate-900/30 border-b border-white/5" />
                    )}

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-[11px]">
                          {proj.domain.replace("_", " ")}
                        </Badge>
                        <span className="text-xs font-semibold text-emerald-400">
                          {proj.progressPercentage}% Completed
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="h-3.5 w-3.5 text-purple-400" />
                      {proj.totalHoursLogged}h execution
                    </span>

                    <div className="flex gap-2">
                      {proj.repoUrl && (
                        <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs bg-white/5 hover:bg-white/15 text-slate-200 border-white/10 rounded-xl"
                          >
                            <Github className="h-3.5 w-3.5 mr-1" />
                            Code
                          </Button>
                        </a>
                      )}
                      {proj.liveDemoUrl && (
                        <a href={proj.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            Demo
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

        {/* Academic Pedigree */}
        {education && education.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-400" />
              Academic Pedigree &amp; Qualifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">
                      {edu.degree || edu.type} {edu.branch ? `— ${edu.branch}` : ""}
                    </h4>
                    <p className="text-xs text-slate-400">{edu.institution}</p>
                  </div>
                  {edu.cgpa && (
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs font-mono">
                      CGPA {edu.cgpa}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-white/20 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selectedImage}
              alt="Project Screenshot Enlarged"
              className="max-h-[85vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

