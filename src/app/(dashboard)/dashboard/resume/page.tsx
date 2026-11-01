"use client";

import { useEffect, useState, use, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Printer,
  Download,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Copy,
  Briefcase,
  Share2,
  Award,
  Layers,
  Heart,
  Globe,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Camera,
  Upload,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";

interface TailoredResumeData {
  header: {
    name: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    photoUrl?: string | null;
    links: {
      github: string;
      linkedin: string;
      portfolio: string;
    };
  };
  targetRole: string;
  targetCompany: string;
  summary: string;
  atsMatchScore: number;
  skills: {
    primary: {
      name: string;
      score: number;
      isVerified: boolean;
      assessmentScore: number | null;
    }[];
    secondary: string[];
  };
  projects: {
    id: string;
    title: string;
    domain: string;
    projectType: string;
    description: string;
    hoursLogged: number;
    progressPercentage: number;
    velocityScore: number;
    repoUrl?: string | null;
    liveDemoUrl?: string | null;
    hardwareSpecs?: string | null;
    completedMilestones: string[];
    bulletPoints: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    branch?: string | null;
    cgpa?: number | null;
    coursework: string[];
    achievements: string[];
    year: string;
  }[];
  hobbies: {
    name: string;
    category?: string | null;
    examples?: string | null;
    careerRelevance: boolean;
  }[];
}

interface OpportunityOption {
  id: string;
  title: string;
  company: string;
}

export default function ResumeBuilderPage() {
  const searchParams = useSearchParams();
  const initialOppId = searchParams.get("oppId") || "";

  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState<TailoredResumeData | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityOption[]>([]);
  const [selectedOppId, setSelectedOppId] = useState<string>(initialOppId);
  const [template, setTemplate] = useState<"MODERN" | "CLASSIC" | "MINIMAL">("MODERN");
  const [resumePhoto, setResumePhoto] = useState<string | null>(null);
  const [showPhotoOnResume, setShowPhotoOnResume] = useState<boolean>(true);
  const [uploadingResumePhoto, setUploadingResumePhoto] = useState<boolean>(false);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  const loadResume = async (oppId: string) => {
    setLoading(true);
    try {
      const url = oppId ? `/api/resume/tailor?oppId=${oppId}` : "/api/resume/tailor";
      const data = await api.get<TailoredResumeData>(url);
      setResumeData(data);
      if (data?.header?.photoUrl && !resumePhoto) {
        setResumePhoto(data.header.photoUrl);
      }
    } catch {
      toast.error("Failed to assemble tailored resume");
    } finally {
      setLoading(false);
    }
  };

  const handleResumePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP, or SVG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    setUploadingResumePhoto(true);
    try {
      // Upload to profile photo endpoint to save and get persistent URL
      const uploadData = new FormData();
      uploadData.append("file", file);
      const res = await api.post<{ profilePhotoUrl: string }>("/api/profile/photo", uploadData);
      setResumePhoto(res.profilePhotoUrl);
      setShowPhotoOnResume(true);
      toast.success("Resume photo uploaded and pasted successfully!");
    } catch {
      // Fallback to client-side data URL if offline or fallback needed
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setResumePhoto(result);
        setShowPhotoOnResume(true);
        toast.success("Resume photo uploaded and pasted successfully!");
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingResumePhoto(false);
      if (resumeFileInputRef.current) resumeFileInputRef.current.value = "";
    }
  };

  const handleRemoveResumePhoto = () => {
    setResumePhoto(null);
    toast.success("Resume photo removed");
  };

  useEffect(() => {
    async function init() {
      try {
        const opps = await api.get<OpportunityOption[]>("/api/opportunities");
        setOpportunities(opps || []);
      } catch {
        // ignore
      }
      await loadResume(selectedOppId);
    }
    init();
  }, []);

  const handleSelectOpportunity = (oppId: string) => {
    setSelectedOppId(oppId);
    loadResume(oppId);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCopyText = () => {
    if (!resumeData) return;
    const text = `
${resumeData.header.name}
${resumeData.header.email} | ${resumeData.header.phone} | ${resumeData.header.location}
Target Role: ${resumeData.targetRole} at ${resumeData.targetCompany}

SUMMARY
${resumeData.summary}

CORE SKILLS
${resumeData.skills.primary.map((s) => `${s.name}${s.isVerified ? " (Verified)" : ""}`).join(", ")}

PROJECTS & ENGINEERING PROGRESS
${resumeData.projects
  .map(
    (p) => `* ${p.title} (${p.hoursLogged}h logged, ${p.progressPercentage}% done)
${p.bulletPoints.map((b) => `  - ${b}`).join("\n")}`
  )
  .join("\n\n")}

EDUCATION
${resumeData.education.map((e) => `* ${e.degree} - ${e.institution} (CGPA: ${e.cgpa || "N/A"})`).join("\n")}

HOBBIES & PRACTICAL EXAMPLES
${resumeData.hobbies.map((h) => `* ${h.name}: ${h.examples}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    toast.success("ATS Plaintext Resume copied to clipboard!");
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-20">
      {/* Non-printable Controls Bar */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-50 text-accent-700 border border-accent-200 mb-2 shadow-xs">
              <Sparkles className="h-3 w-3 text-accent-500" />
              <span>APIN Resume Tailor • Academic Project &amp; Internship Navigator</span>
            </div>
            <h1 className="text-2xl font-bold text-surface-900">AI Tailored Resume Engine</h1>
            <p className="text-sm text-surface-500">
              Generates an ATS-optimized resume tailored to your target internship using verified skills &amp; project progression maps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={handleCopyText} className="gap-1.5 text-xs button-3d">
              <Copy className="h-3.5 w-3.5" />
              Copy ATS Text
            </Button>
            <Button variant="marigold" onClick={handlePrintPdf} className="gap-1.5 text-xs font-bold shadow-md button-3d">
              <Download className="h-3.5 w-3.5" />
              Download Clean PDF
            </Button>
          </div>
        </div>

        {/* Opportunity Target Selector & Template Bar */}
        <Card className="border-surface-200 bg-surface-50/50">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs font-bold text-surface-600 uppercase tracking-wider block">
                Target Opportunity to Tailor For:
              </label>
              <select
                className="w-full h-10 rounded-lg border border-surface-300 bg-white px-3 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={selectedOppId}
                onChange={(e) => handleSelectOpportunity(e.target.value)}
              >
                <option value="">General SDE & Full-Stack Engineering (Default)</option>
                {opportunities.map((opp) => (
                  <option key={opp.id} value={opp.id}>
                    {opp.title} — {opp.company}
                  </option>
                ))}
              </select>
            </div>

            {/* ATS Score & Template Chips */}
            <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-900">
                  ATS Match Score: <strong>{resumeData?.atsMatchScore || 88}%</strong>
                </span>
              </div>

              <div className="flex gap-1 border border-surface-200 rounded-lg p-0.5 bg-white">
                {(["MODERN", "CLASSIC", "MINIMAL"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      template === t ? "bg-primary-600 text-white" : "text-surface-600 hover:bg-surface-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Resume Photo Upload Area */}
        <Card className="border-surface-200 bg-surface-50/70 overflow-hidden">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Photo Preview Thumbnail */}
              <div
                className="relative group shrink-0 cursor-pointer"
                onClick={() => resumeFileInputRef.current?.click()}
                title="Click to upload or change headshot"
              >
                {resumePhoto ? (
                  <div className="relative">
                    <img
                      src={resumePhoto}
                      alt="Resume Headshot Preview"
                      className="h-16 w-16 rounded-xl object-cover border-2 border-primary-500 shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <Camera className="h-5 w-5" />
                    </div>
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-xl border-2 border-dashed border-surface-300 bg-white flex flex-col items-center justify-center text-surface-400 group-hover:border-primary-500 group-hover:text-primary-600 transition-colors">
                    <Camera className="h-6 w-6 mb-0.5 text-surface-400 group-hover:text-primary-600" />
                    <span className="text-[10px] font-semibold">No Photo</span>
                  </div>
                )}
                {uploadingResumePhoto && (
                  <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-white">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-surface-900">Professional Resume Photo</h3>
                  {resumePhoto ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      Pasted on Resume
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-surface-500">
                      Optional Headshot
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-surface-500 mt-0.5 max-w-md">
                  Upload your professional headshot to appear in the header of your printable CV and PDF.
                </p>
                <span className="text-[11px] text-surface-400">Supported: JPG, PNG, WEBP (Square portrait recommended)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <input
                type="file"
                ref={resumeFileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleResumePhotoUpload}
              />
              <Button
                variant="outline"
                size="sm"
                disabled={uploadingResumePhoto}
                onClick={() => resumeFileInputRef.current?.click()}
                className="gap-1.5 text-xs font-semibold button-3d"
              >
                <Upload className="h-3.5 w-3.5" />
                {uploadingResumePhoto ? "Uploading..." : resumePhoto ? "Change Photo" : "Upload Headshot"}
              </Button>

              {resumePhoto && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPhotoOnResume(!showPhotoOnResume)}
                    className="text-xs font-medium"
                  >
                    {showPhotoOnResume ? "Hide Photo" : "Show Photo"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveResumePhoto}
                    className="text-xs text-danger-600 hover:text-danger-700 hover:bg-danger-50 gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Printable Resume Document Paper */}
      {loading || !resumeData ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-surface-200 print:border-none print:shadow-none print:m-0 print:p-0 overflow-hidden">
          <div
            id="resume-canvas"
            className={`p-8 sm:p-12 max-w-[800px] mx-auto text-surface-900 leading-relaxed font-sans ${
              template === "CLASSIC" ? "font-serif" : template === "MINIMAL" ? "font-mono text-xs" : ""
            }`}
          >
            {/* 1. Header */}
            <header className="border-b-2 border-surface-800 pb-5 mb-5 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {resumePhoto && showPhotoOnResume && (
                  <div className="shrink-0">
                    <img
                      src={resumePhoto}
                      alt={resumeData.header.name}
                      className="h-24 w-24 rounded-xl object-cover border-2 border-surface-400 shadow-sm print:shadow-none print:border-surface-600 print:h-24 print:w-24"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-surface-950 uppercase">
                    {resumeData.header.name}
                  </h1>
                  <p className="text-sm font-semibold text-primary-700 tracking-wide mt-0.5">
                    {resumeData.targetRole} candidate for {resumeData.targetCompany}
                  </p>
                </div>
              </div>

              <div className="text-xs text-surface-600 space-y-0.5 sm:text-right font-medium">
                <p className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="h-3 w-3 text-surface-400" />
                  {resumeData.header.email}
                </p>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="h-3 w-3 text-surface-400" />
                  {resumeData.header.phone}
                </p>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <MapPin className="h-3 w-3 text-surface-400" />
                  {resumeData.header.location}
                </p>
                <p className="text-[11px] text-primary-700 font-semibold pt-1">
                  github.com/developer • linkedin.com/in/developer
                </p>
              </div>
            </header>

            {/* 2. Executive Summary */}
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-surface-950 border-b border-surface-300 pb-1 mb-2">
                Professional Summary & Target Focus
              </h2>
              <p className="text-xs text-surface-800 leading-relaxed text-justify">
                {resumeData.summary}
              </p>
            </section>

            {/* 3. Core Competencies & Verified Skills */}
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-surface-950 border-b border-surface-300 pb-1 mb-2">
                Verified Technical Skills & Competencies
              </h2>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {resumeData.skills.primary.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-100 border border-surface-200 font-medium text-surface-900"
                  >
                    {skill.name}
                    {skill.isVerified && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                        ✓ {skill.assessmentScore}% Exam
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </section>

            {/* 4. Engineered Capstone Projects & Daily Progress Maps */}
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-surface-950 border-b border-surface-300 pb-1 mb-3">
                Engineering Projects & Capstone Builds (Progression Verified)
              </h2>
              <div className="space-y-4">
                {resumeData.projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-surface-900 text-sm">{proj.title}</span>
                      <span className="font-semibold text-primary-800 text-[11px]">
                        {proj.hoursLogged}h Logged • {proj.progressPercentage}% Completed • Velocity {proj.velocityScore} pts
                      </span>
                    </div>

                    <p className="text-[11px] text-surface-600 italic">
                      Domain: {proj.domain.replace("_", " ")} | Type: {proj.projectType}
                    </p>

                    <ul className="list-disc pl-4 text-xs text-surface-800 space-y-1 pt-0.5 leading-relaxed">
                      {proj.bulletPoints.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Education */}
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-surface-950 border-b border-surface-300 pb-1 mb-2">
                Academic Qualifications
              </h2>
              <div className="space-y-2">
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs">
                    <div>
                      <p className="font-bold text-surface-900">
                        {edu.degree} {edu.branch ? `in ${edu.branch}` : ""}
                      </p>
                      <p className="text-surface-600">{edu.institution}</p>
                      {edu.coursework && edu.coursework.length > 0 && (
                        <p className="text-[11px] text-surface-500 mt-0.5">
                          Coursework: {edu.coursework.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-surface-700">{edu.year}</span>
                      {edu.cgpa && (
                        <span className="block font-bold text-primary-700">CGPA: {edu.cgpa} / 10.0</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Technical Hobbies & Demonstrated Examples */}
            {resumeData.hobbies && resumeData.hobbies.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-surface-950 border-b border-surface-300 pb-1 mb-2">
                  Technical Hobbies & Practical Maker Demonstrations
                </h2>
                <div className="space-y-1.5 text-xs">
                  {resumeData.hobbies.map((h, idx) => (
                    <p key={idx} className="text-surface-800">
                      <strong className="text-surface-950">{h.name}:</strong>{" "}
                      <span className="italic text-surface-700">{h.examples || "Active self-directed tinkering and research."}</span>
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
