"use client";

import React from "react";
import { PortfolioTemplateId } from "@/lib/portfolio-types";
import { PortfolioTemplateProps } from "./types";
import { AuroraTemplate } from "./AuroraTemplate";
import { CyberpunkTemplate } from "./CyberpunkTemplate";
import { MinimalChicTemplate } from "./MinimalChicTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";
import { DevRetroTemplate } from "./DevRetroTemplate";

export * from "./types";
export * from "./AuroraTemplate";
export * from "./CyberpunkTemplate";
export * from "./MinimalChicTemplate";
export * from "./ExecutiveTemplate";
export * from "./DevRetroTemplate";

interface DynamicPortfolioRendererProps extends PortfolioTemplateProps {
  template: PortfolioTemplateId;
}

export function DynamicPortfolioRenderer({
  template,
  ...props
}: DynamicPortfolioRendererProps) {
  switch (template) {
    case "CYBERPUNK":
      return <CyberpunkTemplate {...props} />;
    case "MINIMAL_CHIC":
      return <MinimalChicTemplate {...props} />;
    case "EXECUTIVE":
      return <ExecutiveTemplate {...props} />;
    case "DEV_RETRO":
      return <DevRetroTemplate {...props} />;
    case "AURORA":
    default:
      return <AuroraTemplate {...props} />;
  }
}

