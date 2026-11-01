"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ClipboardCheck,
  Clock,
  HelpCircle,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThreeDCard } from "@/components/ui/three-d-card";
import { api } from "@/lib/api-client";

interface AssessmentItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  difficulty: string;
  skill: {
    id: string;
    name: string;
    slug: string;
    category: {
      name: string;
      slug: string;
    };
  };
  attemptsCount: number;
  bestScore: number | null;
  hasPassed: boolean;
  latestSubmission: {
    id: string;
    score: number;
    passed: boolean;
    createdAt: string;
  } | null;
}

export default function AssessmentsCatalogPage() {
  const searchParams = useSearchParams();
  const skillFilter = searchParams.get("skill");

  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);

  useEffect(() => {
    async function loadAssessments() {
      try {
        const url = skillFilter
          ? `/api/assessments?skill=${skillFilter}`
          : "/api/assessments";
        const data = await api.get<AssessmentItem[]>(url);
        setAssessments(data || []);
      } catch {
        toast.error("Failed to load assessments");
      } finally {
        setLoading(false);
      }
    }
    loadAssessments();
  }, [skillFilter]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-50 text-accent-700 border border-accent-200 mb-2 shadow-xs">
            <Sparkles className="h-3 w-3 text-accent-500" />
            <span>APIN Evaluation Engine • Academic Project &amp; Internship Navigator</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Skill Competency Assessments</h1>
          <p className="text-sm text-surface-500">
            Standardized 30-question examinations covering code syntax, runtime internals, problem solving, and architecture.
          </p>
        </div>
        {skillFilter && (
          <Link href="/dashboard/assessments">
            <Button variant="outline" size="sm" className="button-3d">
              Show All Exams
            </Button>
          </Link>
        )}
      </div>

      {/* Blueprint Info Banner */}
      <ThreeDCard maxTilt={4} glare={true} depth={15}>
        <Card className="card-interactive bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 text-white border border-primary-700/60 shadow-xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500/20 text-accent-400 border border-accent-400/30">
                    <BrainCircuit className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-bold tracking-wider uppercase text-accent-400">
                    AI Evaluated &amp; Job-Calibrated Exams
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Demonstrate Superior Expertise Across 5 Dimensions
                </h2>
                <p className="text-sm text-surface-300 leading-relaxed">
                  Each assessment evaluates <strong>Basic Knowledge</strong>, <strong>Theoretical Internals</strong>, <strong>Programming Snippets</strong>, <strong>Problem Solving</strong>, and <strong>Production System Design</strong>. Completing an exam updates your skill mastery chart and unlocks verified badges for recruiters and hackathons.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                  <p className="text-2xl font-bold text-white">30</p>
                  <p className="text-[11px] text-surface-300 font-medium">Questions / Test</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                  <p className="text-2xl font-bold text-emerald-400">70%</p>
                  <p className="text-[11px] text-surface-300 font-medium">Passing Threshold</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                  <p className="text-2xl font-bold text-amber-300">45m</p>
                  <p className="text-[11px] text-surface-300 font-medium">Timed Window</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                  <p className="text-2xl font-bold text-sky-300">Radar</p>
                  <p className="text-[11px] text-surface-300 font-medium">Proficiency Graph</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ThreeDCard>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((exam) => (
          <Card key={exam.id} className="flex flex-col hover:border-primary-300 hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {exam.skill.category.name}
                </Badge>
                {exam.hasPassed ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Passed ({exam.bestScore}%)
                  </Badge>
                ) : exam.attemptsCount > 0 ? (
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                    Attempted ({exam.bestScore}%)
                  </Badge>
                ) : (
                  <Badge className="bg-surface-100 text-surface-600 text-xs">
                    Ready to Take
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg leading-snug">{exam.title}</CardTitle>
              <CardDescription className="text-xs line-clamp-2 mt-1">
                {exam.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 flex-1 flex flex-col justify-between pt-0">
              {/* Exam specs */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-surface-100 text-center bg-surface-50/50 rounded-lg">
                <div>
                  <span className="text-[10px] text-surface-400 block font-medium">Questions</span>
                  <span className="text-xs font-bold text-surface-800">{exam.totalQuestions} MCQs</span>
                </div>
                <div>
                  <span className="text-[10px] text-surface-400 block font-medium">Duration</span>
                  <span className="text-xs font-bold text-surface-800">{exam.durationMinutes} Mins</span>
                </div>
                <div>
                  <span className="text-[10px] text-surface-400 block font-medium">Pass Score</span>
                  <span className="text-xs font-bold text-surface-800">{exam.passingScore}%</span>
                </div>
              </div>

              {/* Action Button */}
              <Link href={`/dashboard/assessments/${exam.id}`} className="w-full">
                <Button className="w-full gap-2 mt-2">
                  <ClipboardCheck className="h-4 w-4" />
                  {exam.hasPassed ? "Retake for Higher Score" : "Start 30-Q Examination"}
                  <ArrowRight className="h-3.5 w-3.5 ml-auto" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
