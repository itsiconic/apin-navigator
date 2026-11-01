"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Bookmark,
  Share2,
  Lightbulb,
  Search,
  Filter,
  Check,
  TrendingUp,
  DollarSign,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";

interface OpportunityItem {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string | null;
  location: string;
  workMode: string;
  type: string;
  stipendOrSalary: string;
  duration: string;
  source: string;
  applyUrl: string;
  description: string;
  requirements: string[];
  preferredSkills: string[];
  expertAdvice: string;
  matchScore: number;
  matchedSkills: string[];
  applicationStatus?: string | null;
}

export default function JobsPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<OpportunityItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("ALL");
  const [roleTypeFilter, setRoleTypeFilter] = useState("ALL");
  const [expandedAdviceId, setExpandedAdviceId] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      // Fetch full-time & junior role opportunities
      const data = await api.get<OpportunityItem[]>("/api/opportunities?type=JOB");
      // Fallback: If no explicit JOB types in database yet, get all opportunities
      if (!data || data.length === 0) {
        const allData = await api.get<OpportunityItem[]>("/api/opportunities");
        setJobs(allData || []);
      } else {
        setJobs(data);
      }
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.post(`/api/opportunities/${id}/apply`, {
        status: newStatus,
      });
      toast.success(
        newStatus === "APPLIED"
          ? "Marked as Applied! Added to your applications pipeline."
          : `Saved to ${newStatus.toLowerCase()} list`
      );
      await fetchJobs();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.preferredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMode = workModeFilter === "ALL" || job.workMode === workModeFilter;
    const matchesType = roleTypeFilter === "ALL" || job.type === roleTypeFilter;
    return matchesSearch && matchesMode && matchesType;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-50 text-accent-700 border border-accent-200 mb-2 shadow-xs">
            <Sparkles className="h-3 w-3 text-accent-500" />
            <span>APIN Career Gateway • Academic Project &amp; Internship Navigator</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-surface-900">Software Jobs &amp; Junior Roles</h1>
            <Badge className="bg-primary-50 text-primary-700 border-primary-200 text-xs">
              Direct &amp; Sourced
            </Badge>
          </div>
          <p className="text-sm text-surface-500">
            Graduate SDE-1, Junior Backend, Frontend, and Full-Stack positions evaluated against your verified skill profile.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/applications">
            <Button variant="outline" size="sm" className="gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary-600" />
              Applications Pipeline
            </Button>
          </Link>
          <Link href="/dashboard/resume">
            <Button size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              Tailor Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-surface-400" />
              <Input
                placeholder="Search by job title, company, or tech stack (e.g. React, TypeScript, Go)..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Work Mode Filter */}
              <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-lg text-xs font-medium text-surface-600">
                {["ALL", "REMOTE", "HYBRID", "ONSITE"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setWorkModeFilter(mode)}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      workModeFilter === mode
                        ? "bg-white text-surface-900 shadow-xs font-semibold"
                        : "hover:text-surface-900"
                    }`}
                  >
                    {mode === "ALL" ? "All Modes" : mode}
                  </button>
                ))}
              </div>

              {/* Role Type Filter */}
              <select
                value={roleTypeFilter}
                onChange={(e) => setRoleTypeFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-surface-200 bg-white text-xs font-medium text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="ALL">All Role Types</option>
                <option value="JUNIOR_ROLE">Junior Role</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="APPRENTICESHIP">Apprenticeship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunity Cards Grid */}
      {filteredJobs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-3">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-1">No positions match your filter</h3>
            <p className="text-sm text-surface-500 max-w-sm mx-auto mb-4">
              Try adjusting your search query, location mode, or role type filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setWorkModeFilter("ALL");
                setRoleTypeFilter("ALL");
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job) => {
            const isAdviceOpen = expandedAdviceId === job.id;
            const isApplied = job.applicationStatus === "APPLIED";
            const isSaved = job.applicationStatus === "SAVED";

            return (
              <Card
                key={job.id}
                className="overflow-hidden hover:border-primary-200 hover:shadow-md transition-all border-surface-200"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                    {/* Left: Job & Company Info */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center font-bold text-surface-700 text-lg border border-surface-200 shrink-0">
                          {job.company.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-surface-900">{job.title}</h3>
                            <Badge
                              variant="outline"
                              className="text-xs bg-surface-50 font-medium text-surface-700"
                            >
                              {job.company}
                            </Badge>
                            {isApplied && (
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs gap-1">
                                <Check className="h-3 w-3" />
                                Applied
                              </Badge>
                            )}
                            {isSaved && !isApplied && (
                              <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                                Saved
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-surface-500 mt-1.5">
                            <span className="flex items-center gap-1 font-semibold text-emerald-600">
                              <DollarSign className="h-3.5 w-3.5" />
                              {job.stipendOrSalary}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location} ({job.workMode})
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {job.duration}
                            </span>
                            <span className="text-surface-400">
                              Source: {job.source}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-surface-600 leading-relaxed pt-1">
                        {job.description}
                      </p>

                      {/* Tech Stack / Preferred Skills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-surface-400 mr-1">
                          Stack:
                        </span>
                        {job.preferredSkills.map((skill) => {
                          const isMatched = job.matchedSkills?.some(
                            (s) => s.toLowerCase() === skill.toLowerCase()
                          );
                          return (
                            <Badge
                              key={skill}
                              variant="outline"
                              className={`text-[11px] ${
                                isMatched
                                  ? "bg-primary-50 text-primary-700 border-primary-200 font-semibold"
                                  : "bg-surface-50 text-surface-600"
                              }`}
                            >
                              {isMatched && "✓ "}
                              {skill}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: AI Match Score & Action CTA */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-48 gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-surface-100 shrink-0">
                      <div className="text-left lg:text-right">
                        <div className="flex items-center lg:justify-end gap-1.5">
                          <Sparkles className="h-4 w-4 text-primary-600" />
                          <span className="text-lg font-bold text-surface-900">
                            {job.matchScore}%
                          </span>
                        </div>
                        <p className="text-[11px] text-surface-500">
                          Profile Match Rating
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center lg:flex-col gap-2 w-full">
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full"
                          onClick={() => {
                            if (!isApplied) {
                              handleUpdateStatus(job.id, "APPLIED");
                            }
                          }}
                        >
                          <Button size="sm" className="w-full gap-1.5 text-xs">
                            Apply Directly
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>

                        <div className="flex items-center gap-2 w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs gap-1"
                            onClick={() =>
                              handleUpdateStatus(
                                job.id,
                                isSaved ? "SAVED" : "SAVED"
                              )
                            }
                          >
                            <Bookmark className="h-3 w-3" />
                            {isSaved ? "Saved" : "Save"}
                          </Button>

                          <Link
                            href={`/dashboard/resume?role=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs gap-1 border-primary-200 text-primary-700 hover:bg-primary-50"
                            >
                              <FileText className="h-3 w-3" />
                              Tailor
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Interview Advice */}
                  <div className="mt-4 pt-4 border-t border-surface-100">
                    <button
                      onClick={() =>
                        setExpandedAdviceId(isAdviceOpen ? null : job.id)
                      }
                      className="flex items-center gap-2 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <Lightbulb className="h-3.5 w-3.5" />
                      {isAdviceOpen
                        ? "Hide Technical Interview Guidance"
                        : "Show AI Technical Interview Guidance & Key Focus Areas"}
                    </button>

                    {isAdviceOpen && (
                      <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-primary-50/70 to-accent-50/40 border border-primary-200/80 animate-slide-down space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary-900">
                          <Sparkles className="h-3.5 w-3.5 text-primary-600" />
                          Expert Interview Advice:
                        </div>
                        <p className="text-xs text-surface-700 leading-relaxed">
                          {job.expertAdvice}
                        </p>
                        {job.requirements && job.requirements.length > 0 && (
                          <div className="pt-2">
                            <p className="text-[11px] font-bold text-surface-800 mb-1">
                              Key Role Requirements:
                            </p>
                            <ul className="list-disc pl-4 space-y-0.5 text-xs text-surface-600">
                              {job.requirements.map((req, idx) => (
                                <li key={idx}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
