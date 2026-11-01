import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { LiquidGlassBackground } from "@/components/ui/liquid-glass-background";
import "./globals.css";

export const metadata: Metadata = {
  title: "APIN — Academic Project & Internship Navigator",
  description:
    "APIN (Academic Project & Internship Navigator) — Build your academic career profile, assess verified skills, discover projects, find internships, generate tailored resumes, and prepare for interviews — all powered by AI.",
  keywords: [
    "APIN",
    "Academic Project & Internship Navigator",
    "academic projects",
    "internship",
    "resume",
    "skills",
    "AI",
    "portfolio",
    "jobs",
    "students",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-surface-50 text-surface-900 antialiased font-sans relative selection:bg-primary-200 selection:text-primary-900"
      >
        <LiquidGlassBackground />
        <div className="relative z-10 min-h-screen flex flex-col">
          <Providers>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  fontFamily: "var(--font-sans)",
                },
              }}
            />
          </Providers>
        </div>
      </body>
    </html>
  );
}
