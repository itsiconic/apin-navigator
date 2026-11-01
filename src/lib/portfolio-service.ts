import fs from "fs";
import path from "path";
import {
  PortfolioTemplateId,
  TemplateMetadata,
  TEMPLATE_REGISTRY,
  PortfolioConfig,
} from "./portfolio-types";

export * from "./portfolio-types";

const CONFIGS_FILE = path.join(process.cwd(), "data", "portfolio-configs.json");

function readConfigs(): Record<string, PortfolioConfig> {
  try {
    if (!fs.existsSync(CONFIGS_FILE)) {
      return {};
    }
    const raw = fs.readFileSync(CONFIGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read portfolio configs:", err);
    return {};
  }
}

function writeConfigs(configs: Record<string, PortfolioConfig>): void {
  try {
    const dir = path.dirname(CONFIGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIGS_FILE, JSON.stringify(configs, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write portfolio configs:", err);
  }
}

export function getPortfolioConfig(userKey: string): PortfolioConfig {
  if (!userKey) {
    return {
      template: "AURORA",
      updatedAt: new Date().toISOString(),
    };
  }

  const normalized = userKey.toLowerCase().trim();
  const allConfigs = readConfigs();

  const found = allConfigs[normalized] || allConfigs[userKey];
  if (found) {
    return {
      template: (found.template as PortfolioTemplateId) || "AURORA",
      bannerUrl: found.bannerUrl || null,
      avatarUrl: found.avatarUrl || null,
      headline: found.headline || null,
      bio: found.bio || null,
      projectImages: found.projectImages || {},
      accentColor: found.accentColor || null,
      updatedAt: found.updatedAt || new Date().toISOString(),
    };
  }

  return {
    template: "AURORA",
    projectImages: {},
    updatedAt: new Date().toISOString(),
  };
}

export function savePortfolioConfig(
  userKey: string,
  update: Partial<PortfolioConfig>
): PortfolioConfig {
  const normalized = userKey.toLowerCase().trim();
  const allConfigs = readConfigs();
  const current = getPortfolioConfig(userKey);

  const updated: PortfolioConfig = {
    ...current,
    ...update,
    projectImages: {
      ...(current.projectImages || {}),
      ...(update.projectImages || {}),
    },
    updatedAt: new Date().toISOString(),
  };

  allConfigs[normalized] = updated;
  writeConfigs(allConfigs);
  return updated;
}
