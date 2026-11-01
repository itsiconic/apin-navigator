"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Target,
  Plus,
  Search,
  Sparkles,
  ClipboardCheck,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Trash2,
  Code2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThreeDCard } from "@/components/ui/three-d-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api-client";

interface Subskill {
  id: string;
  name: string;
  slug: string;
}

interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  skills: {
    id: string;
    name: string;
    slug: string;
    subskills: Subskill[];
  }[];
}

interface UserSkillItem {
  id: string;
  skillId: string;
  selfRating: number | null;
  assessmentScore: number | null;
  projectEvidence: number | null;
  overallScore: number | null;
  confidence: number | null;
  skill: {
    id: string;
    name: string;
    slug: string;
    category: {
      name: string;
      slug: string;
    };
    subskills: Subskill[];
  };
}

export default function SkillsPage() {
  const [loading, setLoading] = useState(true);
  const [userSkills, setUserSkills] = useState<UserSkillItem[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Add Skill modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selfRating, setSelfRating] = useState(6);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [skillsData, taxonomyData] = await Promise.all([
        api.get<UserSkillItem[]>("/api/skills?scope=me"),
        api.get<SkillCategory[]>("/api/skills"),
      ]);
      setUserSkills(skillsData || []);
      setCategories(taxonomyData || []);
    } catch {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) {
      toast.error("Please choose a skill");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/skills", {
        skillId: selectedSkillId,
        selfRating,
      });
      toast.success("Skill added to profile");
      setAddModalOpen(false);
      setSelectedSkillId("");
      await fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add skill";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await api.delete(`/api/skills/${id}`);
      toast.success("Skill removed");
      await fetchData();
    } catch {
      toast.error("Failed to remove skill");
    }
  };

  // Filter skills
  const filteredSkills = userSkills.filter((item) => {
    const matchesSearch =
      item.skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skill.subskills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat =
      selectedCategory === "ALL" || item.skill.category.name === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate Metrics
  const totalSkills = userSkills.length;
  const verifiedSkills = userSkills.filter((s) => s.assessmentScore !== null).length;
  const avgScore =
    totalSkills > 0
      ? Math.round(
          userSkills.reduce((acc, s) => acc + (s.overallScore || (s.selfRating || 5) * 10), 0) /
            totalSkills
        )
      : 0;
  const expertCount = userSkills.filter((s) => (s.overallScore || 0) >= 80).length;

  // Available skills to add (not yet in userSkills)
  const existingSkillIds = new Set(userSkills.map((s) => s.skillId));
  const allAvailableSkills = categories.flatMap((cat) =>
    cat.skills
      .filter((s) => !existingSkillIds.has(s.id))
      .map((s) => ({ ...s, categoryName: cat.name }))
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-50 text-accent-700 border border-accent-200 mb-2 shadow-xs">
            <Sparkles className="h-3 w-3 text-accent-500" />
            <span>APIN Skills Engine • Academic Project &amp; Internship Navigator</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Skills &amp; Intelligence Engine</h1>
          <p className="text-sm text-surface-500">
            Track your technical competence across programming, system design, and algorithms with AI verification exams.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/assessments">
            <Button variant="outline" className="gap-2 button-3d">
              <ClipboardCheck className="h-4 w-4 text-primary-600" />
              Assessment Hub
            </Button>
          </Link>
          <Button onClick={() => setAddModalOpen(true)} className="gap-2 button-3d">
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ThreeDCard maxTilt={8} depth={20} glare={true}>
          <Card className="bg-surface-0 border-surface-200 card-interactive h-full">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Total Tracked</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{totalSkills}</p>
              <span className="text-[11px] text-surface-400 mt-1 block">Active technical competencies</span>
            </CardContent>
          </Card>
        </ThreeDCard>
        <ThreeDCard maxTilt={8} depth={20} glare={true}>
          <Card className="bg-surface-0 border-surface-200 card-interactive h-full">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Exam Verified</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{verifiedSkills}</p>
              <span className="text-[11px] text-surface-400 mt-1 block">Backed by proctored tests</span>
            </CardContent>
          </Card>
        </ThreeDCard>
        <ThreeDCard maxTilt={8} depth={20} glare={true}>
          <Card className="bg-surface-0 border-surface-200 card-interactive h-full">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Average APIN Score</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">{avgScore}%</p>
              <span className="text-[11px] text-surface-400 mt-1 block">Aggregated readiness index</span>
            </CardContent>
          </Card>
        </ThreeDCard>
        <ThreeDCard maxTilt={8} depth={20} glare={true}>
          <Card className="bg-surface-0 border-surface-200 card-interactive h-full">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Superior Experts</p>
              <p className="text-2xl font-bold text-accent-600 mt-1">{expertCount}</p>
              <span className="text-[11px] text-surface-400 mt-1 block">Mastery tier ≥ 80%</span>
            </CardContent>
          </Card>
        </ThreeDCard>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-surface-400" />
          <Input
            className="pl-9"
            placeholder="Search skills or subtopics (e.g. React, Generics, Event Loop, SQL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-lg border border-surface-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none w-full sm:w-56"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* User Skills List */}
      {filteredSkills.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-3">
              <Code2 className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-1">
              {userSkills.length === 0 ? "No skills added yet" : "No matching skills found"}
            </h3>
            <p className="text-sm text-surface-500 max-w-md mx-auto mb-4">
              Add your engineering skills to begin taking verified 30-60 question competency exams and unlocking AI project suggestions.
            </p>
            <Button onClick={() => setAddModalOpen(true)} size="sm">
              Add Skills from Taxonomy
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((item) => {
            const hasTested = item.assessmentScore !== null;
            const score = item.overallScore || (item.selfRating ? item.selfRating * 10 : 50);

            // Determine assessment slug (e.g. javascript -> javascript-professional-assessment)
            const assessmentSlug = `${item.skill.slug}-assessment`;

            return (
              <Card key={item.id} className="hover:border-primary-300 transition-all border-surface-200">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-surface-900">{item.skill.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {item.skill.category.name}
                        </Badge>
                        {hasTested ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified ({item.assessmentScore}%)
                          </Badge>
                        ) : (
                          <Badge className="bg-surface-100 text-surface-600 text-xs">
                            Self-Rated ({item.selfRating}/10)
                          </Badge>
                        )}
                      </div>

                      {/* Subskills chips */}
                      {item.skill.subskills && item.skill.subskills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {item.skill.subskills.map((sub) => (
                            <span
                              key={sub.id}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-surface-100 text-surface-600 font-medium"
                            >
                              {sub.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSkill(item.id)}
                      className="text-surface-400 hover:text-danger-600 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-surface-100">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-medium text-surface-600">Competency Intelligence Score</span>
                      <span className="font-bold text-primary-600">{score} / 100</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 flex items-center justify-between gap-2 pt-2">
                    <div className="text-xs text-surface-400">
                      {hasTested ? (
                        <span className="text-emerald-600 font-medium">Exam Cleared</span>
                      ) : (
                        <span>Take exam to verify knowledge</span>
                      )}
                    </div>
                    <Link href={`/dashboard/assessments?skill=${item.skill.slug}`}>
                      <Button size="sm" variant={hasTested ? "outline" : "default"} className="gap-1.5">
                        <ClipboardCheck className="h-3.5 w-3.5" />
                        {hasTested ? "Retake Exam" : "Take Skill Exam"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Skill Dialog */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Skill to Profile</DialogTitle>
            <DialogDescription>
              Select from our curated taxonomy of industry-grade engineering skills.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSkill} className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Choose Skill *
              </label>
              <select
                className="w-full h-10 rounded-lg border border-surface-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                required
              >
                <option value="">-- Select a Skill --</option>
                {allAvailableSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.categoryName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-surface-700">
                  Initial Self-Rating: {selfRating} / 10
                </label>
                <span className="text-xs font-semibold text-primary-600">
                  {selfRating <= 3
                    ? "Beginner"
                    : selfRating <= 6
                    ? "Intermediate"
                    : selfRating <= 8
                    ? "Advanced"
                    : "Superior Expert"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={selfRating}
                onChange={(e) => setSelfRating(parseInt(e.target.value))}
                className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <p className="text-[11px] text-surface-400 mt-1">
                You can back up this self-rating by taking the skill exam anytime!
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                Add to Profile
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
