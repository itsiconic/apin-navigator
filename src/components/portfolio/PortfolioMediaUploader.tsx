"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  CheckCircle2,
  Plus,
  RefreshCw,
  FolderKanban,
  Camera,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

interface ProjectItem {
  id: string;
  title: string;
  domain: string;
  imageUrl?: string | null;
}

interface PortfolioMediaUploaderProps {
  bannerUrl?: string | null;
  projectImages?: Record<string, string>;
  projects: ProjectItem[];
  onBannerUpdated: (newUrl: string | null) => void;
  onProjectImageUpdated: (projectId: string, newUrl: string | null) => void;
}

export function PortfolioMediaUploader({
  bannerUrl,
  projectImages = {},
  projects,
  onBannerUpdated,
  onProjectImageUpdated,
}: PortfolioMediaUploaderProps) {
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingProject, setUploadingProject] = useState<string | null>(null);

  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const projectInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Upload banner
  const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Banner image must be smaller than 8MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "banner");

    setUploadingBanner(true);
    try {
      const res = await fetch("/api/portfolio/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to upload banner");
      }
      onBannerUpdated(data.data.url);
      toast.success("Theme cover banner updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload banner image");
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleRemoveBanner = async () => {
    try {
      await api.post("/api/portfolio", { bannerUrl: null });
      onBannerUpdated(null);
      toast.success("Theme banner removed");
    } catch {
      toast.error("Failed to remove banner");
    }
  };

  // Upload project image
  const handleProjectFileChange = async (
    projectId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Project screenshot must be smaller than 8MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "project");
    formData.append("projectId", projectId);

    setUploadingProject(projectId);
    try {
      const res = await fetch("/api/portfolio/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to upload project image");
      }
      onProjectImageUpdated(projectId, data.data.url);
      toast.success("Project screenshot uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload project screenshot");
    } finally {
      setUploadingProject(null);
      if (projectInputRefs.current[projectId]) {
        projectInputRefs.current[projectId]!.value = "";
      }
    }
  };

  const handleRemoveProjectImage = async (projectId: string) => {
    try {
      const current = { ...projectImages };
      delete current[projectId];
      await api.post("/api/portfolio", { projectImages: current });
      onProjectImageUpdated(projectId, null);
      toast.success("Project screenshot removed");
    } catch {
      toast.error("Failed to remove project screenshot");
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Banner Upload Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary-600" />
            <h3 className="text-sm font-bold text-surface-900">
              Custom Theme Cover / Backdrop Banner
            </h3>
          </div>
          <span className="text-[11px] text-surface-500">
            Recommended: 1920x600px • Max 8MB
          </span>
        </div>

        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBannerFileChange}
        />

        {bannerUrl ? (
          <div className="relative group rounded-2xl overflow-hidden border border-surface-200/90 shadow-md h-44 sm:h-56 bg-surface-900">
            <img
              src={bannerUrl}
              alt="Portfolio Theme Banner"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end justify-between p-4">
              <Badge className="bg-emerald-500/90 text-white border-none text-[11px]">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active Theme Banner
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bannerInputRef.current?.click()}
                  disabled={uploadingBanner}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/40 text-xs backdrop-blur-md"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Replace Banner
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleRemoveBanner}
                  className="text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => bannerInputRef.current?.click()}
            className="border-2 border-dashed border-surface-300 hover:border-primary-500 rounded-2xl p-8 text-center cursor-pointer transition-all bg-surface-50/70 hover:bg-primary-50/30 flex flex-col items-center justify-center gap-2 group"
          >
            <div className="h-12 w-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 group-hover:scale-110 transition-transform">
              {uploadingBanner ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-700 border-t-transparent" />
              ) : (
                <Upload className="h-6 w-6" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-surface-800">
                {uploadingBanner ? "Uploading banner..." : "Click to upload a custom theme hero backdrop"}
              </p>
              <p className="text-xs text-surface-500 mt-0.5">
                PNG, JPG, WEBP, or SVG. Perfectly styled across all 5 themes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Project Screenshots Showcase Upload Area */}
      {projects && projects.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-accent-600" />
              <h3 className="text-sm font-bold text-surface-900">
                Project Screenshots &amp; Visual Artifacts
              </h3>
            </div>
            <span className="text-[11px] text-surface-500">
              Attach screenshots to bring your 3D cards to life
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((proj) => {
              const currentImg = projectImages[proj.id] || proj.imageUrl;
              const isUploadingThis = uploadingProject === proj.id;

              return (
                <Card
                  key={proj.id}
                  className="border-surface-200/90 overflow-hidden bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <input
                    ref={(el) => {
                      projectInputRefs.current[proj.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleProjectFileChange(proj.id, e)}
                  />

                  {currentImg ? (
                    <div className="relative group h-36 bg-surface-950 overflow-hidden">
                      <img
                        src={currentImg}
                        alt={proj.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => projectInputRefs.current[proj.id]?.click()}
                          disabled={isUploadingThis}
                          className="h-8 text-[11px] bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Change
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleRemoveProjectImage(proj.id)}
                          className="h-8 text-[11px]"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => projectInputRefs.current[proj.id]?.click()}
                      className="h-36 bg-surface-50 hover:bg-surface-100 border-b border-surface-200 flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center group"
                    >
                      <div className="h-9 w-9 rounded-xl bg-surface-200/70 text-surface-600 flex items-center justify-center mb-1.5 group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors">
                        {isUploadingThis ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-700 border-t-transparent" />
                        ) : (
                          <ImageIcon className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-surface-700">
                        {isUploadingThis ? "Uploading..." : "Upload Screenshot"}
                      </span>
                      <span className="text-[10px] text-surface-400">16:9 UI Preview</span>
                    </div>
                  )}

                  <CardContent className="p-3">
                    <p className="font-bold text-xs text-surface-900 truncate">
                      {proj.title}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-surface-500">
                      <span className="capitalize">{proj.domain.toLowerCase().replace("_", " ")}</span>
                      {currentImg && (
                        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="h-3 w-3" />
                          Image Ready
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
