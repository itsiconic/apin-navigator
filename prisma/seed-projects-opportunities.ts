/* ================================================
   Seed Project Ideas & Sourced Opportunities
   Run: npx tsx prisma/seed-projects-opportunities.ts
   ================================================ */

import {
  PrismaClient,
  ProjectDomain,
  ProjectType,
  AssessmentDifficulty,
  WorkMode,
  OpportunityType,
} from "@prisma/client";

const prisma = new PrismaClient();

const projectIdeas = [
  {
    title: "AI-Powered Disaster Relief Supply Chain Optimizer",
    slug: "sih-ai-disaster-relief-logistics",
    domain: ProjectDomain.SIH_CHALLENGE,
    projectType: ProjectType.SOFTWARE,
    difficulty: AssessmentDifficulty.ADVANCED,
    problemStatement:
      "During natural disasters (floods, cyclones, earthquakes), supply chain bottlenecks and lack of real-time ground truth cause critical medical and food supplies to sit in depots while shelters run dry. Traditional ERP systems fail due to intermittent cellular connectivity.",
    marketNeed:
      "Official Smart India Hackathon problem statement addressing NDRF and civil defense logistics coordination across India.",
    architectureOverview:
      "Built with Next.js, offline-first IndexedDB synchronization via Service Workers, Node.js microservices, Postgres with PostGIS geospatial routing, and GraphHopper for dynamic road obstacle rerouting.",
    techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "PostGIS", "Redis", "Docker"],
    tags: ["SIH", "Disaster Management", "Geospatial", "Offline First", "Full Stack"],
    estimatedHours: 60,
    isSihChallenge: true,
    starterMilestones: [
      { title: "Define Offline Sync Protocol & DB Schema", order: 1 },
      { title: "Build PostGIS Geo-Fence & Depots Dispatch Engine", order: 2 },
      { title: "Implement Driver Progressive Web App with Live Route Tracking", order: 3 },
      { title: "Deploy AI Triage Dashboard & Stress Test with 10k mock updates", order: 4 },
    ],
  },
  {
    title: "Smart Industrial Machine Health Monitor with ESP32 & MQTT",
    slug: "smart-industrial-iot-vibration-monitor",
    domain: ProjectDomain.HARDWARE_IOT,
    projectType: ProjectType.HYBRID,
    difficulty: AssessmentDifficulty.ADVANCED,
    problemStatement:
      "Unplanned manufacturing downtime costs industries billions annually. Legacy factory machines lack native telemetry. Retrofitting expensive commercial SCADA sensors is cost-prohibitive for SMEs.",
    marketNeed:
      "Affordable non-invasive vibration & temperature anomaly detection for CNC machines and motors.",
    architectureOverview:
      "ESP32 microcontroller with MPU6050 accelerometer & DS18B20 temperature probes, streaming FFT frequency analysis over MQTT to an InfluxDB time-series database and Next.js live telemetry dashboard.",
    techStack: ["C++ / Arduino", "ESP32", "FreeRTOS", "MQTT", "Node.js", "InfluxDB", "Recharts"],
    hardwareRequirements:
      "ESP32 NodeMCU, MPU6050 6-Axis Gyro/Accelerometer, DS18B20 Waterproof Temp Sensor, Breadboard, Jumper Wires, 5V DC Regulator.",
    tags: ["IoT", "Hardware", "Edge Computing", "MQTT", "Time Series", "Signal Processing"],
    estimatedHours: 50,
    isSihChallenge: false,
    starterMilestones: [
      { title: "Wire Sensors & Write FreeRTOS Data Sampling Routine on ESP32", order: 1 },
      { title: "Perform On-Chip FFT Calculation to Extract Peak Vibration Harmonics", order: 2 },
      { title: "Set Up Mosquitto MQTT Broker & Backend Telemetry Ingestion Pipeline", order: 3 },
      { title: "Build Live Next.js Waveform Visualizer & Anomaly Alerting Webhook", order: 4 },
    ],
  },
  {
    title: "High-Throughput Distributed Event Log & Message Broker",
    slug: "distributed-event-broker-rust-node",
    domain: ProjectDomain.BACKEND,
    projectType: ProjectType.SOFTWARE,
    difficulty: AssessmentDifficulty.EXPERT,
    problemStatement:
      "Understanding low-level systems programming, append-only commit logs, TCP framing, and partitioning is essential for top-tier backend infrastructure engineering.",
    marketNeed:
      "Demonstrates Kafka-grade systems internals for Senior SDE and Cloud Infrastructure roles.",
    architectureOverview:
      "Custom append-only binary disk storage engine with zero-copy file transfer (sendfile), consumer group offset coordination, TCP socket wire protocol, and in-memory index segmenting.",
    techStack: ["TypeScript", "Node.js", "TCP Sockets", "File System I/O", "Docker", "Jest"],
    tags: ["Distributed Systems", "Kafka", "TCP Protocol", "Storage Engine", "Performance"],
    estimatedHours: 75,
    isSihChallenge: false,
    starterMilestones: [
      { title: "Implement Binary Append-Only Segment Log with .index & .log files", order: 1 },
      { title: "Build Custom Binary TCP Frame Decoder and Connection Multiplexer", order: 2 },
      { title: "Implement Consumer Groups with Leader-Follower Offset Commitments", order: 3 },
      { title: "Benchmark Throughput (target > 50,000 msgs/sec) with Load Generator", order: 4 },
    ],
  },
  {
    title: "Autonomous Edge Visual Quality Inspector (Computer Vision)",
    slug: "edge-ai-visual-quality-inspector",
    domain: ProjectDomain.AI_ML,
    projectType: ProjectType.HYBRID,
    difficulty: AssessmentDifficulty.ADVANCED,
    problemStatement:
      "Detecting PCB soldering defects and manufacturing cracks currently relies on tiring manual human inspection prone to error.",
    marketNeed:
      "Edge-deployable lightweight AI inspection models that run at 30+ FPS without expensive cloud GPU server reliance.",
    architectureOverview:
      "YOLOv8 fine-tuned on custom PCB defect dataset, quantized to ONNX / TensorRT format running on edge camera feed with Next.js web review UI and real-time pass/reject mechanical actuator trigger.",
    techStack: ["Python", "PyTorch", "YOLOv8", "OpenCV", "FastAPI", "React", "Docker"],
    hardwareRequirements: "Webcam / USB Industrial Microscope or Raspberry Pi 4 with Camera Module",
    tags: ["Computer Vision", "Deep Learning", "Edge AI", "Quality Control", "OpenCV"],
    estimatedHours: 45,
    isSihChallenge: true,
    starterMilestones: [
      { title: "Collect & Annotate 500+ Defective / Clean PCB Sample Images", order: 1 },
      { title: "Train & Evaluate YOLOv8 Nano Model with Mean Average Precision (mAP) > 92%", order: 2 },
      { title: "Export to ONNX Runtime and Build FastAPI Video Stream Endpoint", order: 3 },
      { title: "Build Web Dashboard with Bounding Box Overlay and Defect Severity Log", order: 4 },
    ],
  },
  {
    title: "Collaborative Real-Time Canvas & Code Architecture Visualizer",
    slug: "realtime-collaborative-code-canvas",
    domain: ProjectDomain.FULLSTACK,
    projectType: ProjectType.SOFTWARE,
    difficulty: AssessmentDifficulty.INTERMEDIATE,
    problemStatement:
      "Distributed engineering teams need low-latency spatial whiteboards where they can visualize architecture, map system dependencies, and execute live code snippets together.",
    marketNeed:
      "Combines Figma-style spatial canvas, Excalidraw-like sketching, and live TypeScript Monaco execution.",
    architectureOverview:
      "Next.js canvas powered by HTML5 Canvas / SVG, CRDT (Conflict-free Replicated Data Types) state synchronization via WebSockets, and sandboxed Web Worker code execution.",
    techStack: ["Next.js", "TypeScript", "WebSockets", "CRDT (Yjs)", "Monaco Editor", "Tailwind CSS"],
    tags: ["Realtime", "CRDT", "Collaboration", "Canvas", "Frontend Architecture"],
    estimatedHours: 40,
    isSihChallenge: false,
    starterMilestones: [
      { title: "Build Infinite Pan-Zoom Canvas with Spatial Grid and Shape Selection", order: 1 },
      { title: "Integrate Yjs CRDT and WebSocket Provider for Multi-Cursor Tracking", order: 2 },
      { title: "Add Interactive Code Execution Block with Monaco Editor in Web Worker", order: 3 },
      { title: "Implement State Export to JSON, SVG, and Shareable Persistent URLs", order: 4 },
    ],
  },
];

