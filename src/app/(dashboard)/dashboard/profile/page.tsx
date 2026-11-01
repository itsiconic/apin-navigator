"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import {
  User,
  GraduationCap,
  Target,
  Heart,
  Globe,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  Save,
  Building,
  Calendar,
  Award,
  BookOpen,
  Camera,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api-client";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EducationItem {
  id: string;
  type: string;
  institution: string;
  degree?: string | null;
  branch?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent: boolean;
  cgpa?: number | null;
  percentage?: number | null;
  coursework: string[];
  achievements: string[];
}

interface CareerGoalItem {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  targetDate?: string | null;
  isActive: boolean;
}

interface InterestItem {
  id: string;
  name: string;
  category?: string | null;
  examples?: string | null;
  intensity?: number | null;
  careerRelevance: boolean;
}

interface SocialProfileItem {
  id: string;
  platform: string;
  url: string;
  username?: string | null;
}

interface ProfileData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  preferredName: string | null;
  profilePhotoUrl?: string | null;
  headline: string | null;
  about: string | null;
  careerObjective: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  completionScore: number;
  user: {
    username: string;
    email: string | null;
    phone: string | null;
    education: EducationItem[];
    careerGoals: CareerGoalItem[];
    interests: InterestItem[];
    socialProfiles: SocialProfileItem[];
  };
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<"personal" | "education" | "goals" | "hobbies" | "social">("personal");
  const [savingPersonal, setSavingPersonal] = useState(false);

  // Form states for personal info
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    preferredName: "",
    profilePhotoUrl: "",
    headline: "",
    about: "",
    careerObjective: "",
    country: "",
    state: "",
    city: "",
    gender: "",
    dateOfBirth: "",
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [eduForm, setEduForm] = useState({
    type: "BACHELORS",
    institution: "",
    degree: "",
    branch: "",
    cgpa: "",
    coursework: "",
    achievements: "",
    isCurrent: false,
  });

  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({
    type: "SHORT_TERM",
    title: "",
    description: "",
    targetDate: "",
  });

  const [hobbyModalOpen, setHobbyModalOpen] = useState(false);
  const [hobbyForm, setHobbyForm] = useState({
    name: "",
    category: "Technical / Engineering",
    examples: "",
    intensity: 4,
    careerRelevance: true,
  });

  const [socialForm, setSocialForm] = useState({
    github: "",
    linkedin: "",
    portfolio: "",
    leetcode: "",
  });
  const [savingSocial, setSavingSocial] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await api.get<ProfileData>("/api/profile");
      setProfile(data);
      if (data) {
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          preferredName: data.preferredName || "",
          profilePhotoUrl: data.profilePhotoUrl || "",
          headline: data.headline || "",
          about: data.about || "",
          careerObjective: data.careerObjective || "",
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          gender: data.gender || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
        });
        setSocialForm({
          github: data.user?.socialProfiles?.find((s) => s.platform.toLowerCase() === "github")?.url || "",
          linkedin: data.user?.socialProfiles?.find((s) => s.platform.toLowerCase() === "linkedin")?.url || "",
          portfolio: data.user?.socialProfiles?.find((s) => s.platform.toLowerCase() === "portfolio")?.url || "",
          leetcode: data.user?.socialProfiles?.find((s) => s.platform.toLowerCase() === "leetcode")?.url || "",
        });
      }
    } catch {
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePersonalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPersonal(true);
    try {
      await api.put("/api/profile", formData);
      toast.success("Personal details updated successfully");
      await fetchProfile();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setSavingPersonal(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingPhoto(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await api.post<{ profilePhotoUrl: string }>("/api/profile/photo", uploadData);
      const newPhotoUrl = res.profilePhotoUrl;

      setFormData((prev) => ({ ...prev, profilePhotoUrl: newPhotoUrl }));
      if (profile) {
        setProfile({ ...profile, profilePhotoUrl: newPhotoUrl });
      }
      toast.success("Profile photo updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload photo";
      toast.error(msg);
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    setUploadingPhoto(true);
    try {
      await api.delete("/api/profile/photo");
      setFormData((prev) => ({ ...prev, profilePhotoUrl: "" }));
      if (profile) {
        setProfile({ ...profile, profilePhotoUrl: null });
      }
      toast.success("Profile photo removed");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove photo";
      toast.error(msg);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Education handlers
  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        type: eduForm.type,
        institution: eduForm.institution,
        degree: eduForm.degree || undefined,
        branch: eduForm.branch || undefined,
        cgpa: eduForm.cgpa ? parseFloat(eduForm.cgpa) : undefined,
        coursework: eduForm.coursework
          ? eduForm.coursework.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        achievements: eduForm.achievements
          ? eduForm.achievements.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        isCurrent: eduForm.isCurrent,
      };
      await api.post("/api/education", payload);
      toast.success("Education added");
      setEduModalOpen(false);
      setEduForm({
        type: "BACHELORS",
        institution: "",
        degree: "",
        branch: "",
        cgpa: "",
        coursework: "",
        achievements: "",
        isCurrent: false,
      });
      await fetchProfile();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add education";
      toast.error(msg);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      await api.delete(`/api/education/${id}`);
      toast.success("Education entry removed");
      await fetchProfile();
    } catch {
      toast.error("Failed to remove education");
    }
  };

  // Career Goal handlers
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/career-goals", {
        type: goalForm.type,
        title: goalForm.title,
        description: goalForm.description || undefined,
        targetDate: goalForm.targetDate || undefined,
      });
      toast.success("Career goal added");
      setGoalModalOpen(false);
      setGoalForm({ type: "SHORT_TERM", title: "", description: "", targetDate: "" });
      await fetchProfile();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add goal";
      toast.error(msg);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await api.delete(`/api/career-goals?id=${id}`);
      toast.success("Goal removed");
      await fetchProfile();
    } catch {
      toast.error("Failed to remove goal");
    }
  };

  // Hobbies handlers (Interests with examples)
  const handleAddHobby = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/interests", {
        name: hobbyForm.name,
        category: hobbyForm.category,
        examples: hobbyForm.examples || undefined,
        intensity: hobbyForm.intensity,
        careerRelevance: hobbyForm.careerRelevance,
      });
      toast.success("Hobby / Interest added with real-world examples");
      setHobbyModalOpen(false);
      setHobbyForm({
        name: "",
        category: "Technical / Engineering",
        examples: "",
        intensity: 4,
        careerRelevance: true,
      });
      await fetchProfile();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add hobby";
      toast.error(msg);
    }
  };

  const handleDeleteHobby = async (id: string) => {
    try {
      await api.delete(`/api/interests?id=${id}`);
      toast.success("Hobby removed");
      await fetchProfile();
    } catch {
      toast.error("Failed to remove hobby");
    }
  };

  const handleSocialSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSocial(true);
    try {
      await api.put("/api/profile/social", socialForm);
      toast.success("Social links saved successfully");
      await fetchProfile();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save social links";
      toast.error(msg);
    } finally {
      setSavingSocial(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  const displayName =
    formData.preferredName ||
    (formData.firstName ? `${formData.firstName} ${formData.lastName}` : profile?.user.username) ||
    "User";

  // Calculate dynamic completion score based on actual filled fields
  let completionCount = 0;
  const totalFields = 8;
  if (formData.profilePhotoUrl) completionCount++;
  if (formData.firstName && formData.lastName) completionCount++;
  if (formData.headline) completionCount++;
  if (formData.about || formData.careerObjective) completionCount++;
  if (formData.city || formData.country) completionCount++;
  if (profile?.user.education && profile.user.education.length > 0) completionCount++;
  if (profile?.user.careerGoals && profile.user.careerGoals.length > 0) completionCount++;
  if (profile?.user.interests && profile.user.interests.length > 0) completionCount++;
  const completionPercentage = Math.round((completionCount / totalFields) * 100);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Hero Header Card */}
      <Card className="border-surface-200 overflow-hidden bg-gradient-to-r from-surface-0 via-surface-50 to-primary-50/30">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => photoInputRef.current?.click()}
                title="Click to change profile picture"
              >
                <Avatar className="h-20 w-20 border-2 border-white shadow-md ring-2 ring-primary-500/20 transition-all group-hover:ring-accent-400">
                  {formData.profilePhotoUrl ? (
                    <AvatarImage src={formData.profilePhotoUrl} alt={displayName} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="text-xl font-bold bg-primary-600 text-white">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white">
                  <Camera className="h-6 w-6 drop-shadow-md" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-accent-500 text-primary-950 shadow-md border-2 border-white group-hover:scale-110 transition-transform">
                  <Camera className="h-3.5 w-3.5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-surface-900">{displayName}</h1>
                  <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
                    APIN Verified Candidate
                  </Badge>
                </div>
                <p className="text-sm font-medium text-surface-600 mt-1">
                  {formData.headline || "Aspiring Software Engineer & Tech Innovator"}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-surface-500">
                  <span>@{profile?.user.username}</span>
                  {profile?.user.email && <span>• {profile.user.email}</span>}
                  {formData.city && <span>• {formData.city}, {formData.country}</span>}
                </div>
              </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="w-full sm:w-72 bg-white/80 p-4 rounded-xl border border-surface-200/80 shadow-xs">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-surface-700 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary-600" />
                  APIN Profile Readiness
                </span>
                <span className="text-xs font-bold text-primary-600">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-[11px] text-surface-400 mt-2">
                {completionPercentage >= 85
                  ? "🎉 Stellar profile! Maximizes AI internship matching."
                  : "Add education, goals & hobbies to boost matchmaking."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center border-b border-surface-200 overflow-x-auto gap-2">
        {[
          { id: "personal", label: "Personal Details", icon: User },
          { id: "education", label: `Education (${profile?.user.education.length || 0})`, icon: GraduationCap },
          { id: "goals", label: `Career Goals (${profile?.user.careerGoals.length || 0})`, icon: Target },
          { id: "hobbies", label: `Hobbies & Likings (${profile?.user.interests.length || 0})`, icon: Heart },
          { id: "social", label: "Social Links", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-surface-500 hover:text-surface-900 hover:border-surface-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === "personal" && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Provide comprehensive details required for technical job applications, internship vetting, and verified credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Dedicated Profile Picture Upload Card */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-surface-50/80 border border-surface-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group shrink-0">
                  <Avatar className="h-16 w-16 border-2 border-surface-300 shadow-sm">
                    {formData.profilePhotoUrl ? (
                      <AvatarImage src={formData.profilePhotoUrl} alt={displayName} className="object-cover" />
                    ) : null}
                    <AvatarFallback className="text-lg font-bold bg-primary-600 text-white">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-surface-900 flex items-center gap-2">
                    Profile Picture
                    {formData.profilePhotoUrl && (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                        Active Photo
                      </Badge>
                    )}
                  </h3>
                  <p className="text-xs text-surface-500 mt-0.5">
                    Upload your photo for your APIN profile, portfolio showcase, and resumes.
                  </p>
                  <span className="text-[11px] text-surface-400">Supported: JPG, PNG, WEBP (Max 5MB)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingPhoto}
                  onClick={() => photoInputRef.current?.click()}
                  className="gap-1.5 text-xs font-semibold button-3d"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingPhoto ? "Uploading..." : formData.profilePhotoUrl ? "Change Photo" : "Upload Photo"}
                </Button>

                {formData.profilePhotoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={uploadingPhoto}
                    onClick={handleRemovePhoto}
                    className="text-xs text-danger-600 hover:text-danger-700 hover:bg-danger-50 gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            <form onSubmit={handlePersonalSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Alex"
                />
                <Input
                  label="Last Name *"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Vance"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Preferred Name / Call Name"
                  value={formData.preferredName}
                  onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                  placeholder="e.g. Alex"
                  hint="How peers and recruiters should address you"
                />
                <Input
                  label="Professional Headline"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g. Full-Stack Developer | Next.js & Distributed Systems Enthusiast"
                />
              </div>

              <Textarea
                label="About Me (Bio)"
                rows={3}
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                placeholder="Share your technical background, software development journey, and what drives you..."
                hint="Used by AI to evaluate your background profile and tailor resume introductions"
              />

              <Textarea
                label="Career Objective & Focus Areas"
                rows={2}
                value={formData.careerObjective}
                onChange={(e) => setFormData({ ...formData, careerObjective: e.target.value })}
                placeholder="e.g. Seeking high-impact SDE internship opportunities working on scalable web architectures and real-time collaborative tooling..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Bengaluru / San Francisco"
                />
                <Input
                  label="State / Province"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Karnataka / California"
                />
                <Input
                  label="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. India / United States"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-surface-100">
                <Button type="submit" loading={savingPersonal} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Education Management */}
      {activeTab === "education" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-surface-900">Academic Background</h2>
              <p className="text-sm text-surface-500">
                List degrees, coursework, academic achievements, and grade points for automated resume building.
              </p>
            </div>
            <Button onClick={() => setEduModalOpen(true)} className="gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          </div>

          {profile?.user.education.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-3">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-surface-900 mb-1">No education entries yet</h3>
                <p className="text-sm text-surface-500 max-w-sm mx-auto mb-4">
                  Add your college or high school education to boost your verified applicant profile.
                </p>
                <Button onClick={() => setEduModalOpen(true)} size="sm">
                  Add Education Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {profile?.user.education.map((edu) => (
                <Card key={edu.id} className="hover:border-primary-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-surface-900">{edu.institution}</h3>
                          <Badge variant="outline">{edu.type.replace("_", " ")}</Badge>
                          {edu.isCurrent && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-surface-700">
                          {edu.degree} {edu.branch ? `in ${edu.branch}` : ""}
                        </p>
                        {edu.cgpa && (
                          <p className="text-xs font-semibold text-primary-600">
                            CGPA / Grade: {edu.cgpa} / 10.0
                          </p>
                        )}
                        {edu.coursework && edu.coursework.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                            <span className="text-xs font-medium text-surface-500 mr-1">Key Courses:</span>
                            {edu.coursework.map((course, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {edu.achievements && edu.achievements.length > 0 && (
                          <div className="mt-2 text-xs text-surface-600 space-y-0.5">
                            {edu.achievements.map((ach, idx) => (
                              <p key={idx} className="flex items-center gap-1.5">
                                <Award className="h-3 w-3 text-amber-500 shrink-0" />
                                {ach}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="text-surface-400 hover:text-danger-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Career Goals */}
      {activeTab === "goals" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-surface-900">Career Aspirations & Milestones</h2>
              <p className="text-sm text-surface-500">
                Short and long-term milestones that the AI uses to evaluate recommended projects and internship roles.
              </p>
            </div>
            <Button onClick={() => setGoalModalOpen(true)} className="gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </div>

          {profile?.user.careerGoals.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-3">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-surface-900 mb-1">No career goals set</h3>
                <p className="text-sm text-surface-500 max-w-sm mx-auto mb-4">
                  Define your goals (e.g. &ldquo;Crack SIH Hackathon&rdquo; or &ldquo;Secure Backend SDE Internship&rdquo;).
                </p>
                <Button onClick={() => setGoalModalOpen(true)} size="sm">
                  Add First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile?.user.careerGoals.map((goal) => (
                <Card key={goal.id} className="hover:border-primary-200 transition-colors">
                  <CardContent className="p-5 flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {goal.type.replace("_", " ")}
                        </Badge>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                          Active Target
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-surface-900">{goal.title}</h4>
                      {goal.description && (
                        <p className="text-xs text-surface-600 leading-relaxed">{goal.description}</p>
                      )}
                      {goal.targetDate && (
                        <div className="flex items-center gap-1.5 text-xs text-surface-500 pt-1">
                          <Calendar className="h-3.5 w-3.5 text-surface-400" />
                          <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-surface-400 hover:text-danger-600 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Hobbies & Likings with Examples (User's Exact Specification!) */}
      {activeTab === "hobbies" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-surface-900">Hobbies & Likings with Real-World Examples</h2>
              <p className="text-sm text-surface-500">
                Showcase your technical hobbies, passions, and creative endeavors with concrete examples that demonstrate your maker mindset.
              </p>
            </div>
            <Button onClick={() => setHobbyModalOpen(true)} className="gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Add Hobby / Liking
            </Button>
          </div>

          {profile?.user.interests.length === 0 ? (
            <Card className="border-dashed bg-gradient-to-br from-white to-surface-50">
              <CardContent className="py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-3">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-surface-900 mb-1">No hobbies or likings added</h3>
                <p className="text-sm text-surface-500 max-w-md mx-auto mb-4">
                  Add your engineering hobbies and passions (e.g. IoT Automation, Game Modding, Competitive Chess) along with practical examples of what you built or practiced!
                </p>
                <Button onClick={() => setHobbyModalOpen(true)} size="sm">
                  Add Hobby with Examples
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile?.user.interests.map((hobby) => (
                <Card key={hobby.id} className="hover:border-primary-200 transition-all border-surface-200">
                  <CardContent className="p-5 flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs">
                          {hobby.category || "Hobby"}
                        </Badge>
                        {hobby.careerRelevance && (
                          <Badge className="bg-primary-50 text-primary-700 border-primary-200 text-xs">
                            Career Relevant
                          </Badge>
                        )}
                        <span className="text-xs text-amber-500 font-semibold ml-auto">
                          {"★".repeat(hobby.intensity || 3)}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-surface-900">{hobby.name}</h4>
                      {hobby.examples && (
                        <div className="mt-2 bg-surface-50 rounded-lg p-3 border border-surface-100">
                          <p className="text-xs font-semibold text-surface-700 mb-1 flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-primary-500" />
                            Demonstrated Examples & Artifacts:
                          </p>
                          <p className="text-xs text-surface-600 leading-relaxed italic">
                            &ldquo;{hobby.examples}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteHobby(hobby.id)}
                      className="text-surface-400 hover:text-danger-600 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Social Profiles */}
      {activeTab === "social" && (
        <Card>
          <CardHeader>
            <CardTitle>Professional & Social Profiles</CardTitle>
            <CardDescription>
              Connect your developer profiles (GitHub, LinkedIn, Portfolio, LeetCode) to automatically back up your project evidence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSocialSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="GitHub URL"
                  placeholder="https://github.com/username"
                  value={socialForm.github}
                  onChange={(e) => setSocialForm({ ...socialForm, github: e.target.value })}
                />
                <Input
                  label="LinkedIn Profile"
                  placeholder="https://linkedin.com/in/username"
                  value={socialForm.linkedin}
                  onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })}
                />
                <Input
                  label="Personal Portfolio / Blog"
                  placeholder="https://yourdomain.com"
                  value={socialForm.portfolio}
                  onChange={(e) => setSocialForm({ ...socialForm, portfolio: e.target.value })}
                />
                <Input
                  label="LeetCode / HackerRank"
                  placeholder="https://leetcode.com/username"
                  value={socialForm.leetcode}
                  onChange={(e) => setSocialForm({ ...socialForm, leetcode: e.target.value })}
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" loading={savingSocial}>
                  Save Links
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Education Modal */}
      <Dialog open={eduModalOpen} onOpenChange={setEduModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Academic Education</DialogTitle>
            <DialogDescription>Add details about your degree, institution, and major.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEducation} className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Education Level</label>
              <select
                className="w-full h-10 rounded-lg border border-surface-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={eduForm.type}
                onChange={(e) => setEduForm({ ...eduForm, type: e.target.value })}
              >
                <option value="BACHELORS">Bachelor&apos;s Degree (B.Tech / B.E / B.Sc)</option>
                <option value="MASTERS">Master&apos;s Degree (M.Tech / M.S / MCA)</option>
                <option value="DIPLOMA">Diploma in Engineering</option>
                <option value="CLASS_12">Class 12 / Higher Secondary</option>
                <option value="CLASS_10">Class 10 / Secondary</option>
                <option value="CERTIFICATION">Industry Professional Certification</option>
              </select>
            </div>
            <Input
              label="Institution / University Name *"
              required
              placeholder="e.g. National Institute of Technology"
              value={eduForm.institution}
              onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Degree (optional)"
                placeholder="e.g. B.Tech"
                value={eduForm.degree}
                onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              />
              <Input
                label="Branch / Major"
                placeholder="e.g. Computer Science"
                value={eduForm.branch}
                onChange={(e) => setEduForm({ ...eduForm, branch: e.target.value })}
              />
            </div>
            <Input
              label="CGPA / Percentage (optional)"
              placeholder="e.g. 8.85"
              value={eduForm.cgpa}
              onChange={(e) => setEduForm({ ...eduForm, cgpa: e.target.value })}
            />
            <Input
              label="Key Coursework (comma-separated)"
              placeholder="Data Structures, OS, DBMS, Web Tech"
              value={eduForm.coursework}
              onChange={(e) => setEduForm({ ...eduForm, coursework: e.target.value })}
            />
            <Input
              label="Achievements / Honors (comma-separated)"
              placeholder="Dean's List 2024, Hackathon 1st Place"
              value={eduForm.achievements}
              onChange={(e) => setEduForm({ ...eduForm, achievements: e.target.value })}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEduModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Education</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Goal Modal */}
      <Dialog open={goalModalOpen} onOpenChange={setGoalModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Career Goal</DialogTitle>
            <DialogDescription>Define what you want to achieve next in your software career.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGoal} className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Goal Horizon</label>
              <select
                className="w-full h-10 rounded-lg border border-surface-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={goalForm.type}
                onChange={(e) => setGoalForm({ ...goalForm, type: e.target.value })}
              >
                <option value="SHORT_TERM">Short Term (0 - 6 Months)</option>
                <option value="LONG_TERM">Long Term (1 - 3 Years)</option>
                <option value="CAREER">Dream Role Target</option>
                <option value="SKILL">Skill Mastery Milestone</option>
                <option value="PROJECT">Major Capstone / SIH Project</option>
              </select>
            </div>
            <Input
              label="Goal Title *"
              required
              placeholder="e.g. Win SIH Hackathon with IoT AI Solution"
              value={goalForm.title}
              onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
            />
            <Textarea
              label="Description / Execution Strategy"
              placeholder="Build full MVP, write clean docs, test edge cases, pitch with live demo..."
              value={goalForm.description}
              onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
            />
            <Input
              type="date"
              label="Target Completion Date"
              value={goalForm.targetDate}
              onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGoalModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Target Goal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Hobby Modal (User's Exact Specification!) */}
      <Dialog open={hobbyModalOpen} onOpenChange={setHobbyModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Hobby / Liking with Examples</DialogTitle>
            <DialogDescription>
              Detail your hobbies and creative likings along with real examples of how you engage in them.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddHobby} className="space-y-4 py-2">
            <Input
              label="Hobby / Interest Name *"
              required
              placeholder="e.g. IoT Automation, Drone Building, Competitive Chess"
              value={hobbyForm.name}
              onChange={(e) => setHobbyForm({ ...hobbyForm, name: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Category</label>
              <select
                className="w-full h-10 rounded-lg border border-surface-300 bg-white px-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={hobbyForm.category}
                onChange={(e) => setHobbyForm({ ...hobbyForm, category: e.target.value })}
              >
                <option value="Technical / Engineering">Technical / Engineering</option>
                <option value="Competitive Gaming / Chess">Competitive Gaming / Chess</option>
                <option value="Open Source Tinkering">Open Source Tinkering</option>
                <option value="Creative Design & 3D">Creative Design & 3D</option>
                <option value="Hardware / Embedded">Hardware / Embedded</option>
                <option value="Reading & Research">Reading & Research</option>
              </select>
            </div>
            <Textarea
              label="Demonstrated Examples & What You Made *"
              required
              rows={3}
              placeholder="e.g. Built an automated indoor greenhouse using ESP8266 and MQTT sensors; programmed a custom pathfinding bot for chess analysis."
              value={hobbyForm.examples}
              onChange={(e) => setHobbyForm({ ...hobbyForm, examples: e.target.value })}
              hint="Crucial: The AI reads these examples when recommending project ideas and generating tailored resumes!"
            />
            <div className="flex items-center justify-between pt-2">
              <label className="text-sm font-medium text-surface-700">Career Relevance</label>
              <input
                type="checkbox"
                checked={hobbyForm.careerRelevance}
                onChange={(e) => setHobbyForm({ ...hobbyForm, careerRelevance: e.target.checked })}
                className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setHobbyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Hobby</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
