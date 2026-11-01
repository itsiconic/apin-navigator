"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  Sparkles,
  ExternalLink,
  Share2,
  Eye,
  Sliders,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThreeDCard } from "@/components/ui/three-d-card";
import { api } from "@/lib/api-client";
import { PortfolioTemplateId } from "@/lib/portfolio-types";
import { TemplateSwitcher } from "@/components/portfolio/TemplateSwitcher";
import { PortfolioMediaUploader } from "@/components/portfolio/PortfolioMediaUploader";
import { ShareModal } from "@/components/portfolio/ShareModal";
import { DynamicPortfolioRenderer } from "@/components/portfolio/templates";

interface PortfolioResponse {
  user: {
    id: string;
    username: string;
    email: string | null;
    profile: {
      firstName: string | null;
      lastName: string | null;
      preferredName: string | null;
      profilePhotoUrl: string | null;
      headline: string | null;
      about: string | null;
      city: string | null;
      country: string | null;
    } | null;
    socialProfiles: { platform: string; url: string }[];
    education: {
      id: string;
      institution: string;
      degree: string | null;
      branch: string | null;
      type: string;
      cgpa: number | null;
    }[];
  };
  skills: {
    id?: string;
    skill: { name: string; category?: { name: string } };
    overallScore: number | null;
    assessmentScore: number | null;
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
    imageUrl?: string | null;
  }[];
  portfolioConfig: {
    template: PortfolioTemplateId;
    bannerUrl?: string | null;
    projectImages?: Record<string, string>;
  };
}