const opportunities = [
  {
    title: "Software Engineering Intern — Distributed Systems",
    company: "Zepto Labs",
    companyLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
    location: "Bengaluru, Karnataka",
    workMode: WorkMode.HYBRID,
    type: OpportunityType.INTERNSHIP,
    stipendOrSalary: "₹45,000 / month",
    duration: "6 Months",
    source: "LINKEDIN",
    applyUrl: "https://www.linkedin.com/jobs/view/zepto-sde-intern",
    description:
      "Join our core logistics and order-routing backend team. You will build high-concurrency microservices, write low-latency caching layers with Redis, and optimize PostgreSQL query pipelines for 10-minute delivery routing.",
    requirements: [
      "Solid knowledge of JavaScript/TypeScript, Node.js or Go",
      "Hands-on experience with SQL databases and relational schema design",
      "Understanding of concurrency, async queues, and REST/gRPC API contracts",
      "Demonstrated projects with verifiable GitHub repositories",
    ],
    preferredSkills: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker"],
    expertAdvice:
      "For Zepto's technical interview: Expect questions on database indexing (B-Trees vs Hash), caching strategies (Cache-aside vs Write-through), and designing a real-time rate limiter or order dispatch queue. Showcase any project with high-throughput or WebSocket communication!",
  },
  {
    title: "Full-Stack Developer Intern — Payment Platform",
    company: "Razorpay",
    companyLogoUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&h=100&fit=crop",
    location: "Remote / Hybrid",
    workMode: WorkMode.REMOTE,
    type: OpportunityType.INTERNSHIP,
    stipendOrSalary: "₹40,000 / month",
    duration: "4 Months",
    source: "TECH_HIRING",
    applyUrl: "https://razorpay.com/careers/internships",
    description:
      "Work alongside Senior Frontend and Backend Architects on Razorpay checkout interfaces, merchant onboarding dashboards, and payment analytics visualization.",
    requirements: [
      "Proficiency in React.js, Next.js, and TypeScript",
      "Strong understanding of CSS layout, accessibility, and modern component design systems",
      "Familiarity with state management, HTTP headers, and API authentication flows",
    ],
    preferredSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "REST API Design"],
    expertAdvice:
      "Razorpay values pixel-perfect UI precision combined with strict state integrity. Be ready to explain React reconciliation, custom hooks memory lifecycle, and how to build resilient idempotent forms that prevent duplicate payment submissions.",
  },
  {
    title: "AI & Machine Learning Engineering Intern",
    company: "Swiggy Tech",
    companyLogoUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop",
    location: "Bengaluru, Karnataka",
    workMode: WorkMode.HYBRID,
    type: OpportunityType.INTERNSHIP,
    stipendOrSalary: "₹50,000 / month",
    duration: "6 Months",
    source: "LINKEDIN",
    applyUrl: "https://careers.swiggy.com/ai-intern",
    description:
      "Help build recommendation engines, dynamic demand forecasting models, and LLM-assisted conversational bots for millions of daily active users.",
    requirements: [
      "Strong Python programming, NumPy, Pandas, and PyTorch / Scikit-learn",
      "Understanding of Transformer architectures, embeddings, and vector similarity search",
      "Ability to deploy ML models via FastAPI into containerized microservices",
    ],
    preferredSkills: ["Python", "FastAPI", "PyTorch", "Docker", "SQL"],
    expertAdvice:
      "Expect live coding in Python (data structures and algorithmic manipulation), plus a discussion on ML model evaluation metrics (Precision vs Recall in recommendation systems) and latency trade-offs in real-time inference.",
  },
  {
    title: "Embedded Systems & IoT Firmware Engineer Intern",
    company: "Ather Energy",
    companyLogoUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=100&h=100&fit=crop",
    location: "Bengaluru, Karnataka",
    workMode: WorkMode.ONSITE,
    type: OpportunityType.INTERNSHIP,
    stipendOrSalary: "₹35,000 / month",
    duration: "6 Months",
    source: "DIRECT",
    applyUrl: "https://atherenergy.com/careers",
    description:
      "Contribute to smart electric scooter dashboard firmware, telematics data transmission, and battery management sensor calibration.",
    requirements: [
      "Embedded C / C++ programming with microcontrollers (STM32, ESP32)",
      "Knowledge of communication protocols (CAN bus, I2C, SPI, UART)",
      "Basic understanding of hardware schematics and oscilloscopes/multimeters",
    ],
    preferredSkills: ["C++", "C", "ESP32", "MQTT", "Hardware"],
    expertAdvice:
      "Be prepared to explain bitwise operations, interrupt service routines (ISRs), circular ring buffers for sensor data, and low-power sleep modes in battery-operated IoT devices.",
  },
  {
    title: "Junior Backend Engineer (SDE-1)",
    company: "Groww",
    companyLogoUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=100&h=100&fit=crop",
    location: "Bengaluru, Karnataka",
    workMode: WorkMode.HYBRID,
    type: OpportunityType.JUNIOR_ROLE,
    stipendOrSalary: "₹12,00,000 - ₹16,00,000 / year",
    duration: "Full-Time",
    source: "TECH_HIRING",
    applyUrl: "https://groww.in/careers",
    description:
      "Build mission-critical investment ledger services, transactional order-matching engines, and financial reconciliation microservices serving 40M+ active users.",
    requirements: [
      "Proficiency in TypeScript, Node.js, or Go",
      "Solid foundation in relational schema design, ACID transactions, and indexing",
      "Knowledge of distributed message brokers (Kafka/RabbitMQ) and caching",
      "Strong CS fundamentals in Data Structures and Algorithms",
    ],
    preferredSkills: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker", "SQL"],
    expertAdvice:
      "Groww evaluates transaction isolation levels (Repeatable Read vs Serializable), how to prevent double-spending in financial systems, and handling concurrent balance deductions safely with row locks.",
  },
  {
    title: "Frontend Engineer (SDE-1) — Desktop & Web",
    company: "Postman",
    companyLogoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
    location: "Remote / Bengaluru",
    workMode: WorkMode.REMOTE,
    type: OpportunityType.JUNIOR_ROLE,
    stipendOrSalary: "₹14,00,000 - ₹18,00,000 / year",
    duration: "Full-Time",
    source: "LINKEDIN",
    applyUrl: "https://www.postman.com/company/careers",
    description:
      "Design high-performance API client workspaces, collection runners, and live collaborative protocol inspectors used by 30 million developers worldwide.",
    requirements: [
      "Deep understanding of modern JavaScript/TypeScript and React internals",
      "Experience optimizing rendering pipelines, canvas/virtualized lists, and memory leaks",
      "Familiarity with HTTP/2, WebSockets, gRPC, and REST conventions",
    ],
    preferredSkills: ["React", "TypeScript", "Next.js", "WebSockets", "REST API Design"],
    expertAdvice:
      "Postman interviewers look closely at how you handle complex client-side state without lag. Expect to build a live data stream viewer or a virtualized infinite log viewer in React.",
  },
  {
    title: "Associate Cloud DevOps & SRE",
    company: "Freshworks",
    companyLogoUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop",
    location: "Chennai, Tamil Nadu",
    workMode: WorkMode.HYBRID,
    type: OpportunityType.JUNIOR_ROLE,
    stipendOrSalary: "₹10,00,000 - ₹14,00,000 / year",
    duration: "Full-Time",
    source: "DIRECT",
    applyUrl: "https://freshworks.com/careers",
    description:
      "Manage scalable Kubernetes clusters, automated CI/CD pipelines, multi-region cloud security, and Prometheus monitoring infrastructure for SaaS applications.",
    requirements: [
      "Hands-on experience with Linux, Bash/Python scripting, and Docker",
      "Understanding of AWS/GCP cloud primitives (VPC, IAM, ECS/EKS)",
      "Knowledge of infrastructure as code (Terraform) and GitOps principles",
    ],
    preferredSkills: ["Docker", "Linux", "Python", "Cloud Computing", "DevOps"],
    expertAdvice:
      "Focus on explaining zero-downtime deployment strategies (Blue-Green vs Canary), container networking, and diagnosing production HTTP 502/504 gateway errors.",
  },
];

async function main() {
  console.log("🌱 Seeding Project Ideas & Sourced Opportunities...");

  for (const idea of projectIdeas) {
    await prisma.projectIdea.upsert({
      where: { slug: idea.slug },
      update: idea,
      create: idea,
    });
    console.log(`✅ Upserted Project Idea: ${idea.title}`);
  }

  for (const opp of opportunities) {
    const existing = await prisma.opportunity.findFirst({
      where: { title: opp.title, company: opp.company },
    });
    if (!existing) {
      await prisma.opportunity.create({ data: opp });
      console.log(`✅ Created Opportunity: ${opp.title} at ${opp.company}`);
    } else {
      await prisma.opportunity.update({
        where: { id: existing.id },
        data: opp,
      });
      console.log(`✅ Updated Opportunity: ${opp.title} at ${opp.company}`);
    }
  }

  console.log("🎉 Project Ideas & Opportunities seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding projects and opportunities:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
