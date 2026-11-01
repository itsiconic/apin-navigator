"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban,
  Sparkles,
  Plus,
  Clock,
  TrendingUp,
  CheckCircle2,
  Circle,
  ExternalLink,
  Github,
  Cpu,
  Code2,
  Award,
  Layers,
  Calendar,
  Flame,
  AlertCircle,
  Send,
  Trash2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThreeDCard } from "@/components/ui/three-d-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api-client";

interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  sortOrder: number;
}

interface DailyLog {
  id: string;
  logDate: string;
  hoursSpent: number;
  tasksCompleted: string;
  blockers?: string | null;
  gitCommitSha?: string | null;
  aiProgressFeedback?: string | null;
  velocityGain?: number | null;
}

interface UserProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  domain: string;
  projectType: string;
  difficulty: string;
  status: string;
  progressPercentage: number;
  velocityScore: number;
  totalHoursLogged: number;
  repoUrl?: string | null;
  liveDemoUrl?: string | null;
  hardwareSpecs?: string | null;
  milestones: Milestone[];
  dailyLogs: DailyLog[];
}

interface ProjectIdea {
  id: string;
  title: string;
  slug: string;
  domain: string;
  projectType: string;
  difficulty: string;
  problemStatement: string;
  marketNeed: string;
  architectureOverview?: string | null;
  techStack: string[];
  tags: string[];
  hardwareRequirements?: string | null;
  estimatedHours: number;
  isSihChallenge: boolean;
  matchPercentage: number;
}

