"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Sparkles,
  BarChart3,
  RotateCcw,
  Code2,
  ShieldAlert,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api-client";

interface Option {
  id: string;
  optionText: string;
  codeSnippet?: string | null;
  sortOrder: number;
}

interface Question {
  id: string;
  questionText: string;
  codeSnippet?: string | null;
  questionType: string;
  difficulty: string;
  points: number;
  sortOrder: number;
  options: Option[];
}

interface AssessmentDetail {
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
  };
  questions: Question[];
}

interface QuestionResult {
  questionId: string;
  questionText: string;
  codeSnippet?: string | null;
  category: string;
  difficulty: string;
  points: number;
  explanation: string;
  selectedOptionId: string | null;
  correctOptionId: string | null;
  isCorrect: boolean;
  options: {
    id: string;
    optionText: string;
    codeSnippet?: string | null;
    isCorrect: boolean;
  }[];
}

interface ExamResultReport {
  submissionId: string;
  assessmentTitle: string;
  skillName: string;
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  passed: boolean;
  passingScore: number;
  timeSpentSeconds: number;
  masteryTier: string;
  categoryScores: Record<string, number>;
  questionResults: QuestionResult[];
}

export default function AssessmentExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const examId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);

  // Exam state
  const [examStatus, setExamStatus] = useState<"READY" | "IN_PROGRESS" | "COMPLETED">("READY");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Result state
  const [report, setReport] = useState<ExamResultReport | null>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    async function loadExam() {
      try {
        const data = await api.get<AssessmentDetail>(`/api/assessments/${examId}`);
        setAssessment(data);
        if (data) {
          setSecondsRemaining(data.durationMinutes * 60);
        }
      } catch {
        toast.error("Failed to load assessment details");
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [examId]);

  // Timer countdown
  useEffect(() => {
    if (examStatus !== "IN_PROGRESS") return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.warning("Time expired! Automatically submitting your assessment.");
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStatus]);

  const handleStartExam = () => {
    setExamStatus("IN_PROGRESS");
    toast.success("Exam started. Good luck!");
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const toggleFlag = (index: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleSubmitExam = async () => {
    if (!assessment) return;
    setSubmitting(true);
    setConfirmSubmitOpen(false);

    try {
      const payload = {
        timeSpentSeconds: assessment.durationMinutes * 60 - secondsRemaining,
        answers: assessment.questions.map((q) => ({
          questionId: q.id,
          selectedOptionId: selectedAnswers[q.id] || null,
        })),
      };

      const result = await api.post<ExamResultReport>(
        `/api/assessments/${assessment.id}/submit`,
        payload
      );

      setReport(result);
      setExamStatus("COMPLETED");
      toast.success(
        result.passed
          ? `🎉 Congratulations! Passed with ${result.score}%!`
          : `Assessment finished. Score: ${result.score}%`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit assessment";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !assessment) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  // Format time remaining MM:SS
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  const currentQ = assessment.questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQ = assessment.questions.length;

  // ========================================================
  // 1. PRE-EXAM BRIEFING SCREEN
  // ========================================================
  if (examStatus === "READY") {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-6">
        <Link
          href="/dashboard/assessments"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 hover:text-surface-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assessments Catalog
        </Link>

        <Card className="border-surface-200 overflow-hidden shadow-md">
          <div className="bg-gradient-to-r from-primary-800 to-primary-950 px-6 py-8 text-white border-b border-primary-700/60">
            <Badge className="bg-accent-500/20 text-accent-300 border border-accent-400/30 mb-3 font-semibold">
              {assessment.difficulty} Level Exam
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold">{assessment.title}</h1>
            <p className="text-surface-200 text-sm mt-2 max-w-xl">{assessment.description}</p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400 mb-3">
                Examination Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-surface-50 rounded-xl p-3 border border-surface-100 text-center">
                  <p className="text-xl font-bold text-surface-900">{assessment.totalQuestions}</p>
                  <p className="text-xs text-surface-500 font-medium">Questions</p>
                </div>
                <div className="bg-surface-50 rounded-xl p-3 border border-surface-100 text-center">
                  <p className="text-xl font-bold text-surface-900">{assessment.durationMinutes}m</p>
                  <p className="text-xs text-surface-500 font-medium">Time Limit</p>
                </div>
                <div className="bg-surface-50 rounded-xl p-3 border border-surface-100 text-center">
                  <p className="text-xl font-bold text-emerald-600">{assessment.passingScore}%</p>
                  <p className="text-xs text-surface-500 font-medium">Passing Threshold</p>
                </div>
                <div className="bg-surface-50 rounded-xl p-3 border border-surface-100 text-center">
                  <p className="text-xl font-bold text-primary-600">5</p>
                  <p className="text-xs text-surface-500 font-medium">Evaluated Axes</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-surface-200 bg-surface-50/70 p-4 space-y-2 text-xs text-surface-600">
              <h4 className="font-semibold text-surface-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Instructions & Integrity Guidelines
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                <li>This test consists of 30 randomized engineering questions.</li>
                <li>Questions cover Syntax, Engine Internals, Problem Solving, and Production Design.</li>
                <li>You can flag questions for review and jump between questions at any time.</li>
                <li>Once submitted, an instant multi-dimensional performance radar chart will be generated.</li>
                <li>Passing this exam automatically verifies the skill on your profile and updates your AI match score.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="lg" onClick={handleStartExam} className="gap-2 w-full sm:w-auto">
                <ClipboardCheck className="h-5 w-5" />
                Begin 30-Question Examination
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ========================================================
  // 2. IN-EXAM ACTIVE SESSION SCREEN
  // ========================================================
  if (examStatus === "IN_PROGRESS") {
    const isFlagged = flaggedQuestions.has(currentIndex);
    const selectedOpt = selectedAnswers[currentQ.id];

    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Sticky Exam Bar */}
        <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border border-surface-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono text-xs">
              Q {currentIndex + 1} of {totalQ}
            </Badge>
            <span className="text-xs text-surface-500 hidden sm:inline">
              Answered: <strong>{answeredCount}</strong> / {totalQ}
            </span>
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-2 font-mono text-sm font-bold px-3 py-1.5 rounded-lg border ${
              secondsRemaining < 300
                ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                : "bg-surface-100 text-surface-800 border-surface-200"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{timeFormatted}</span>
          </div>

          <Button
            size="sm"
            variant="default"
            onClick={() => setConfirmSubmitOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Finish & Submit
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Canvas */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-surface-200">
              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* Meta header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary-50 text-primary-700 border-primary-200 text-xs">
                      {currentQ.questionType.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentQ.difficulty}
                    </Badge>
                    <span className="text-xs font-semibold text-surface-400">
                      {currentQ.points} Point{currentQ.points > 1 ? "s" : ""}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFlag(currentIndex)}
                    className={`gap-1.5 text-xs ${
                      isFlagged ? "text-amber-600 bg-amber-50" : "text-surface-500"
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    {isFlagged ? "Flagged for Review" : "Flag for Review"}
                  </Button>
                </div>

                {/* Question Text */}
                <h2 className="text-base sm:text-lg font-semibold text-surface-900 leading-relaxed">
                  {currentQ.questionText}
                </h2>

                {/* Code Snippet Box */}
                {currentQ.codeSnippet && (
                  <div className="rounded-xl overflow-hidden border border-surface-800 bg-surface-900 text-surface-100 font-mono text-xs sm:text-sm p-4 shadow-inner">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-700/60 text-[11px] text-surface-400">
                      <span>Code Snippet</span>
                      <span>{assessment.skill.name}</span>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre leading-relaxed">
                      <code>{currentQ.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    Select the single best answer:
                  </p>
                  {currentQ.options.map((opt, i) => {
                    const isSelected = selectedOpt === opt.id;
                    const letter = String.fromCharCode(65 + i);

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQ.id, opt.id)}
                        className={`group flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary-50/70 border-primary-500 ring-2 ring-primary-500/20 shadow-xs"
                            : "bg-white border-surface-200 hover:border-surface-300 hover:bg-surface-50/50"
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                            isSelected
                              ? "bg-primary-600 text-white"
                              : "bg-surface-100 text-surface-600 group-hover:bg-surface-200"
                          }`}
                        >
                          {letter}
                        </div>
                        <div className="flex-1 text-sm text-surface-800 font-medium leading-relaxed">
                          {opt.optionText}
                          {opt.codeSnippet && (
                            <pre className="mt-2 p-2 bg-surface-900 text-surface-100 rounded text-xs overflow-x-auto">
                              <code>{opt.codeSnippet}</code>
                            </pre>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Question Switcher */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentIndex < totalQ - 1 ? (
                <Button onClick={() => setCurrentIndex((prev) => prev + 1)} className="gap-2">
                  Next Question
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => setConfirmSubmitOpen(true)}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  Review & Submit
                </Button>
              )}
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="space-y-4">
            <Card className="border-surface-200 sticky top-36">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold">Question Palette</CardTitle>
                <CardDescription className="text-xs">
                  Jump directly to any problem
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-5 gap-1.5">
                  {assessment.questions.map((q, idx) => {
                    const isAnswered = !!selectedAnswers[q.id];
                    const isCur = idx === currentIndex;
                    const flagged = flaggedQuestions.has(idx);

                    let btnClass = "bg-surface-100 text-surface-700 border-surface-200";
                    if (isAnswered) btnClass = "bg-primary-600 text-white border-primary-600 font-bold";
                    if (flagged) btnClass = "bg-amber-500 text-white border-amber-500 font-bold";
                    if (isCur) btnClass += " ring-2 ring-surface-900 ring-offset-1";

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 w-9 rounded-lg border text-xs font-medium transition-all flex items-center justify-center ${btnClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-surface-100 space-y-1.5 text-[11px] text-surface-500">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-surface-200" />
                    <span>Unanswered ({totalQ - answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span>Flagged for Review ({flaggedQuestions.size})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmation Modal */}
        <Dialog open={confirmSubmitOpen} onOpenChange={setConfirmSubmitOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Examination?</DialogTitle>
              <DialogDescription>
                You have answered <strong>{answeredCount}</strong> of <strong>{totalQ}</strong> questions.
                {totalQ - answeredCount > 0 && (
                  <span className="block text-amber-600 font-medium mt-1">
                    Warning: You still have {totalQ - answeredCount} unanswered questions!
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmSubmitOpen(false)}>
                Continue Test
              </Button>
              <Button onClick={handleSubmitExam} loading={submitting} className="bg-emerald-600 hover:bg-emerald-700">
                Confirm & Grade Exam
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ========================================================
  // 3. POST-EXAM RESULTS SCREEN (WITH RADAR & BAR CHARTS)
  // ========================================================
  if (examStatus === "COMPLETED" && report) {
    // Format Radar Data
    const categoryNames: Record<string, string> = {
      BASIC_KNOWLEDGE: "Basic Knowledge",
      THEORY: "Theory & Internals",
      PROGRAMMING: "Code Snippets",
      PROBLEM_SOLVING: "Problem Solving",
      SYSTEM_DESIGN: "Production Design",
    };

    const radarData = Object.entries(report.categoryScores).map(([key, score]) => ({
      category: categoryNames[key] || key,
      score: score,
      fullMark: 100,
    }));

    const barData = Object.entries(report.categoryScores).map(([key, score]) => ({
      name: categoryNames[key] || key,
      score: score,
    }));

    const minsTaken = Math.floor(report.timeSpentSeconds / 60);
    const secsTaken = report.timeSpentSeconds % 60;

    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
        {/* Hero Score Card */}
        <Card
          className={`overflow-hidden border-2 shadow-lg ${
            report.passed
              ? "border-emerald-500 bg-gradient-to-br from-emerald-50/40 via-white to-surface-0"
              : "border-amber-500 bg-gradient-to-br from-amber-50/40 via-white to-surface-0"
          }`}
        >
          <CardContent className="p-6 sm:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <Badge
                  className={`text-xs px-3 py-1 font-semibold ${
                    report.passed
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-600 text-white"
                  }`}
                >
                  {report.passed ? "ASSESSMENT CLEARED" : "NEEDS RETAKE"}
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
                  {report.assessmentTitle}
                </h1>
                <p className="text-sm text-surface-600 max-w-lg">
                  Skill Mastery Rating:{" "}
                  <strong className="text-primary-700 font-bold">{report.masteryTier}</strong>
                  . Your profile score and skill verification badge have been updated.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-surface-500 pt-2">
                  <span>Questions Correct: <strong>{report.totalCorrect} / {report.totalQuestions}</strong></span>
                  <span>•</span>
                  <span>Time Taken: <strong>{minsTaken}m {secsTaken}s</strong></span>
                  <span>•</span>
                  <span>Passing Threshold: <strong>{report.passingScore}%</strong></span>
                </div>
              </div>

              {/* Big Circular Score */}
              <div className="relative flex flex-col items-center justify-center h-40 w-40 rounded-full border-4 border-surface-200 bg-white shadow-md">
                <span className="text-4xl font-extrabold text-surface-900">{report.score}%</span>
                <span className="text-xs font-semibold text-surface-400 uppercase mt-0.5">Final Score</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Charts: Radar & Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary-600" />
                Multi-Axis Competency Radar
              </CardTitle>
              <CardDescription className="text-xs">
                Performance mapped across all 5 evaluated core dimensions
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "#475569" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                  <Radar
                    name="Score"
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

          {/* Bar Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
                Category Percentage Breakdown
              </CardTitle>
              <CardDescription className="text-xs">
                Relative strengths and optimization targets
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#334155" }} width={120} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface-50 rounded-xl border border-surface-200">
          <div className="flex gap-2">
            <Button
              variant={showReview ? "default" : "outline"}
              onClick={() => setShowReview(!showReview)}
            >
              {showReview ? "Hide Question Review" : "Review All 30 Answers & Explanations"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setExamStatus("READY");
                setReport(null);
                setSelectedAnswers({});
                setFlaggedQuestions(new Set());
              }}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Exam
            </Button>
          </div>

          <Link href="/dashboard/skills">
            <Button className="gap-2">
              Back to Skills Center
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Detailed Question Review */}
        {showReview && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-surface-900">
              Detailed Question Analysis & Solution Explanations
            </h3>
            <div className="space-y-4">
              {report.questionResults.map((qr, idx) => (
                <Card
                  key={qr.questionId}
                  className={`border ${
                    qr.isCorrect ? "border-emerald-200 bg-white" : "border-rose-200 bg-rose-50/20"
                  }`}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-xs ${
                            qr.isCorrect ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                          }`}
                        >
                          Q{idx + 1} {qr.isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {qr.category.replace("_", " ")}
                        </Badge>
                      </div>
                      <span className="text-xs font-semibold text-surface-500">
                        {qr.difficulty}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-surface-900">{qr.questionText}</p>

                    {qr.codeSnippet && (
                      <pre className="p-3 bg-surface-900 text-surface-100 rounded-lg text-xs overflow-x-auto font-mono">
                        <code>{qr.codeSnippet}</code>
                      </pre>
                    )}

                    {/* Options list */}
                    <div className="space-y-1.5 pt-1">
                      {qr.options.map((opt) => {
                        const isUserChoice = opt.id === qr.selectedOptionId;
                        const isRightChoice = opt.isCorrect;

                        let optClass = "border-surface-200 bg-surface-50 text-surface-700";
                        if (isRightChoice) {
                          optClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                        } else if (isUserChoice && !isRightChoice) {
                          optClass = "border-rose-500 bg-rose-50 text-rose-900 font-semibold";
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${optClass}`}
                          >
                            <span>{opt.optionText}</span>
                            {isRightChoice && (
                              <Badge className="bg-emerald-600 text-white text-[10px]">
                                Correct Answer
                              </Badge>
                            )}
                            {isUserChoice && !isRightChoice && (
                              <Badge className="bg-rose-600 text-white text-[10px]">
                                Your Choice
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="mt-3 p-3 bg-surface-50 rounded-lg border border-surface-200 text-xs text-surface-700 space-y-1">
                      <strong className="text-surface-900 block font-semibold">
                        Technical Explanation:
                      </strong>
                      <p className="leading-relaxed">{qr.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
