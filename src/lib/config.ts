/* ================================================
   APIN — Academic Project & Internship Navigator Configuration
   Centralized environment variable access.
   Validates required vars at startup.
   ================================================ */

function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getEnvVarOptional(name: string): string | undefined {
  return process.env[name] || undefined;
}

function getEnvInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a number, got: ${raw}`);
  }
  return parsed;
}

export const config = {
  // App
  nodeEnv: getEnvVar("NODE_ENV", "development"),
  appUrl: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  appName: getEnvVar("APP_NAME", "APIN — Academic Project & Internship Navigator"),
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",

  // Database
  databaseUrl: getEnvVar("DATABASE_URL", "postgresql://postgres:password@localhost:5432/career_intelligence?schema=public"),

  // Auth
  jwtSecret: getEnvVar("JWT_SECRET", "dev-secret-change-in-production"),
  jwtExpiresIn: getEnvVar("JWT_EXPIRES_IN", "7d"),
  sessionSecret: getEnvVar("SESSION_SECRET", "dev-session-secret-change-in-production"),

  // OTP
  otpLength: getEnvInt("OTP_LENGTH", 6),
  otpExpiryMinutes: getEnvInt("OTP_EXPIRY_MINUTES", 10),
  otpMaxAttempts: getEnvInt("OTP_MAX_ATTEMPTS", 5),
  otpResendCooldownSeconds: getEnvInt("OTP_RESEND_COOLDOWN_SECONDS", 60),

  // Email
  emailProvider: getEnvVar("EMAIL_PROVIDER", "mock") as "resend" | "smtp" | "mock",
  emailFrom: getEnvVar("EMAIL_FROM", "noreply@apin.dev"),
  resendApiKey: getEnvVarOptional("RESEND_API_KEY"),
  smtpHost: getEnvVarOptional("SMTP_HOST"),
  smtpPort: getEnvInt("SMTP_PORT", 587),
  smtpUser: getEnvVarOptional("SMTP_USER"),
  smtpPass: getEnvVarOptional("SMTP_PASS"),

  // SMS
  smsProvider: getEnvVar("SMS_PROVIDER", "mock") as "twilio" | "mock",

  // AI
  aiProvider: getEnvVar("AI_PROVIDER", "mock") as "openai" | "gemini" | "anthropic" | "mock",
  aiDefaultModel: getEnvVar("AI_DEFAULT_MODEL", "gpt-4o-mini"),
  aiMaxRetries: getEnvInt("AI_MAX_RETRIES", 2),
  aiRequestTimeout: getEnvInt("AI_REQUEST_TIMEOUT_MS", 30000),
  openaiApiKey: getEnvVarOptional("OPENAI_API_KEY"),
  googleAiApiKey: getEnvVarOptional("GOOGLE_AI_API_KEY"),
  anthropicApiKey: getEnvVarOptional("ANTHROPIC_API_KEY"),

  // Storage
  storageProvider: getEnvVar("STORAGE_PROVIDER", "local") as "s3" | "local",

  // Redis
  redisUrl: getEnvVar("REDIS_URL", "redis://localhost:6379"),

  // Rate Limiting
  rateLimitWindowMs: getEnvInt("RATE_LIMIT_WINDOW_MS", 60000),
  rateLimitMaxRequests: getEnvInt("RATE_LIMIT_MAX_REQUESTS", 100),

  // Logging
  logLevel: getEnvVar("LOG_LEVEL", "debug"),
} as const;