export default function ProjectsHubPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"my-projects" | "explore">("my-projects");

  const [myProjects, setMyProjects] = useState<UserProject[]>([]);
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [ideaDomainFilter, setIdeaDomainFilter] = useState("ALL");
  const [sihFilter, setSihFilter] = useState(false);

  // Daily Log Modal State
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [logForm, setLogForm] = useState({
    hoursSpent: "2.5",
    tasksCompleted: "",
    blockers: "",
    gitCommitSha: "",
  });
  const [submittingLog, setSubmittingLog] = useState(false);

  // New Custom Project Modal State
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [customForm, setCustomForm] = useState({
    title: "",
    description: "",
    domain: "FULLSTACK",
    projectType: "SOFTWARE",
    difficulty: "INTERMEDIATE",
    repoUrl: "",
    liveDemoUrl: "",
    hardwareSpecs: "",
  });

  const fetchData = async () => {
    try {
      const [userProjectsData, ideasData] = await Promise.all([
        api.get<UserProject[]>("/api/projects"),
        api.get<ProjectIdea[]>(`/api/projects/ideas${sihFilter ? "?sih=true" : ""}`),
      ]);
      setMyProjects(userProjectsData || []);
      setIdeas(ideasData || []);
    } catch {
      toast.error("Failed to load projects data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sihFilter]);

  const handleToggleMilestone = async (projectId: string, milestoneId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/api/projects/${projectId}/milestones`, {
        milestoneId,
        isCompleted: !currentStatus,
      });
      toast.success(!currentStatus ? "Milestone completed!" : "Milestone reopened");
      await fetchData();
    } catch {
      toast.error("Failed to update milestone");
    }
  };

  const handleAdoptIdea = async (idea: ProjectIdea) => {
    try {
      await api.post("/api/projects", {
        projectIdeaId: idea.id,
        title: idea.title,
        description: idea.problemStatement,
        domain: idea.domain,
        projectType: idea.projectType,
        difficulty: idea.difficulty,
        hardwareSpecs: idea.hardwareRequirements || undefined,
      });
      toast.success(`Adopted "${idea.title}" into active builds!`);
      setActiveTab("my-projects");
      await fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to adopt project";
      toast.error(msg);
    }
  };

  const handleToggleStatus = async (projectId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED";
      await api.patch(`/api/projects/${projectId}`, { status: newStatus });
      toast.success(newStatus === "COMPLETED" ? "Project marked as Completed! Ready for resume." : "Project reopened to In Progress.");
      await fetchData();
    } catch {
      toast.error("Failed to update project status");
    }
  };

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${projectTitle}"?`)) return;
    try {
      await api.delete(`/api/projects/${projectId}`);
      toast.success("Project removed successfully.");
      await fetchData();
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleLogDailyWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setSubmittingLog(true);

    try {
      const res = await api.post<{ aiFeedback: string; velocityGain: number }>(
        `/api/projects/${selectedProjectId}/logs`,
        {
          hoursSpent: parseFloat(logForm.hoursSpent),
          tasksCompleted: logForm.tasksCompleted,
          blockers: logForm.blockers || undefined,
          gitCommitSha: logForm.gitCommitSha || undefined,
        }
      );

      toast.success(`Logged ${logForm.hoursSpent}h work! Velocity gained: +${res.velocityGain} pts`);
      setLogModalOpen(false);
      setLogForm({ hoursSpent: "2.5", tasksCompleted: "", blockers: "", gitCommitSha: "" });
      await fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record daily log";
      toast.error(msg);
    } finally {
      setSubmittingLog(false);
    }
  };

  const handleCreateCustomProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/projects", customForm);
      toast.success("New project created and initialized with starter milestones!");
      setNewProjectModalOpen(false);
      setCustomForm({
        title: "",
        description: "",
        domain: "FULLSTACK",
        projectType: "SOFTWARE",
        difficulty: "INTERMEDIATE",
        repoUrl: "",
        liveDemoUrl: "",
        hardwareSpecs: "",
      });
      await fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create project";
      toast.error(msg);
    }
  };

  // Metrics
  const activeCount = myProjects.filter((p) => p.status === "IN_PROGRESS").length;
  const totalHours = Math.round(myProjects.reduce((acc, p) => acc + p.totalHoursLogged, 0) * 10) / 10;
  const avgVelocity =
    myProjects.length > 0
      ? Math.round(myProjects.reduce((acc, p) => acc + p.velocityScore, 0) / myProjects.length)
      : 0;
  const completedCount = myProjects.filter((p) => p.status === "COMPLETED").length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-50 text-accent-700 border border-accent-200 mb-2 shadow-xs">
            <Sparkles className="h-3 w-3 text-accent-500" />
            <span>APIN Project Engine • Academic Project &amp; Internship Navigator</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">AI Project Hub &amp; Execution Tracker</h1>
          <p className="text-sm text-surface-500">
            Build verified software, hardware, and SIH challenge projects with everyday progress logging and AI velocity evaluation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setNewProjectModalOpen(true)} className="gap-2 button-3d">
            <Plus className="h-4 w-4" />
            Custom Project
          </Button>
          <Button onClick={() => setActiveTab("explore")} className="gap-2 button-3d">
            <Sparkles className="h-4 w-4" />
            Explore AI Ideas
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ThreeDCard maxTilt={8} depth={20} glare={true}>
          <Card className="bg-surface-0 border-surface-200 card-interactive h-full">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Active Builds</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{activeCount}</p>
              <span className="text-[11px] text-surface-400 mt-1 block">In-progress capstones</span>
            </CardContent>
          </Card>
        </ThreeDCard>
        <ThreeDCard maxTilt={8} depth={20} glare={true}>
          <Card className="bg-surface-0 border-surface-200 card-interactive h-full">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Hours Logged</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">{totalHours}h</p>
              <span className="text-[11px] text-surface-400 mt-1 block">Everyday engineering time</span>
            </CardContent>
          </Card>
        </ThreeDCard>
        <ThreeDCard maxTilt={8} depth={20} glare={true}>
          <Card className="bg-surface-0 border-surface-200 card-interactive h-full">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Velocity Score</p>
              <p className="text-2xl font-bold text-accent-600 mt-1 flex items-center gap-1">
                <Flame className="h-5 w-5 text-accent-500" />
                {avgVelocity}
              </p>
              <span className="text-[11px] text-surface-400 mt-1 block">Execution pace &amp; consistency</span>
            </CardContent>
          </Card>
        </ThreeDCard>
        <ThreeDCard maxTilt={8} depth={20} glare={true}>
          <Card className="bg-surface-0 border-surface-200 card-interactive h-full">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Shipped Projects</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{completedCount}</p>
              <span className="text-[11px] text-surface-400 mt-1 block">Ready for resumes</span>
            </CardContent>
          </Card>
        </ThreeDCard>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-surface-200 gap-4">
        <button
          onClick={() => setActiveTab("my-projects")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "my-projects"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-surface-500 hover:text-surface-900"
          }`}
        >
          <FolderKanban className="h-4 w-4" />
          Active Builds ({myProjects.length})
        </button>
        <button
          onClick={() => setActiveTab("explore")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "explore"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-surface-500 hover:text-surface-900"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          AI Project Recommendations ({ideas.length})
        </button>
      </div>

      {/* TAB 1: MY PROJECTS (WITH DAILY UPDATE TRACKER) */}
      {activeTab === "my-projects" && (
        <div className="space-y-6">
          {myProjects.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-3">
                  <FolderKanban className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-surface-900 mb-1">No active projects yet</h3>
                <p className="text-sm text-surface-500 max-w-md mx-auto mb-4">
                  Adopt an AI-recommended SIH challenge, hardware/IoT build, or full-stack software project to start tracking your everyday progress and velocity.
                </p>
                <Button onClick={() => setActiveTab("explore")} size="sm">
                  Explore Recommended Projects
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {myProjects.map((proj) => {
                const latestLog = proj.dailyLogs[0];

                return (
                  <Card key={proj.id} className="border-surface-200 hover:border-primary-200 transition-all overflow-hidden shadow-xs">
                    <CardHeader className="bg-surface-50/50 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-bold text-surface-900">{proj.title}</h2>
                            <Badge variant="outline" className="text-xs">
                              {proj.domain.replace("_", " ")}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                proj.projectType === "HARDWARE"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : proj.projectType === "HYBRID"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              {proj.projectType}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                proj.status === "COMPLETED"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-primary-50 text-primary-700 border-primary-200"
                              }`}
                            >
                              {proj.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-xs text-surface-600 line-clamp-2 leading-relaxed">
                            {proj.description}
                          </p>

                          {/* External Links if present */}
                          {(proj.repoUrl || proj.liveDemoUrl) && (
                            <div className="flex items-center gap-2 pt-1">
                              {proj.repoUrl && (
                                <a
                                  href={proj.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-surface-600 hover:text-surface-900 bg-white border border-surface-200 px-2 py-0.5 rounded shadow-2xs"
                                >
                                  <Github className="h-3 w-3" />
                                  Repository
                                  <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                                </a>
                              )}
                              {proj.liveDemoUrl && (
                                <a
                                  href={proj.liveDemoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-700 hover:text-primary-900 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded shadow-2xs"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Live Demo
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions: Log Work, Toggle Complete, Delete */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant={proj.status === "COMPLETED" ? "outline" : "marigold"}
                            onClick={() => handleToggleStatus(proj.id, proj.status)}
                            className="text-xs font-semibold"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            {proj.status === "COMPLETED" ? "Reopen Build" : "Mark Shipped"}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedProjectId(proj.id);
                              setLogModalOpen(true);
                            }}
                            className="gap-1.5 bg-primary-600 hover:bg-primary-700 text-xs"
                          >
                            <Send className="h-3.5 w-3.5" />
                            Log Work
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProject(proj.id, proj.title)}
                            className="p-2 text-surface-400 hover:text-danger-600 hover:bg-danger-50"
                            title="Delete Project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress and Velocity Bar */}
                      <div className="pt-3">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-semibold text-surface-700">
                            Build Completion: {proj.progressPercentage}%
                          </span>
                          <span className="text-surface-500">
                            Logged: <strong>{proj.totalHoursLogged}h</strong> | Velocity:{" "}
                            <strong className="text-primary-600">{proj.velocityScore} pts</strong>
                          </span>
                        </div>
                        <Progress value={proj.progressPercentage} className="h-2" />
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                      {/* Milestones Checklist */}
                      <div>
                        <h4 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-2.5">
                          Milestones & Execution Roadmap
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {proj.milestones.map((m) => (
                            <div
                              key={m.id}
                              onClick={() => handleToggleMilestone(proj.id, m.id, m.isCompleted)}
                              className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                m.isCompleted
                                  ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                                  : "bg-surface-50/60 border-surface-200 hover:bg-surface-100 text-surface-800"
                              }`}
                            >
                              {m.isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="h-4 w-4 text-surface-400 shrink-0 mt-0.5" />
                              )}
                              <span className={m.isCompleted ? "line-through text-surface-500" : "font-medium"}>
                                {m.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Progress Evaluator Feedback */}
                      {latestLog && latestLog.aiProgressFeedback && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-primary-50/70 to-accent-50/40 border border-primary-200/80">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="h-4 w-4 text-primary-600" />
                            <span className="text-xs font-bold text-surface-900">
                              AI Velocity Evaluation & Daily Pacing Feedback
                            </span>
                            <span className="text-[11px] text-surface-400 ml-auto">
                              Logged on {new Date(latestLog.logDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-surface-700 leading-relaxed italic">
                            &ldquo;{latestLog.aiProgressFeedback}&rdquo;
                          </p>
                          <div className="mt-2 text-[11px] text-surface-500 flex flex-wrap gap-3">
                            <span>Tasks completed: <strong>{latestLog.tasksCompleted}</strong></span>
                            {latestLog.gitCommitSha && <span>• Commit: <code className="font-mono bg-white px-1 rounded">{latestLog.gitCommitSha}</code></span>}
                          </div>
                        </div>
                      )}

                      {/* Hardware specs note if any */}
                      {proj.hardwareSpecs && (
                        <div className="p-3 bg-surface-50 rounded-lg border border-surface-200 text-xs">
                          <span className="font-semibold text-surface-800 flex items-center gap-1.5 mb-1">
                            <Cpu className="h-3.5 w-3.5 text-amber-600" />
                            Hardware Specifications & Schematics:
                          </span>
                          <p className="text-surface-600 leading-relaxed">{proj.hardwareSpecs}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EXPLORE AI SUGGESTED PROJECT IDEAS */}
      {activeTab === "explore" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-surface-50 rounded-xl border border-surface-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-surface-600">Smart India Hackathon:</span>
              <button
                onClick={() => setSihFilter(!sihFilter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  sihFilter
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-surface-700 border-surface-300 hover:bg-surface-100"
                }`}
              >
                {sihFilter ? "✓ Showing SIH Challenges Only" : "Show All Project Types"}
              </button>
            </div>
            <p className="text-xs text-surface-500">
              Projects automatically scored against your profile skills & hobbies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.map((idea) => (
              <Card key={idea.id} className="flex flex-col hover:border-primary-300 transition-all border-surface-200">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-xs">
                        {idea.domain.replace("_", " ")}
                      </Badge>
                      {idea.isSihChallenge && (
                        <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs">
                          SIH Challenge
                        </Badge>
                      )}
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                      {idea.matchPercentage}% Skill Match
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-snug">{idea.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-3 mt-1 leading-relaxed">
                    {idea.problemStatement}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col justify-between pt-0">
                  <div className="space-y-3">
                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {idea.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-surface-100 text-surface-700 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {idea.hardwareRequirements && (
                      <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-900">
                        <strong>Hardware Spec:</strong> {idea.hardwareRequirements}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-surface-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-surface-500">
                      Est. Effort: <strong>{idea.estimatedHours} hrs</strong>
                    </span>
                    <Button onClick={() => handleAdoptIdea(idea)} size="sm" className="gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      Adopt & Start Build
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Daily Log Work Modal */}
      <Dialog open={logModalOpen} onOpenChange={setLogModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Daily Project Work</DialogTitle>
            <DialogDescription>
              Record your daily engineering tasks. The AI evaluates your cadence and calculates velocity points!
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogDailyWork} className="space-y-4 py-2">
            <Input
              type="number"
              step="0.5"
              min="0.5"
              max="16"
              label="Hours Worked Today *"
              required
              value={logForm.hoursSpent}
              onChange={(e) => setLogForm({ ...logForm, hoursSpent: e.target.value })}
            />
            <Textarea
              label="What tasks did you complete? *"
              required
              rows={3}
              placeholder="e.g. Built PostGIS spatial index, set up Redis cache-aside routine, benchmarked query latency under 15ms..."
              value={logForm.tasksCompleted}
              onChange={(e) => setLogForm({ ...logForm, tasksCompleted: e.target.value })}
            />
            <Input
              label="Any blockers or bugs encountered? (optional)"
              placeholder="e.g. Memory leak during long-lived WebSocket connections"
              value={logForm.blockers}
              onChange={(e) => setLogForm({ ...logForm, blockers: e.target.value })}
            />
            <Input
              label="Git Commit SHA or PR link (optional)"
              placeholder="e.g. a8f391b or https://github.com/.../commit/..."
              value={logForm.gitCommitSha}
              onChange={(e) => setLogForm({ ...logForm, gitCommitSha: e.target.value })}
              hint="Linking commits boosts evidence verification"
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setLogModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={submittingLog}>
                Submit Daily Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Custom Project Modal */}
      <Dialog open={newProjectModalOpen} onOpenChange={setNewProjectModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Initialize Custom Project</DialogTitle>
            <DialogDescription>
              Create your own software, hardware, or hackathon project from scratch.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCustomProject} className="space-y-4 py-2">
            <Input
              label="Project Title *"
              required
              placeholder="e.g. High-Concurrency Distributed Rate Limiter"
              value={customForm.title}
              onChange={(e) => setCustomForm({ ...customForm, title: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Domain</label>
                <select
                  className="w-full h-10 rounded-lg border border-surface-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  value={customForm.domain}
                  onChange={(e) => setCustomForm({ ...customForm, domain: e.target.value })}
                >
                  <option value="FULLSTACK">Full Stack</option>
                  <option value="BACKEND">Backend Systems</option>
                  <option value="FRONTEND">Frontend Web</option>
                  <option value="AI_ML">AI / Machine Learning</option>
                  <option value="HARDWARE_IOT">Hardware & IoT</option>
                  <option value="CLOUD_DEVOPS">Cloud & DevOps</option>
                  <option value="CYBERSECURITY">Cybersecurity</option>
                  <option value="SIH_CHALLENGE">Smart India Hackathon</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Type</label>
                <select
                  className="w-full h-10 rounded-lg border border-surface-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  value={customForm.projectType}
                  onChange={(e) => setCustomForm({ ...customForm, projectType: e.target.value })}
                >
                  <option value="SOFTWARE">Software</option>
                  <option value="HARDWARE">Hardware Only</option>
                  <option value="HYBRID">Hybrid (HW + SW)</option>
                </select>
              </div>
            </div>
            <Textarea
              label="Problem Statement & Architecture *"
              required
              rows={3}
              placeholder="Describe the problem being solved, system architecture, and intended tech stack..."
              value={customForm.description}
              onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="GitHub Repo URL"
                placeholder="https://github.com/..."
                value={customForm.repoUrl}
                onChange={(e) => setCustomForm({ ...customForm, repoUrl: e.target.value })}
              />
              <Input
                label="Live Demo URL"
                placeholder="https://..."
                value={customForm.liveDemoUrl}
                onChange={(e) => setCustomForm({ ...customForm, liveDemoUrl: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewProjectModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
