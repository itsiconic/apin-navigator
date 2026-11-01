"use client";

import React, { useState, useEffect } from "react";
import { PortfolioTemplateId, TEMPLATE_REGISTRY } from "@/lib/portfolio-types";
import { DynamicPortfolioRenderer } from "@/components/portfolio/templates";
import { ShareModal } from "@/components/portfolio/ShareModal";
import { Sparkles, Palette, Share2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicPortfolioClientProps {
  initialTemplate: PortfolioTemplateId;
  user: {
    username: string;
    email?: string | null;
    name: string;
    headline: string;
    about: string;
    city?: string | null;
    country?: string | null;
    profilePhotoUrl?: string | null;
    socialProfiles?: { platform: string; url: string }[];
  };
  bannerUrl?: string | null;
  skills: {
    id?: string;
    skill: {
      name: string;
      category?: { name: string };
    };
    overallScore?: number | null;
    assessmentScore?: number | null;
    selfRating?: number | null;
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    domain: string;
    projectType?: string;
    progressPercentage: number;
    totalHoursLogged: number;
    repoUrl?: string | null;
    liveDemoUrl?: string | null;
    status?: string;
    imageUrl?: string | null;
  }[];
  education: {
    id: string;
    institution: string;
    degree?: string | null;
    branch?: string | null;
    type?: string;
    cgpa?: number | null;
    isCurrent?: boolean;
  }[];
}

export function PublicPortfolioClient({
  initialTemplate,
  user,
  bannerUrl,
  skills,
  projects,
  education,
}: PublicPortfolioClientProps) {
  const [currentTemplate, setCurrentTemplate] = useState<PortfolioTemplateId>(initialTemplate);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Sync with URL query param if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTemplate = params.get("template") as PortfolioTemplateId;
      if (urlTemplate && TEMPLATE_REGISTRY[urlTemplate]) {
        setCurrentTemplate(urlTemplate);
      }
    }
  }, []);

  const templates = Object.values(TEMPLATE_REGISTRY);

  return (
    <div className="relative">
      {/* Active 3D Template Render */}
      <DynamicPortfolioRenderer
        template={currentTemplate}
        user={user}
        bannerUrl={bannerUrl}
        skills={skills}
        projects={projects}
        education={education}
        isDashboardPreview={false}
        onShareClick={() => setIsShareOpen(true)}
      />

      {/* Floating 3D Theme Switcher Pill (Fixed Bottom Right for Showcase Visitors) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {showThemePicker && (
          <div className="p-3 bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-2xl space-y-2 mb-2 animate-scale-in w-64 text-white">
            <div className="flex items-center justify-between text-xs font-bold border-b border-white/10 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-accent-400" />
                Switch 3D Theme
              </span>
              <button
                onClick={() => setShowThemePicker(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setCurrentTemplate(tpl.id);
                    setShowThemePicker(false);
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                    currentTemplate === tpl.id
                      ? "bg-accent-500 text-slate-950 font-bold"
                      : "hover:bg-white/10 text-slate-200"
                  }`}
                >
                  <span className="truncate">{tpl.name}</span>
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: tpl.accentHex }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-full border border-white/20 backdrop-blur-xl shadow-2xl">
          <Button
            size="sm"
            onClick={() => setShowThemePicker(!showThemePicker)}
            variant="ghost"
            className="text-white hover:text-accent-300 hover:bg-white/10 text-xs font-semibold gap-1.5 rounded-full h-8 px-3"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-400" />
            <span>Theme: {TEMPLATE_REGISTRY[currentTemplate]?.name || currentTemplate}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsShareOpen(true)}
            variant="marigold"
            className="h-8 px-3 text-xs font-bold rounded-full gap-1 shadow-md"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        username={user.username}
        fullName={user.name}
        headline={user.headline}
      />
    </div>
  );
}

