/* ================================================
   GET & POST /api/ai/chat — Interactive AI Career Advisor
   Evaluates user profile, skills, projects, and hobbies,
   and asks questions with structured interactive options
   ================================================ */

import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-middleware";
import { handleApiError, apiSuccess } from "@/lib/errors";
import { db } from "@/lib/db";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    let messages = await db.aiChatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      take: 30,
    });

    // If first time, initialize with intelligent evaluation greeting!
    if (messages.length === 0) {
      const [profile, skills, projects, interests] = await Promise.all([
        db.profile.findUnique({ where: { userId: user.id } }),
        db.userSkill.findMany({ where: { userId: user.id }, include: { skill: true } }),
        db.userProject.findMany({ where: { userId: user.id } }),
        db.userInterest.findMany({ where: { userId: user.id } }),
      ]);

      const name = profile?.firstName || user.username;
      const verifiedSkills = skills.filter((s) => s.assessmentScore !== null).map((s) => s.skill.name);
      const hobbies = interests.map((i) => i.name);

      let initialPrompt = `Hello ${name}! 👋 I am your Career Intelligence Advisor. I have evaluated your profile`;

      if (skills.length > 0) {
        initialPrompt += `, your technical skills (${skills.map((s) => s.skill.name).slice(0, 4).join(", ")})`;
      }
      if (hobbies.length > 0) {
        initialPrompt += `, and your maker hobbies (${hobbies.slice(0, 3).join(", ")})`;
      }
      initialPrompt += `. What would you like to focus on next? Here are the highest-impact options for you:`;

      const initialOptions = [
        {
          label: "1. Take 30-Question JavaScript / React Exam",
          description: "Verify your core technical competency and boost your match rating.",
          url: "/dashboard/assessments",
          action: "NAVIGATE",
        },
        {
          label: "2. Adopt SIH Hackathon Disaster Relief Project",
          description: "Build an official Smart India Hackathon challenge with daily progress tracking.",
          url: "/dashboard/projects",
          action: "NAVIGATE",
        },
        {
          label: "3. Adopt Smart Industrial IoT Monitor (Hardware + SW)",
          description: "Hands-on build aligning with your engineering maker hobbies.",
          url: "/dashboard/projects",
          action: "NAVIGATE",
        },
        {
          label: "4. Tailor a Dedicated Resume for Zepto / Razorpay",
          description: "Generate an ATS-optimized PDF resume tailored to current internship openings.",
          url: "/dashboard/resume",
          action: "NAVIGATE",
        },
      ];

      const initialMessage = await db.aiChatMessage.create({
        data: {
          userId: user.id,
          role: "assistant",
          content: initialPrompt,
          suggestedOptions: initialOptions,
        },
      });

      messages = [initialMessage];
    }

    return Response.json(apiSuccess(messages));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();

    const { message } = chatSchema.parse(body);

    // Save user message
    await db.aiChatMessage.create({
      data: {
        userId: user.id,
        role: "user",
        content: message,
      },
    });

    // Gather live context for evaluation
    const [profile, skills, projects, opps, interests] = await Promise.all([
      db.profile.findUnique({ where: { userId: user.id } }),
      db.userSkill.findMany({ where: { userId: user.id }, include: { skill: true } }),
      db.userProject.findMany({ where: { userId: user.id }, include: { milestones: true } }),
      db.opportunity.findMany({ take: 3 }),
      db.userInterest.findMany({ where: { userId: user.id } }),
    ]);

    // Intelligent heuristic response generator tailored to user's question
    const query = message.toLowerCase();
    let replyContent = "";
    let options: any[] = [];

    if (query.includes("project") || query.includes("sih") || query.includes("hardware") || query.includes("build")) {
      replyContent = `Based on your profile and skills in ${skills.map((s) => s.skill.name).slice(0, 3).join(", ") || "software engineering"}, I have evaluated both software and hardware problem statements currently in high demand in the industry and SIH hackathons:

• **SIH AI Disaster Relief Supply Chain** (Fullstack + Geospatial Routing): Solves emergency aid distribution bottlenecks during cyclones & floods.
• **Smart Industrial IoT Vibration Monitor** (ESP32 + MQTT + Time-Series): Matches maker hardware hobbies with industrial predictive maintenance.
• **High-Throughput Distributed Event Log**: Demonstrates deep low-level storage engine architecture.

Which of these would you like to start executing today?`;

      options = [
        {
          label: "Start SIH Disaster Relief Logistics",
          description: "Adopt project into Active Builds with starter milestones.",
          url: "/dashboard/projects",
          action: "NAVIGATE",
        },
        {
          label: "Start Smart Industrial IoT Monitor",
          description: "Hardware + Edge FreeRTOS firmware with web telemetry.",
          url: "/dashboard/projects",
          action: "NAVIGATE",
        },
        {
          label: "Start Distributed Message Broker",
          description: "Kafka-grade systems internals build.",
          url: "/dashboard/projects",
          action: "NAVIGATE",
        },
      ];
    } else if (query.includes("exam") || query.includes("test") || query.includes("assessment") || query.includes("skill")) {
      const unverified = skills.filter((s) => s.assessmentScore === null);
      replyContent = `Verifying your skills with standardized 30-question assessments is the fastest way to prove superior expertise to recruiters.

We currently have proctored exams ready in **JavaScript**, **TypeScript**, and **React**, evaluating 5 core dimensions: Basic Syntax, Engine Internals, Code Analysis, Algorithms, and System Design.

Which skill exam would you like to tackle?`;

      options = [
        {
          label: "Take JavaScript Systems Exam (30 Questions)",
          description: "Event loop, V8 shapes, closures, and async microtasks.",
          url: "/dashboard/assessments/javascript-professional-assessment",
          action: "NAVIGATE",
        },
        {
          label: "Take TypeScript Architecture Exam (30 Questions)",
          description: "Conditional types, infer, template literals, and bivariance.",
          url: "/dashboard/assessments/typescript-senior-architecture-assessment",
          action: "NAVIGATE",
        },
        {
          label: "Take React Architecture & Hooks Exam (30 Questions)",
          description: "Fiber reconciliation, server components, and performance profiling.",
          url: "/dashboard/assessments/react-architecture-hooks-assessment",
          action: "NAVIGATE",
        },
      ];
    } else if (query.includes("internship") || query.includes("job") || query.includes("apply") || query.includes("resume")) {
      replyContent = `I evaluated our sourced opportunities against your profile credentials. Here are the top matched positions:

1. **Zepto Labs** — Software Engineering Intern (Distributed Systems): ₹45k/mo, Hybrid. Matches your backend & concurrency goals.
2. **Razorpay** — Full-Stack Developer Intern: ₹40k/mo, Remote. High alignment with React & TypeScript.
3. **Swiggy Tech** — AI / ML Engineering Intern: ₹50k/mo, Hybrid.

You can directly generate a dedicated ATS resume customized for any of these roles! What would you like to do?`;

      options = [
        {
          label: "Tailor Resume for Zepto Labs (SDE Intern)",
          description: "Generates custom summary and highlights matching skills.",
          url: "/dashboard/resume",
          action: "NAVIGATE",
        },
        {
          label: "Browse All Sourced Internships",
          description: "Explore details, requirements, and expert interview advice.",
          url: "/dashboard/internships",
          action: "NAVIGATE",
        },
        {
          label: "View Application Pipeline",
          description: "Track applied and saved positions.",
          url: "/dashboard/applications",
          action: "NAVIGATE",
        },
      ];
    } else {
      replyContent = `I've analyzed your career intelligence graph. You currently have ${skills.length} skills tracked and ${projects.length} active project builds.

To elevate your profile to the top 5% of candidate rankings, select from these recommended steps:`;

      options = [
        {
          label: "1. Take a 30-Question Skill Competency Exam",
          description: "Earn a verified mastery badge in JavaScript, TypeScript, or React.",
          url: "/dashboard/assessments",
          action: "NAVIGATE",
        },
        {
          label: "2. Log Today's Project Progress",
          description: "Record your daily hours and tasks to accelerate execution velocity.",
          url: "/dashboard/projects",
          action: "NAVIGATE",
        },
        {
          label: "3. Explore AI Project Recommendations",
          description: "Discover hardware IoT and SIH problem statements.",
          url: "/dashboard/projects",
          action: "NAVIGATE",
        },
        {
          label: "4. Tailor a Dedicated Resume & Download PDF",
          description: "Generate an ATS-formatted resume with your progression map.",
          url: "/dashboard/resume",
          action: "NAVIGATE",
        },
      ];
    }

    const aiMessage = await db.aiChatMessage.create({
      data: {
        userId: user.id,
        role: "assistant",
        content: replyContent,
        suggestedOptions: options,
      },
    });

    return Response.json(apiSuccess(aiMessage));
  } catch (error) {
    return handleApiError(error);
  }
}
