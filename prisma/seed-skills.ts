/* ================================================
   Skill Taxonomy Seed Data
   Run: npx tsx prisma/seed-skills.ts
   ================================================ */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const taxonomy = [
  {
    name: "Programming Languages",
    slug: "programming-languages",
    icon: "code",
    skills: [
      { name: "JavaScript", slug: "javascript", subskills: ["ES6+", "DOM Manipulation", "Async/Await", "Closures", "Prototypes"] },
      { name: "TypeScript", slug: "typescript", subskills: ["Type System", "Generics", "Utility Types", "Decorators", "Module System"] },
      { name: "Python", slug: "python", subskills: ["Data Structures", "OOP", "Decorators", "List Comprehension", "Type Hints"] },
      { name: "Java", slug: "java", subskills: ["OOP", "Collections", "Streams", "Multithreading", "Spring Boot"] },
      { name: "C++", slug: "cpp", subskills: ["STL", "Pointers", "Memory Management", "Templates", "OOP"] },
      { name: "C", slug: "c", subskills: ["Pointers", "Memory Management", "Data Structures", "File I/O"] },
      { name: "Go", slug: "go", subskills: ["Goroutines", "Channels", "Interfaces", "Error Handling"] },
      { name: "Rust", slug: "rust", subskills: ["Ownership", "Borrowing", "Traits", "Pattern Matching"] },
      { name: "Ruby", slug: "ruby", subskills: ["OOP", "Blocks", "Metaprogramming", "Rails"] },
      { name: "PHP", slug: "php", subskills: ["OOP", "Laravel", "Composer", "RESTful APIs"] },
      { name: "Kotlin", slug: "kotlin", subskills: ["Coroutines", "Null Safety", "Data Classes", "Extensions"] },
      { name: "Swift", slug: "swift", subskills: ["Optionals", "Protocols", "Closures", "SwiftUI"] },
      { name: "R", slug: "r-language", subskills: ["Data Frames", "ggplot2", "Statistical Models", "Tidyverse"] },
      { name: "SQL", slug: "sql", subskills: ["Joins", "Subqueries", "Window Functions", "Indexing", "Optimization"] },
    ],
  },
  {
    name: "Frontend Development",
    slug: "frontend-development",
    icon: "layout",
    skills: [
      { name: "React", slug: "react", subskills: ["Hooks", "Context", "Redux", "Next.js", "Server Components"] },
      { name: "Angular", slug: "angular", subskills: ["Components", "Services", "RxJS", "NgModules", "Routing"] },
      { name: "Vue.js", slug: "vue", subskills: ["Composition API", "Vuex/Pinia", "Router", "Nuxt.js"] },
      { name: "HTML5", slug: "html5", subskills: ["Semantic HTML", "Accessibility", "Forms", "Canvas", "Web APIs"] },
      { name: "CSS3", slug: "css3", subskills: ["Flexbox", "Grid", "Animations", "Responsive Design", "Variables"] },
      { name: "Tailwind CSS", slug: "tailwind", subskills: ["Utility Classes", "Customization", "Responsive", "Dark Mode"] },
      { name: "Svelte", slug: "svelte", subskills: ["Reactivity", "Stores", "SvelteKit", "Transitions"] },
    ],
  },
  {
    name: "Backend Development",
    slug: "backend-development",
    icon: "server",
    skills: [
      { name: "Node.js", slug: "nodejs", subskills: ["Express", "Fastify", "Streams", "Event Loop", "Clustering"] },
      { name: "Django", slug: "django", subskills: ["ORM", "REST Framework", "Templates", "Middleware", "Admin"] },
      { name: "Flask", slug: "flask", subskills: ["Blueprints", "SQLAlchemy", "Jinja2", "RESTful APIs"] },
      { name: "Spring Boot", slug: "spring-boot", subskills: ["IoC", "JPA", "Security", "Actuator", "Microservices"] },
      { name: "Express.js", slug: "express", subskills: ["Routing", "Middleware", "Error Handling", "Authentication"] },
      { name: "FastAPI", slug: "fastapi", subskills: ["Pydantic", "Dependency Injection", "Async", "OpenAPI"] },
      { name: "REST API Design", slug: "rest-api", subskills: ["HTTP Methods", "Status Codes", "Pagination", "Versioning"] },
      { name: "GraphQL", slug: "graphql", subskills: ["Schema", "Resolvers", "Mutations", "Subscriptions"] },
    ],
  },
  {
    name: "Database & Storage",
    slug: "database-storage",
    icon: "database",
    skills: [
      { name: "PostgreSQL", slug: "postgresql", subskills: ["Queries", "Indexes", "Triggers", "JSON", "Performance"] },
      { name: "MongoDB", slug: "mongodb", subskills: ["Aggregation", "Indexes", "Replication", "Schema Design"] },
      { name: "MySQL", slug: "mysql", subskills: ["Queries", "Stored Procedures", "Replication", "Optimization"] },
      { name: "Redis", slug: "redis", subskills: ["Caching", "Pub/Sub", "Data Structures", "Persistence"] },
      { name: "Prisma", slug: "prisma", subskills: ["Schema", "Migrations", "Relations", "Client API"] },
    ],
  },
  {
    name: "DevOps & Cloud",
    slug: "devops-cloud",
    icon: "cloud",
    skills: [
      { name: "Docker", slug: "docker", subskills: ["Containerization", "Compose", "Networking", "Volumes"] },
      { name: "Kubernetes", slug: "kubernetes", subskills: ["Pods", "Services", "Deployments", "Helm"] },
      { name: "AWS", slug: "aws", subskills: ["EC2", "S3", "Lambda", "RDS", "CloudFront"] },
      { name: "CI/CD", slug: "ci-cd", subskills: ["GitHub Actions", "Jenkins", "GitLab CI", "Pipelines"] },
      { name: "Linux", slug: "linux", subskills: ["Shell Scripting", "Networking", "Permissions", "Services"] },
      { name: "Git", slug: "git", subskills: ["Branching", "Merging", "Rebasing", "Workflows", "Hooks"] },
      { name: "Nginx", slug: "nginx", subskills: ["Reverse Proxy", "Load Balancing", "SSL", "Configuration"] },
    ],
  },
  {
    name: "Data Science & ML",
    slug: "data-science-ml",
    icon: "brain",
    skills: [
      { name: "Machine Learning", slug: "machine-learning", subskills: ["Supervised", "Unsupervised", "Feature Engineering", "Model Evaluation"] },
      { name: "Deep Learning", slug: "deep-learning", subskills: ["Neural Networks", "CNN", "RNN", "Transformers"] },
      { name: "Data Analysis", slug: "data-analysis", subskills: ["Pandas", "NumPy", "Visualization", "Statistics"] },
      { name: "NLP", slug: "nlp", subskills: ["Tokenization", "Embeddings", "Transformers", "Sentiment Analysis"] },
      { name: "Computer Vision", slug: "computer-vision", subskills: ["OpenCV", "Image Classification", "Object Detection"] },
      { name: "TensorFlow", slug: "tensorflow", subskills: ["Keras", "Model Building", "Training", "Deployment"] },
      { name: "PyTorch", slug: "pytorch", subskills: ["Tensors", "Autograd", "Models", "Training Loops"] },
    ],
  },
  {
    name: "Mobile Development",
    slug: "mobile-development",
    icon: "smartphone",
    skills: [
      { name: "React Native", slug: "react-native", subskills: ["Components", "Navigation", "State", "Native Modules"] },
      { name: "Flutter", slug: "flutter", subskills: ["Widgets", "State Management", "Animations", "Platform Channels"] },
      { name: "Android (Kotlin)", slug: "android-kotlin", subskills: ["Jetpack Compose", "Room", "ViewModel", "Navigation"] },
      { name: "iOS (Swift)", slug: "ios-swift", subskills: ["SwiftUI", "UIKit", "Core Data", "Combine"] },
    ],
  },
  {
    name: "Design & UX",
    slug: "design-ux",
    icon: "palette",
    skills: [
      { name: "UI Design", slug: "ui-design", subskills: ["Layout", "Typography", "Color Theory", "Iconography"] },
      { name: "UX Research", slug: "ux-research", subskills: ["User Interviews", "Usability Testing", "Personas", "Journey Maps"] },
      { name: "Figma", slug: "figma", subskills: ["Components", "Auto Layout", "Prototyping", "Design Systems"] },
      { name: "Wireframing", slug: "wireframing", subskills: ["Low-fidelity", "High-fidelity", "User Flows", "Information Architecture"] },
    ],
  },
  {
    name: "Soft Skills",
    slug: "soft-skills",
    icon: "users",
    skills: [
      { name: "Communication", slug: "communication", subskills: ["Written", "Verbal", "Presentations", "Technical Writing"] },
      { name: "Problem Solving", slug: "problem-solving", subskills: ["Analytical Thinking", "Creative Solutions", "Debugging", "Root Cause Analysis"] },
      { name: "Teamwork", slug: "teamwork", subskills: ["Collaboration", "Conflict Resolution", "Pair Programming", "Code Reviews"] },
      { name: "Leadership", slug: "leadership", subskills: ["Mentoring", "Decision Making", "Delegation", "Project Management"] },
      { name: "Time Management", slug: "time-management", subskills: ["Prioritization", "Deadlines", "Planning", "Focus"] },
    ],
  },
  {
    name: "Business & Management",
    slug: "business-management",
    icon: "briefcase",
    skills: [
      { name: "Product Management", slug: "product-management", subskills: ["Roadmaps", "Prioritization", "User Stories", "Analytics"] },
      { name: "Marketing", slug: "marketing", subskills: ["Digital Marketing", "SEO", "Content Strategy", "Social Media"] },
      { name: "Finance", slug: "finance", subskills: ["Financial Analysis", "Budgeting", "Accounting", "Investment"] },
      { name: "Entrepreneurship", slug: "entrepreneurship", subskills: ["Business Models", "Pitching", "Market Research", "MVP Development"] },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding skill taxonomy...");

  for (const [catIdx, category] of taxonomy.entries()) {
    const cat = await prisma.skillCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, icon: category.icon, sortOrder: catIdx },
      create: {
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        sortOrder: catIdx,
      },
    });

    for (const [skillIdx, skill] of category.skills.entries()) {
      const s = await prisma.skill.upsert({
        where: { slug: skill.slug },
        update: { name: skill.name, sortOrder: skillIdx, categoryId: cat.id },
        create: {
          categoryId: cat.id,
          name: skill.name,
          slug: skill.slug,
          sortOrder: skillIdx,
        },
      });

      for (const [subIdx, subName] of skill.subskills.entries()) {
        const subSlug = `${skill.slug}-${subName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        await prisma.skillSubskill.upsert({
          where: {
            skillId_slug: { skillId: s.id, slug: subSlug },
          },
          update: { name: subName, sortOrder: subIdx },
          create: {
            skillId: s.id,
            name: subName,
            slug: subSlug,
            sortOrder: subIdx,
          },
        });
      }
    }
  }

  console.log("✅ Skill taxonomy seeded successfully.");
}

seed()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
