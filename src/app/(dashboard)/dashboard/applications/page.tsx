"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Send,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Trash2,
  ArrowRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";

interface OpportunityItem {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: string;
  stipendOrSalary: string;
  applyUrl: string;
  matchScore: number;
  applicationStatus?: string | null;
  appliedAt?: string | null;
}

export default function ApplicationsPipelinePage() {
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchOpps = async () => {
    try {
      const data = await api.get<OpportunityItem[]>("/api/opportunities");
      setOpportunities(data || []);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpps();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.post(`/api/opportunities/${id}/apply`, { status: newStatus });
      toast.success(`Updated status to ${newStatus}`);
      await fetchOpps();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const tracked = opportunities.filter((o) => o.applicationStatus !== null);
  const filtered = tracked.filter((o) => statusFilter === "ALL" || o.applicationStatus === statusFilter);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-50 text-accent-700 border border-accent-200 mb-2 shadow-xs">
            <Sparkles className="h-3 w-3 text-accent-500" />
            <span>APIN Pipeline • Academic Project &amp; Internship Navigator</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Application Pipeline Tracker</h1>
          <p className="text-sm text-surface-500">
            Monitor the status of your internship and job applications across stages.
          </p>
        </div>
        <Link href="/dashboard/internships">
          <Button className="gap-2 button-3d">
            Explore More Opportunities
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-surface-200">
        {[
          { key: "ALL", label: `All Tracked (${tracked.length})` },
          { key: "APPLIED", label: `Applied (${tracked.filter((t) => t.applicationStatus === "APPLIED").length})` },
          { key: "INTERVIEWING", label: `Interviewing (${tracked.filter((t) => t.applicationStatus === "INTERVIEWING").length})` },
          { key: "OFFERED", label: `Offered (${tracked.filter((t) => t.applicationStatus === "OFFERED").length})` },
          { key: "SAVED", label: `Saved (${tracked.filter((t) => t.applicationStatus === "SAVED").length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === tab.key
                ? "bg-primary-600 text-white shadow-xs"
                : "bg-surface-100 text-surface-700 hover:bg-surface-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-3">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-1">No tracked applications in this view</h3>
            <p className="text-sm text-surface-500 max-w-md mx-auto mb-4">
              Browse available tech internships and bookmark or mark them as applied.
            </p>
            <Link href="/dashboard/internships">
              <Button size="sm">Browse Opportunities</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => (
            <Card key={item.id} className="border-surface-200">
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-surface-900 text-base">{item.title}</span>
                    <Badge variant="outline">{item.company}</Badge>
                    <Badge
                      className={`text-xs font-semibold ${
                        item.applicationStatus === "OFFERED"
                          ? "bg-accent-500 text-surface-950 font-bold"
                          : item.applicationStatus === "INTERVIEWING"
                          ? "bg-primary-900 text-accent-300 border border-primary-700/60 font-bold"
                          : item.applicationStatus === "APPLIED"
                          ? "bg-surface-200 text-primary-900 border border-surface-300 font-semibold"
                          : "bg-surface-200 text-surface-800"
                      }`}
                    >
                      {item.applicationStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-500">
                    <span>{item.location} ({item.workMode})</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600">{item.stipendOrSalary}</span>
                    {item.appliedAt && (
                      <>
                        <span>•</span>
                        <span>Applied on: {new Date(item.appliedAt).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    className="h-9 rounded-lg border border-surface-300 bg-white px-2.5 text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    value={item.applicationStatus || "SAVED"}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                  >
                    <option value="SAVED">Saved</option>
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEWING">Interviewing</option>
                    <option value="OFFERED">Offered 🎉</option>
                    <option value="REJECTED">Archived</option>
                  </select>

                  <a href={item.applyUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      Portal
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
