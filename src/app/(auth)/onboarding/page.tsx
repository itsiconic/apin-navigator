"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  User,
  GraduationCap,
  Target,
  Heart,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { api, ApiError } from "@/lib/api-client";

const STEPS = [
  { icon: User, label: "Personal", description: "Basic information" },
  { icon: GraduationCap, label: "Education", description: "Academic background" },
  { icon: Target, label: "Career Goals", description: "What you're aiming for" },
  { icon: Heart, label: "Interests", description: "Hobbies & passions" },
  { icon: Check, label: "Complete", description: "You're all set!" },
];

const PREDEFINED_INTERESTS = [
  "Programming", "Web Development", "Mobile Development", "AI / Machine Learning",
  "Data Science", "Cybersecurity", "Cloud Computing", "DevOps", "Blockchain",
  "Game Development", "UI/UX Design", "Graphic Design", "Video Editing",
  "Photography", "Music", "Writing", "Blogging", "Public Speaking",
  "Entrepreneurship", "Startups", "Finance", "Marketing", "Leadership",
  "Sports", "Fitness", "Cooking", "Travel", "Gaming", "Reading",
  "Research", "Robotics", "IoT", "Open Source", "Competitive Programming",
  "Freelancing", "Teaching", "Volunteering", "Social Media",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Personal info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [headline, setHeadline] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  // Education
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [eduType, setEduType] = useState("BACHELORS");
  const [startYear, setStartYear] = useState("");
  const [isCurrent, setIsCurrent] = useState(true);

  // Goals
  const [shortTermGoal, setShortTermGoal] = useState("");
  const [longTermGoal, setLongTermGoal] = useState("");
  const [preferredRoles, setPreferredRoles] = useState("");

  // Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");

  useEffect(() => {
    async function loadProgress() {
      try {
        const user = await api.get<{
          profile: { onboardingStep: number; onboardingComplete: boolean } | null;
        }>("/api/auth/me");
        if (user?.profile?.onboardingComplete) {
          router.push("/dashboard");
          return;
        }
        if (user?.profile?.onboardingStep) {
          setCurrentStep(user.profile.onboardingStep);
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [router]);

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const saveStep = async () => {
    await api.post("/api/profile/onboarding", {
      step: currentStep,
    });
  };

  const handleNext = async () => {
    setSaving(true);
    try {
      // Save data for current step
      switch (currentStep) {
        case 0: // Personal
          await api.put("/api/profile", {
            firstName,
            lastName,
            headline,
            country,
            city,
          });
          break;

        case 1: // Education
          if (institution) {
            await api.post("/api/education", {
              type: eduType,
              institution,
              degree,
              branch,
              startDate: startYear ? `${startYear}-08-01` : undefined,
              isCurrent,
            });
          }
          break;

        case 2: // Goals
          if (shortTermGoal) {
            await api.post("/api/career-goals", {
              type: "SHORT_TERM",
              title: shortTermGoal,
            });
          }
          if (longTermGoal) {
            await api.post("/api/career-goals", {
              type: "LONG_TERM",
              title: longTermGoal,
            });
          }
          break;

        case 3: // Interests
          if (selectedInterests.length > 0) {
            await api.post(
              "/api/interests",
              selectedInterests.map((name) => ({
                name,
                isCustom: !PREDEFINED_INTERESTS.includes(name),
                careerRelevance: true,
              }))
            );
          }
          break;
      }

      if (currentStep < STEPS.length - 2) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        await saveStep();
      } else if (currentStep === STEPS.length - 2) {
        // Move to completion step
        setCurrentStep(STEPS.length - 1);
        await api.post("/api/profile/onboarding", {
          step: STEPS.length - 1,
          complete: true,
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        // Non-critical — allow user to continue on validation errors for optional data
        if (currentStep > 0) {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          await saveStep();
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Could not save. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    await api.post("/api/profile/onboarding", { step: nextStep });
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !selectedInterests.includes(trimmed)) {
      setSelectedInterests((prev) => [...prev, trimmed]);
      setCustomInterest("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="h-8 w-8 rounded-full border-2 border-surface-200 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-surface-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-surface-900">
                Career<span className="text-primary-600">IQ</span>
              </span>
            </div>
            <span className="text-sm text-surface-400">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
          {/* Step Indicators */}
          <div className="flex justify-between mt-3">
            {STEPS.map((step, idx) => (
              <div
                key={step.label}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  idx <= currentStep
                    ? "text-primary-600"
                    : "text-surface-300"
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                    idx < currentStep
                      ? "bg-primary-600 text-white"
                      : idx === currentStep
                      ? "bg-primary-100 text-primary-700 ring-2 ring-primary-300"
                      : "bg-surface-100 text-surface-400"
                  }`}
                >
                  {idx < currentStep ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-surface-900">
            {STEPS[currentStep].label}
          </h1>
          <p className="text-surface-500 mt-1">
            {STEPS[currentStep].description}
          </p>
        </div>

        {/* Step 0: Personal */}
        {currentStep === 0 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <Input
                label="Professional Headline"
                placeholder="e.g. Computer Science Student | Full-Stack Developer"
                hint="A short tagline for your profile"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Country"
                  placeholder="India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                <Input
                  label="City"
                  placeholder="Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Education */}
        {currentStep === 1 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Education Type
                </label>
                <select
                  value={eduType}
                  onChange={(e) => setEduType(e.target.value)}
                  className="w-full h-10 rounded-lg border border-surface-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="CLASS_10">Class 10</option>
                  <option value="CLASS_12">Class 12</option>
                  <option value="DIPLOMA">Diploma</option>
                  <option value="BACHELORS">Bachelor&apos;s Degree</option>
                  <option value="MASTERS">Master&apos;s Degree</option>
                  <option value="PHD">PhD</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <Input
                label="Institution"
                placeholder="e.g. IIT Delhi, MIT, Stanford University"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Degree"
                  placeholder="e.g. B.Tech, B.Sc, BBA"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                />
                <Input
                  label="Branch / Major"
                  placeholder="e.g. Computer Science"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Start Year"
                  placeholder="2023"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                />
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    checked={isCurrent}
                    onChange={(e) => setIsCurrent(e.target.checked)}
                    className="h-4 w-4 rounded border-surface-300 text-primary-600"
                  />
                  <label htmlFor="isCurrent" className="text-sm text-surface-700">
                    Currently studying here
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Career Goals */}
        {currentStep === 2 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <Input
                label="Short-term Goal (next 6-12 months)"
                placeholder="e.g. Get a software engineering internship"
                value={shortTermGoal}
                onChange={(e) => setShortTermGoal(e.target.value)}
              />
              <Input
                label="Long-term Goal (next 3-5 years)"
                placeholder="e.g. Become a full-stack developer at a top tech company"
                value={longTermGoal}
                onChange={(e) => setLongTermGoal(e.target.value)}
              />
              <Input
                label="Preferred Roles (comma-separated)"
                placeholder="e.g. Software Developer, Data Analyst, Product Manager"
                value={preferredRoles}
                onChange={(e) => setPreferredRoles(e.target.value)}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 3: Interests */}
        {currentStep === 3 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-surface-500">
                Select interests that reflect your passions and career direction.
              </p>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      selectedInterests.includes(interest)
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              {/* Custom Interest */}
              <div className="flex gap-2 pt-2">
                <Input
                  placeholder="Add custom interest..."
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomInterest()}
                />
                <Button variant="outline" onClick={addCustomInterest}>
                  Add
                </Button>
              </div>

              {/* Selected Summary */}
              {selectedInterests.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm font-medium text-surface-700 mb-2">
                    Selected ({selectedInterests.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInterests.map((interest) => (
                      <Badge key={interest} variant="default" className="gap-1">
                        {interest}
                        <button
                          onClick={() => toggleInterest(interest)}
                          className="ml-0.5 hover:text-white/80"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Complete */}
        {currentStep === 4 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-50">
                <Check className="h-8 w-8 text-success-600" />
              </div>
              <h2 className="text-xl font-bold text-surface-900 mb-2">
                You&apos;re all set!
              </h2>
              <p className="text-surface-500 mb-6 max-w-md mx-auto">
                Your career intelligence profile is ready. You can continue adding 
                skills, take assessments, and explore personalized recommendations.
              </p>
              <Button
                size="lg"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        {currentStep < STEPS.length - 1 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {currentStep > 0 && currentStep < STEPS.length - 1 && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
              )}
              <Button onClick={handleNext} loading={saving}>
                {currentStep === STEPS.length - 2 ? "Complete" : "Continue"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
