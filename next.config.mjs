/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/skills', destination: '/dashboard/skills', permanent: true },
      { source: '/assessments', destination: '/dashboard/assessments', permanent: true },
      { source: '/assessments/:id*', destination: '/dashboard/assessments/:id*', permanent: true },
      { source: '/projects', destination: '/dashboard/projects', permanent: true },
      { source: '/internships', destination: '/dashboard/internships', permanent: true },
      { source: '/jobs', destination: '/dashboard/jobs', permanent: true },
      { source: '/resume', destination: '/dashboard/resume', permanent: true },
      { source: '/portfolio', destination: '/dashboard/portfolio', permanent: true },
      { source: '/applications', destination: '/dashboard/applications', permanent: true },
      { source: '/career', destination: '/dashboard/career', permanent: true },
      { source: '/ai', destination: '/dashboard/ai', permanent: true },
      { source: '/settings', destination: '/dashboard/settings', permanent: true },
      { source: '/profile', destination: '/dashboard/profile', permanent: true },
    ];
  },
};

export default nextConfig;
