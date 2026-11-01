"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  Sparkles,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api-client";

interface CareerInsightsData {
  overallReadiness: number;
  dimensionScores: {
    skillDepth: number;
    projectBreadth: number;
    executionVelocity: number;
    industryAlignment: number;
    practicalEvidence: number;
    makerMindset: number;
  };
  recommendations: {
    priority: "HIGH" | "MEDIUM" | "LOW";
    title: string;
    description: string;
    actionUrl: string;
    actionText: string;
  }[];
  aiAnalysis: string;
}

export default function CareerIntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<CareerInsightsData | null>(null);

  useEffect(() => {
    async function loadInsights() {
      try {
        const data = await api.get<CareerInsightsData>("/api/career/insights");
        setInsights(data);
      } catch {
        toast.error("Failed to load career intelligence insights");
      } finally {
        setLoading(false);
      }
    }
    loadInsights();
  }, []);

  if (loading || !insights) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  // Format 6 Dimensions for Radar Chart
  const radarData = [
    { dimension: "Skill Depth", score: insights.dimensionScores.skillDepth, fullMark: 100 },
    { dimension: "Project Breadth", score: insights.dimensionScores.projectBreadth, fullMark: 100 },
    { dimension: "Execution Velocity", score: insights.dimensionScores.executionVelocity, fullMark: 100 },
    { dimension: "Industry Alignment", score: insights.dimensionScores.industryAlignment, fullMark: 100 },
    { dimension: "Practical Evidence", score: insights.dimensionScores.practicalEvidence, fullMark: 100 },
    { dimension: "Maker Mindset", score: insights.dimensionScores.makerMindset, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-50 text-accent-700 border border-accent-200 mb-2 shadow-xs">
          <Sparkles className="h-3 w-3 text-accent-500" />
          <span>APIN Career Readiness • Academic Project &amp; Internship Navigator</span>
        </div>
        <h1 className="text-2xl font-bold text-surface-900">Career Intelligence &amp; Readiness Index</h1>
        <p className="text-sm text-surface-500">
          Multi-dimensional evaluation of your technical depth, execution velocity, project evidence, and industry fit.
        </p>
      </div>

      {/* Hero Overview Card */}
      <Card className="border-surface-200 overflow-hidden bg-gradient-to-r from-surface-0 via-surface-50 to-primary-50/20">
        <CardContent className="p-6 sm:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 flex-1 text-center md:text-left">
              <Badge className="bg-primary-50 text-primary-700 border-primary-200 text-xs px-3 py-1">
                AI Diagnostic Evaluation
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-surface-900">
                Overall Career Readiness: {insights.overallReadiness}%
              </h2>
              <p className="text-xs sm:text-sm text-surface-600 leading-relaxed max-w-xl">
                {insights.aiAnalysis}
              </p>
              <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
                <Link href="/dashboard/ai">
                  <Button variant="marigold" className="gap-2 font-bold shadow-md">
                    <Sparkles className="h-4 w-4" />
                    Ask AI Advisor Next Steps
                  </Button>
                </Link>
                <Link href="/dashboard/resume">
                  <Button variant="outline" className="gap-2">
                    Build Matched Resume
                  </Button>
                </Link>
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="relative flex flex-col items-center justify-center h-44 w-44 rounded-full border-4 border-primary-500/20 bg-white shadow-md shrink-0">
              <span className="text-4xl font-extrabold text-primary-700">
                {insights.overallReadiness}%
              </span>
              <span className="text-[11px] font-bold text-surface-400 uppercase mt-0.5 tracking-wider">
                Readiness Index
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6-Axis Radar & Dimension Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-600" />
              6-Dimensional Readiness Spider Graph
            </CardTitle>
            <CardDescription className="text-xs">
              Visualizes balance across skills, projects, velocity, and industry alignment
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "#334155" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar
                  name="Readiness"
                  dataKey="score"
                  stroke="#4f46e5"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 6 Dimension Progress Bars */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              Dimension Performance Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Detailed scoring factors and weights
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {radarData.map((d) => (
              <div key={d.dimension} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-surface-800">{d.dimension}</span>
                  <span className="font-bold text-primary-600">{d.score} / 100</span>
                </div>
                <Progress value={d.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Strategic Next Steps (Prioritized Action Cards) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-surface-900 flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          Prioritized Action Roadmap (Recommended by AI)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.recommendations.map((rec, idx) => (
            <Card key={idx} className="border-surface-200 hover:border-primary-300 transition-all flex flex-col justify-between">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    className={`text-[10px] font-bold ${
                      rec.priority === "HIGH"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : rec.priority === "MEDIUM"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-surface-100 text-surface-700"
                    }`}
                  >
                    {rec.priority} PRIORITY
                  </Badge>
                  <span className="text-xs text-surface-400">Step {idx + 1}</span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-surface-900">{rec.title}</h4>
                  <p className="text-xs text-surface-600 leading-relaxed mt-1">
                    {rec.description}
                  </p>
                </div>

                <div className="pt-2">
                  <Link href={rec.actionUrl}>
                    <Button size="sm" className="gap-1.5 text-xs w-full sm:w-auto">
                      {rec.actionText}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
