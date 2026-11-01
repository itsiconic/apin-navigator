"use client";

import React from "react";
import {
  PortfolioTemplateId,
  TEMPLATE_REGISTRY,
  TemplateMetadata,
} from "@/lib/portfolio-types";
import { Check, Sparkles, Layers, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TemplateSwitcherProps {
  activeTemplate: PortfolioTemplateId;
  onSelectTemplate: (templateId: PortfolioTemplateId) => void;
  isSaving?: boolean;
}

export function TemplateSwitcher({
  activeTemplate,
  onSelectTemplate,
  isSaving,
}: TemplateSwitcherProps) {
  const templates = Object.values(TEMPLATE_REGISTRY);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-bold text-surface-900">
            Select 3D Portfolio Theme &amp; Architecture
          </h3>
        </div>
        <span className="text-[11px] text-surface-500 font-medium">
          5 Distinct 3D GPU-Accelerated Experiences
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {templates.map((tpl) => {
          const isActive = activeTemplate === tpl.id;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelectTemplate(tpl.id)}
              disabled={isSaving}
              className={`relative text-left p-3.5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                isActive
                  ? "border-primary-600 bg-white shadow-lg ring-2 ring-primary-500/20 -translate-y-1"
                  : "border-surface-200 bg-surface-50/70 hover:border-surface-400 hover:bg-white hover:-translate-y-0.5 shadow-xs"
              }`}
            >
              {/* Miniature Theme Visual Banner */}
              <div
                className={`h-20 w-full rounded-xl bg-gradient-to-br ${tpl.previewBg} p-2.5 flex flex-col justify-between mb-3 overflow-hidden relative border border-black/10`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                    {tpl.badge}
                  </span>
                  {isActive && (
                    <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="text-[10px] font-black text-white/90 drop-shadow-sm font-mono truncate">
                  3D ENGINE: READY
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-surface-900 group-hover:text-primary-700 transition-colors">
                    {tpl.name}
                  </h4>
                  {isActive && (
                    <span className="text-[10px] font-bold text-primary-600">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-surface-500 line-clamp-2 leading-tight">
                  {tpl.tagline}
                </p>
              </div>

              {/* Category Footer */}
              <div className="mt-3 pt-2 border-t border-surface-100 flex items-center justify-between text-[10px] text-surface-400">
                <span>{tpl.category}</span>
                <span
                  className="h-2 w-2 rounded-full inline-block"
                  style={{ backgroundColor: tpl.accentHex }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

