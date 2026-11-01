"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowUpRight,
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
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThreeDCard } from "@/components/ui/three-d-card";
import { PortfolioTemplateProps } from "./types";
import { getInitials } from "@/lib/utils";

export function MinimalChicTemplate({
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
    <div className="relative min-h-screen bg-[#fcfbf9] text-[#121212] font-sans overflow-x-hidden selection:bg-neutral-900 selection:text-white">
      {/* Architectural Isometric Grid lines */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Minimalist Editorial Navigation */}
        {!isDashboardPreview && (
          <nav className="flex items-center justify-between py-4 border-b-2 border-black">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tighter uppercase">
                APIN <span className="font-light italic text-neutral-500">Edition</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {onShareClick && (
                <button
                  onClick={onShareClick}
                  className="text-xs font-bold uppercase tracking-widest border border-black px-3.5 py-1.5 hover:bg-black hover:text-white transition-colors"
                >
                  Share Link
                </button>
              )}
              <Link href="/signup">
                <button className="text-xs font-bold uppercase tracking-widest bg-black text-white px-4 py-1.5 hover:bg-neutral-800 transition-colors">
                  Get Portfolio
                </button>
              </Link>
            </div>
          </nav>
        )}

        {/* 3D Editorial Hero with Isometric Shadows */}
        <ThreeDCard maxTilt={5} depth={18} glare={false}>
          <div className="bg-white border-2 border-black shadow-[10px_10px_0px_#121212] p-8 sm:p-12 transition-all duration-300">
            {bannerUrl && (
              <div className="relative h-48 sm:h-64 w-full mb-8 border border-black overflow-hidden">
                <img
                  src={bannerUrl}
                  alt="Portfolio Banner"
                  className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                />
              </div>
            )}

            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-block border border-black px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest">
                  Verified Engineering Pedigree
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-[0.95]">
                  {user.name}
                </h1>

                <p className="text-base sm:text-lg font-serif italic text-neutral-700 leading-snug">
                  "{user.headline || "Architecting resilient distributed software systems."}"
                </p>

                {(user.city || user.country) && (
                  <p className="text-xs font-mono text-neutral-500 flex items-center gap-1.5 uppercase">
                    <MapPin className="h-3 w-3" />
                    {[user.city, user.country].filter(Boolean).join(" / ")}
                  </p>
                )}

                {user.about && (
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-4 border-t border-neutral-200">
                    {user.about}
                  </p>
                )}
              </div>

              {/* Avatar + Quick Contact Box */}
              <div className="flex flex-col items-center sm:items-end gap-5 shrink-0">
                {user.profilePhotoUrl ? (
                  <div className="border-2 border-black shadow-[6px_6px_0px_#121212] overflow-hidden">
                    <img
                      src={user.profilePhotoUrl}
                      alt={user.name}
                      className="h-28 w-28 sm:h-36 sm:w-36 object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-28 w-28 sm:h-36 sm:w-36 border-2 border-black bg-neutral-100 flex items-center justify-center text-3xl font-black shadow-[6px_6px_0px_#121212]">
                    {getInitials(user.name)}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {socialMap.github && (
                    <a
                      href={socialMap.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
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
                      className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {user.email && (
                    <a
                      href={`mailto:${user.email}?subject=Inquiry`}
                      className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                    >
                      Inquire
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ThreeDCard>

        {/* 3D Standardized Skills Matrix */}
        <div className="space-y-4">
          <div className="flex items-end justify-between border-b-2 border-black pb-2">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              01 / Core Competencies
            </h2>
            <span className="text-xs font-mono text-neutral-500 uppercase">
              {skills.length} Standardized Scores
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {skills.map((item, idx) => (
              <ThreeDCard key={idx} maxTilt={8} depth={10} glare={false}>
                <div className="p-4 bg-white border border-black shadow-[5px_5px_0px_#121212] space-y-2 h-full flex flex-col justify-between hover:shadow-[7px_7px_0px_#121212] transition-shadow">
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                      {item.skill.category?.name || "Skill"}
                    </span>
                    <h3 className="font-bold text-sm uppercase tracking-tight text-neutral-900 mt-0.5">
                      {item.skill.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-xs font-mono">
                    <span className="font-black">
                      IQ {item.overallScore || item.assessmentScore || 80}%
                    </span>
                    {item.assessmentScore !== null && (
                      <span className="text-[10px] uppercase font-bold text-neutral-600">
                        [VERIFIED]
                      </span>
                    )}
                  </div>
                </div>
              </ThreeDCard>
            ))}
          </div>
        </div>

        {/* 3D Capstones with Monochrome Image Reveals */}
        <div className="space-y-4">
          <div className="flex items-end justify-between border-b-2 border-black pb-2">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              02 / Engineered Works
            </h2>
            <span className="text-xs font-mono text-neutral-500 uppercase">
              {projects.length} Published Capstones
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj) => (
              <ThreeDCard key={proj.id} maxTilt={6} depth={14} glare={false}>
                <div className="bg-white border-2 border-black shadow-[8px_8px_0px_#121212] flex flex-col justify-between h-full group hover:shadow-[12px_12px_0px_#121212] transition-all">
                  <div>
                    {proj.imageUrl ? (
                      <div
                        className="relative h-48 w-full border-b-2 border-black overflow-hidden cursor-pointer"
                        onClick={() => setSelectedImage(proj.imageUrl!)}
                      >
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 p-1.5 bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-4 bg-neutral-900 border-b-2 border-black" />
                    )}

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="border border-black px-2 py-0.5 uppercase tracking-wider">
                          {proj.domain.replace("_", " ")}
                        </span>
                        <span className="font-bold">
                          {proj.progressPercentage}% COMPLETE
                        </span>
                      </div>

                      <h3 className="text-xl font-black uppercase tracking-tight group-hover:italic transition-all">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-neutral-200 flex items-center justify-between mt-4">
                    <span className="text-xs font-mono text-neutral-500">
                      {proj.totalHoursLogged} HOURS LOGGED
                    </span>

                    <div className="flex gap-2">
                      {proj.repoUrl && (
                        <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer">
                          <button className="px-3 py-1 text-xs font-bold uppercase border border-black hover:bg-black hover:text-white transition-colors">
                            Code
                          </button>
                        </a>
                      )}
                      {proj.liveDemoUrl && (
                        <a href={proj.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                          <button className="px-3 py-1 text-xs font-bold uppercase bg-black text-white hover:bg-neutral-800 transition-colors flex items-center gap-1">
                            Demo <ArrowUpRight className="h-3 w-3" />
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

        {/* Education Timeline */}
        {education && education.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-end justify-between border-b-2 border-black pb-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                03 / Academic Pedigree
              </h2>
            </div>

            <div className="space-y-3">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-5 bg-white border border-black shadow-[4px_4px_0px_#121212] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold uppercase text-sm">
                      {edu.degree || edu.type} {edu.branch ? `— ${edu.branch}` : ""}
                    </h4>
                    <p className="text-xs font-serif italic text-neutral-600">
                      {edu.institution}
                    </p>
                  </div>
                  {edu.cgpa && (
                    <span className="text-xs font-mono font-bold border border-black px-2 py-0.5">
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
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white border-4 border-black p-2 shadow-[15px_15px_0px_#000]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white font-mono uppercase text-sm"
            >
              [CLOSE]
            </button>
            <img
              src={selectedImage}
              alt="Enlarged"
              className="max-h-[80vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

