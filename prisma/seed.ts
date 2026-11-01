/* ================================================
   Master Database Seed Script
   Executes all database seeders in sequential order:
   1. Skill Taxonomy & Categories
   2. System Administrator & Email Config
   3. Project Ideas & Opportunities (Internships + Junior Roles)
   4. 30-Question Professional Skill Assessments
   Run: npm run db:seed  (or: npx tsx prisma/seed.ts)
   ================================================ */

import { execSync } from "child_process";
import path from "path";

async function runSeed() {
  console.log("==================================================");
  console.log("🚀 Starting APIN (Academic Project & Internship Navigator) Database Master Seed");
  console.log("==================================================\n");

  const cwd = path.resolve(__dirname, "..");

  const scripts = [
    { name: "1. Skill Taxonomy & Categories", file: "prisma/seed-skills.ts" },
    { name: "2. System Admin & Default Email Config", file: "prisma/seed-admin.ts" },
    { name: "3. Project Ideas & Sourced Opportunities", file: "prisma/seed-projects-opportunities.ts" },
    { name: "4. Professional Assessments & Question Bank", file: "prisma/seed-assessments.ts" },
  ];

  for (const script of scripts) {
    console.log(`\n▶ Running ${script.name}...`);
    try {
      execSync(`npx tsx "${script.file}"`, {
        cwd,
        stdio: "inherit",
        env: { ...process.env },
      });
      console.log(`✔ Finished ${script.name}`);
    } catch (err) {
      console.error(`✖ Failed to run ${script.name}:`, err);
      process.exit(1);
    }
  }

  console.log("\n==================================================");
  console.log("🎉 APIN (Academic Project & Internship Navigator) Database Seeding Complete!");
  console.log("==================================================");
}

runSeed();
