"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Briefcase,
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
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThreeDCard } from "@/components/ui/three-d-card";
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

export default function InternshipsPage() {
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("ALL");
  const [expandedAdviceId, setExpandedAdviceId] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    try {
      const data = await api.get<OpportunityItem[]>("/api/opportunities");
      setOpportunities(data || []);
    } catch {
      toast.error("Failed to load internships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
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
      await fetchOpportunities();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.preferredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMode = workModeFilter === "ALL" || opp.workMode === workModeFilter;
    return matchesSearch && matchesMode;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-50 text-accent-700 border border-accent-200 mb-2 shadow-xs">
            <Sparkles className="h-3 w-3 text-accent-500" />
            <span>APIN Internship Engine • Academic Project &amp; Internship Navigator</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Internship &amp; Opportunity Matchmaker</h1>
          <p className="text-sm text-surface-500">
            Tech opportunities matched to your verified skills, project progress maps, and academic profile.
          </p>
        </div>
        <Link href="/dashboard/applications">
          <Button variant="outline" className="gap-2 button-3d">
            <Bookmark className="h-4 w-4" />
            My Application Pipeline
          </Button>
        </Link>
      </div>

      {/* Sourcing Banner */}
      <ThreeDCard maxTilt={4} glare={true} depth={15}>
        <Card className="card-interactive bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 text-white border border-primary-700/60 shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-accent-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Sourced via Multi-Portal Aggregator &amp; LinkedIn
                </span>
                <h2 className="text-lg font-bold text-white">
                  Automated Tailored Resume Generation Ready
                </h2>
                <p className="text-xs text-surface-300 max-w-xl">
                  Every listing below can be converted into a bespoke, ATS-optimized PDF resume tailored specifically to its requirements with one click!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-0 text-xs px-3 py-1">
                  LinkedIn Verified
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-xs px-3 py-1">
                  Active Hiring
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </ThreeDCard>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-surface-400" />
          <Input
            className="pl-9"
            placeholder="Search roles, companies (e.g. Zepto, Razorpay), or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-lg border border-surface-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none w-full sm:w-48"
          value={workModeFilter}
          onChange={(e) => setWorkModeFilter(e.target.value)}
        >
          <option value="ALL">All Work Modes</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ONSITE">Onsite</option>
        </select>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {filteredOpps.map((opp) => {
          const isAdviceOpen = expandedAdviceId === opp.id;

          return (
            <Card key={opp.id} className="border-surface-200 hover:border-primary-300 transition-all overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Company Info & Title */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-surface-900 text-lg">{opp.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {opp.company}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          opp.workMode === "REMOTE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-surface-100 text-surface-700"
                        }`}
                      >
                        {opp.workMode}
                      </Badge>
                      <Badge className="bg-primary-50 text-primary-700 border-primary-200 text-xs">
                        Source: {opp.source}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-surface-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {opp.location}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-600">{opp.stipendOrSalary}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {opp.duration}
                      </span>
                    </div>

                    <p className="text-xs text-surface-600 leading-relaxed pt-1">
                      {opp.description}
                    </p>

                    {/* Skill matching chips */}
                    <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[11px] font-medium text-surface-500 mr-1">Skills:</span>
                      {opp.preferredSkills.map((skill) => {
                        const isMatched = opp.matchedSkills.some(
                          (m) => m.toLowerCase() === skill.toLowerCase()
                        );
                        return (
                          <span
                            key={skill}
                            className={`text-[11px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                              isMatched
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-surface-100 text-surface-600"
                            }`}
                          >
                            {isMatched && <Check className="h-2.5 w-2.5 text-emerald-600" />}
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Match Score & Actions */}
                  <div className="flex flex-col items-end gap-3 shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-surface-100">
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-surface-500 block">AI Match Score</span>
                        <span className="text-xl font-bold text-primary-600">{opp.matchScore}%</span>
                      </div>
                      <div className="h-10 w-10 rounded-full border-2 border-primary-500/20 bg-primary-50 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                      <Link href={`/dashboard/resume?oppId=${opp.id}`}>
                        <Button size="sm" variant="marigold" className="gap-1.5 text-xs font-bold shadow-xs">
                          <FileText className="h-3.5 w-3.5" />
                          Tailor Dedicated Resume
                        </Button>
                      </Link>

                      <a href={opp.applyUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                          Direct Apply
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>

                      <Button
                        size="sm"
                        variant={opp.applicationStatus === "APPLIED" ? "secondary" : "ghost"}
                        onClick={() =>
                          handleUpdateStatus(
                            opp.id,
                            opp.applicationStatus === "APPLIED" ? "SAVED" : "APPLIED"
                          )
                        }
                        className="text-xs"
                      >
                        {opp.applicationStatus === "APPLIED" ? "✓ Applied" : "Mark Applied"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expert Advice Toggle Drawer */}
                <div className="mt-4 pt-3 border-t border-surface-100">
                  <button
                    onClick={() =>
                      setExpandedAdviceId(isAdviceOpen ? null : opp.id)
                    }
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                    {isAdviceOpen ? "Hide Expert Advice & Interview Prep" : "View AI Expert Advice & Interview Tips"}
                  </button>

                  {isAdviceOpen && (
                    <div className="mt-3 p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 text-xs text-amber-900 leading-relaxed animate-fade-in space-y-2">
                      <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                        How to Ace the Technical Screen for {opp.company}:
                      </p>
                      <p>{opp.expertAdvice}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
