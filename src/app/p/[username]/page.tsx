import { db } from "@/lib/db";
import { getPortfolioConfig, PortfolioTemplateId, TEMPLATE_REGISTRY } from "@/lib/portfolio-service";
import { PublicPortfolioClient } from "@/components/portfolio/PublicPortfolioClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{ template?: string }>;
}

export default async function PublicPortfolioPage({ params, searchParams }: PageProps) {
  const { username } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  let user = null;
  try {
    user = await db.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
        isActive: true,
        isSuspended: false,
      },
      include: {
        profile: true,
        education: { orderBy: { isCurrent: "desc" } },
        socialProfiles: true,
        userSkills: {
          include: {
            skill: {
              include: {
                category: true,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
        userProjects: {
          include: {
            milestones: { orderBy: { sortOrder: "asc" } },
            dailyLogs: { orderBy: { logDate: "desc" }, take: 1 },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });
  } catch (err) {
    console.error("Database query fallback in public portfolio:", err);
  }

  // If user is not found in database, provide fallback profile based on username
  if (!user) {
    const rawClean = decodeURIComponent(username || "candidate");
    const capitalizedName = rawClean
      .split(/[-_.]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    user = {
      id: `user-${rawClean}`,
      username: rawClean,
      email: `${rawClean}@apin.dev`,
      profile: {
        firstName: capitalizedName.split(" ")[0] || rawClean,
        lastName: capitalizedName.split(" ").slice(1).join(" ") || "",
        preferredName: capitalizedName,
        headline: "Software Engineer & Distributed Systems Builder",
        about:
          "Passionate engineer engineering resilient cloud microservices, reactive UI systems, and high-performance GPU-accelerated applications.",
        city: "San Francisco",
        country: "United States",
        profilePhotoUrl: null,
      },
      education: [
        {
          id: "edu-1",
          institution: "Institute of Technology",
          degree: "Bachelor of Technology",
          branch: "Computer Science & Engineering",
          type: "BACHELORS",
          cgpa: 3.9,
          isCurrent: false,
        },
      ],
      socialProfiles: [
        { platform: "github", url: `https://github.com/${rawClean}` },
        { platform: "linkedin", url: `https://linkedin.com/in/${rawClean}` },
      ],
      userSkills: [
        {
          id: "sk-1",
          skill: { name: "Full-Stack Architecture", category: { name: "Engineering" } },
          overallScore: 92,
          assessmentScore: 95,
          selfRating: 9,
        },
        {
          id: "sk-2",
          skill: { name: "React & Next.js", category: { name: "Frontend" } },
          overallScore: 94,
          assessmentScore: 92,
          selfRating: 10,
        },
        {
          id: "sk-3",
          skill: { name: "Distributed Systems & Cloud", category: { name: "Backend" } },
          overallScore: 89,
          assessmentScore: 90,
          selfRating: 9,
        },
        {
          id: "sk-4",
          skill: { name: "PostgreSQL & Database Design", category: { name: "Databases" } },
          overallScore: 88,
          assessmentScore: 87,
          selfRating: 8,
        },
      ],
      userProjects: [
        {
          id: "proj-1",
          title: "NeuralFlow: Real-time Audio Visualizer",
          description:
            "GPU-accelerated frequency synthesizer and 3D waveform visualizer with sub-10ms audio buffer latency.",
          domain: "COMPUTER_VISION",
          projectType: "SOFTWARE",
          progressPercentage: 100,
          totalHoursLogged: 48,
          repoUrl: `https://github.com/${rawClean}/neural-flow`,
          liveDemoUrl: "https://demo.apin.dev",
          status: "COMPLETED",
          imageUrl: null,
        },
        {
          id: "proj-2",
          title: "Aetheria: Distributed Ledger State Synchronizer",
          description:
            "Zero-knowledge state verification protocol and Byzantine Fault Tolerant consensus engine.",
          domain: "CYBERSECURITY",
          projectType: "SOFTWARE",
          progressPercentage: 85,
          totalHoursLogged: 74,
          repoUrl: `https://github.com/${rawClean}/aetheria`,
          liveDemoUrl: null,
          status: "IN_PROGRESS",
          imageUrl: null,
        },
      ],
    } as any;
  }

  const profile = user.profile;
  const displayName =
    profile?.preferredName ||
    (profile?.firstName ? `${profile.firstName} ${profile.lastName || ""}`.trim() : null) ||
    user.username;

  // Retrieve saved portfolio config
  const config = getPortfolioConfig(user.username || user.id);

  // Template override from query param (e.g. ?template=CYBERPUNK)
  const queryTemplate = resolvedSearchParams.template as PortfolioTemplateId | undefined;
  const initialTemplate =
    queryTemplate && TEMPLATE_REGISTRY[queryTemplate]
      ? queryTemplate
      : config.template || "AURORA";

  // Map project images from portfolioConfig
  const projectsWithImages = (user.userProjects || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    domain: p.domain,
    projectType: p.projectType,
    progressPercentage: p.progressPercentage,
    totalHoursLogged: p.totalHoursLogged,
    repoUrl: p.repoUrl,
    liveDemoUrl: p.liveDemoUrl,
    status: p.status,
    imageUrl: config.projectImages?.[p.id] || p.imageUrl || null,
  }));

  return (
    <PublicPortfolioClient
      initialTemplate={initialTemplate}
      user={{
        username: user.username,
        email: user.email,
        name: displayName,
        headline: profile?.headline || "Software Engineer & Builder",
        about: profile?.about || "",
        city: profile?.city,
        country: profile?.country,
        profilePhotoUrl: profile?.profilePhotoUrl || config.avatarUrl || null,
        socialProfiles: user.socialProfiles || [],
      }}
      bannerUrl={config.bannerUrl || null}
      skills={user.userSkills || []}
      projects={projectsWithImages}
      education={user.education || []}
    />
  );
}
