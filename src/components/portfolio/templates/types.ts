export interface PortfolioTemplateProps {
  user: {
    username: string;
    email?: string | null;
    name: string;
    headline: string;
    about: string;
    city?: string | null;
    country?: string | null;
    profilePhotoUrl?: string | null;
    socialProfiles?: { platform: string; url: string }[];
  };
  bannerUrl?: string | null;
  skills: {
    id?: string;
    skill: {
      name: string;
      category?: { name: string };
    };
    overallScore?: number | null;
    assessmentScore?: number | null;
    selfRating?: number | null;
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    domain: string;
    projectType?: string;
    progressPercentage: number;
    totalHoursLogged: number;
    repoUrl?: string | null;
    liveDemoUrl?: string | null;
    status?: string;
    imageUrl?: string | null;
  }[];
  education: {
    id: string;
    institution: string;
    degree?: string | null;
    branch?: string | null;
    type?: string;
    cgpa?: number | null;
    isCurrent?: boolean;
  }[];
  isDashboardPreview?: boolean;
  onShareClick?: () => void;
}