export default function PortfolioPage() {
  const [loading, setLoading] = useState(true);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<PortfolioTemplateId>("AURORA");
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [projectImages, setProjectImages] = useState<Record<string, string>>({});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"customize" | "preview">("customize");

  const loadPortfolioData = async () => {
    try {
      let loaded = false;
      try {
        const res = await api.get<PortfolioResponse>("/api/portfolio");
        if (res && res.user) {
          setData(res);
          if (res.portfolioConfig) {
            setActiveTemplate(res.portfolioConfig.template || "AURORA");
            setBannerUrl(res.portfolioConfig.bannerUrl || null);
            setProjectImages(res.portfolioConfig.projectImages || {});
          }
          loaded = true;
        }
      } catch {
        // Fallback to separate endpoints
      }

      if (!loaded) {
        const [me, skills, projects] = await Promise.all([
          api.get<any>("/api/auth/me").catch(() => null),
          api.get<any[]>("/api/skills?scope=me").catch(() => []),
          api.get<any[]>("/api/projects").catch(() => []),
        ]);

        if (me) {
          setData({
            user: me,
            skills: skills || [],
            projects: projects || [],
            portfolioConfig: { template: "AURORA" },
          });
        } else {
          // Fallback default state
          setData({
            user: {
              id: "user-default",
              username: "candidate",
              email: null,
              profile: null,
              socialProfiles: [],
              education: [],
            },
            skills: [],
            projects: [],
            portfolioConfig: { template: "AURORA" },
          });
        }
      }
    } catch {
      toast.error("Loaded portfolio studio in offline mode");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const handleSelectTemplate = async (templateId: PortfolioTemplateId) => {
    setActiveTemplate(templateId);
    setSavingTemplate(true);
    try {
      await api.post("/api/portfolio", { template: templateId });
      toast.success(`Theme switched to ${templateId.replace("_", " ")}!`);
    } catch {
      toast.error("Failed to save theme selection");
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleBannerUpdated = (newUrl: string | null) => {
    setBannerUrl(newUrl);
  };

  const handleProjectImageUpdated = (projectId: string, newUrl: string | null) => {
    setProjectImages((prev) => {
      const updated = { ...prev };
      if (newUrl) {
        updated[projectId] = newUrl;
      } else {
        delete updated[projectId];
      }
      return updated;
    });
  };

  const username = data?.user?.username || "";
  const showcasePath = username ? `/p/${username}` : "/p/preview";

  const displayName =
    data?.user.profile?.preferredName ||
    (data?.user.profile?.firstName
      ? `${data.user.profile.firstName} ${data.user.profile.lastName || ""}`.trim()
      : data?.user.username) ||
    "Software Engineer";

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        <p className="text-xs text-surface-500 font-medium">Loading 3D Portfolio Studio...</p>
      </div>
    );
  }

  // Prepared data for dynamic renderer
  const templateUser = {
    username: username || "candidate",
    email: data?.user.email || null,
    name: displayName,
    headline: data?.user.profile?.headline || "Full-Stack Engineer & Distributed Systems Builder",
    about: data?.user.profile?.about || "",
    city: data?.user.profile?.city || null,
    country: data?.user.profile?.country || null,
    profilePhotoUrl: data?.user.profile?.profilePhotoUrl || null,
    socialProfiles: data?.user.socialProfiles || [],
  };

  const templateProjects = (data?.projects || []).map((p) => ({
    ...p,
    imageUrl: projectImages[p.id] || p.imageUrl || null,
  }));

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">
      {/* Hero Control Banner */}
      <ThreeDCard maxTilt={4} depth={15} glare={true}>
        <Card className="card-interactive bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 text-white border border-primary-700/60 shadow-xl overflow-hidden">
          <CardContent className="p-6 sm:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-500/20 text-accent-300 border border-accent-400/30">
                  <Sparkles className="h-3 w-3 text-accent-400" />
                  <span>3D Recruiter Portfolio Studio • APIN</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {displayName}
                </h1>
                <p className="text-surface-200 text-xs sm:text-sm max-w-xl font-medium">
                  {data?.user.profile?.headline || "Full-Stack Engineer & Distributed Systems Builder"}
                </p>
                <div className="flex items-center gap-3 text-xs text-surface-300">
                  <span className="flex items-center gap-1 font-mono">
                    <Globe className="h-3.5 w-3.5 text-accent-400" />
                    {showcasePath}
                  </span>
                  <span>•</span>
                  <Badge variant="outline" className="border-accent-400/40 text-accent-300 text-[10px] py-0 px-1.5">
                    Theme: {activeTemplate.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons: Public Showcase & Share */}
              <div className="flex flex-wrap items-center gap-2.5 relative z-20">
                {/* 1. Public Showcase: Native unblockable anchor */}
                <a
                  href={showcasePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center cursor-pointer"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 gap-1.5 text-xs font-semibold button-3d pointer-events-auto"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Public Showcase
                  </Button>
                </a>

                {/* 2. Share Portfolio Button */}
                <Button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  variant="marigold"
                  className="gap-2 font-bold shadow-md text-xs button-3d cursor-pointer pointer-events-auto"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share Portfolio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </ThreeDCard>

      {/* View Switcher: Customize vs Live 3D Preview */}
      <div className="flex items-center justify-between border-b border-surface-200 pb-3">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeTab === "customize" ? "default" : "outline"}
            onClick={() => setActiveTab("customize")}
            className="text-xs font-bold gap-1.5 rounded-xl cursor-pointer"
          >
            <Sliders className="h-3.5 w-3.5" />
            Theme &amp; Media Studio
          </Button>

          <Button
            size="sm"
            variant={activeTab === "preview" ? "default" : "outline"}
            onClick={() => setActiveTab("preview")}
            className="text-xs font-bold gap-1.5 rounded-xl cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            Live 3D Preview
          </Button>
        </div>

        {/* 3. Open Standalone URL Link */}
        <a
          href={showcasePath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1 hover:underline cursor-pointer"
        >
          Open standalone URL <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>

      {/* Main Tabs */}
      {activeTab === "customize" ? (
        <div className="space-y-10">
          {/* Section 1: 5-Template Selector */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-xs space-y-4">
            <TemplateSwitcher
              activeTemplate={activeTemplate}
              onSelectTemplate={handleSelectTemplate}
              isSaving={savingTemplate}
            />
          </div>

          {/* Section 2: Portfolio Media & Cover Photo Uploader */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-xs space-y-4">
            <PortfolioMediaUploader
              bannerUrl={bannerUrl}
              projectImages={projectImages}
              projects={data?.projects || []}
              onBannerUpdated={handleBannerUpdated}
              onProjectImageUpdated={handleProjectImageUpdated}
            />
          </div>

          {/* Quick Real-Time Preview Container */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-surface-900 flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary-600" />
                Live Embedded Preview ({activeTemplate.replace("_", " ")})
              </h3>
              <span className="text-[11px] text-surface-500">
                Interactive 3D preview rendered below
              </span>
            </div>

            <div className="rounded-3xl overflow-hidden border border-surface-300 shadow-xl max-h-[700px] overflow-y-auto">
              <DynamicPortfolioRenderer
                template={activeTemplate}
                user={templateUser}
                bannerUrl={bannerUrl}
                skills={data?.skills || []}
                projects={templateProjects}
                education={data?.user.education || []}
                isDashboardPreview={true}
                onShareClick={() => setIsShareModalOpen(true)}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Full Live 3D Preview Tab */
        <div className="rounded-3xl overflow-hidden border border-surface-300 shadow-2xl">
          <DynamicPortfolioRenderer
            template={activeTemplate}
            user={templateUser}
            bannerUrl={bannerUrl}
            skills={data?.skills || []}
            projects={templateProjects}
            education={data?.user.education || []}
            isDashboardPreview={false}
            onShareClick={() => setIsShareModalOpen(true)}
          />
        </div>
      )}

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        username={username || "preview"}
        fullName={displayName}
        headline={data?.user.profile?.headline || undefined}
      />
    </div>
  );
}
