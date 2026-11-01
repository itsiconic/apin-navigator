/* ================================================
   Shared Validation Schemas
   Used by both frontend and backend.
   ================================================ */

import { z } from "zod";

// ================================================
// Auth
// ================================================

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores"
    ),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.email || data.phone, {
  message: "Please provide either an email or phone number",
  path: ["email"],
});

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Please enter your username, email, or phone"),
  password: z.string().min(1, "Please enter your password"),
});

export const otpVerifySchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ================================================
// Profile
// ================================================

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  preferredName: z.string().max(50).optional(),
  profilePhotoUrl: z.string().optional().nullable(),
  headline: z.string().max(200).optional(),
  about: z.string().max(2000).optional(),
  careerObjective: z.string().max(2000).optional(),
  country: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export const educationSchema = z.object({
  type: z.enum([
    "CLASS_10",
    "CLASS_12",
    "DIPLOMA",
    "BACHELORS",
    "MASTERS",
    "PHD",
    "CERTIFICATION",
    "OTHER",
  ]),
  institution: z.string().min(1, "Institution is required").max(200),
  degree: z.string().max(200).optional(),
  branch: z.string().max(200).optional(),
  specialization: z.string().max(200).optional(),
  board: z.string().max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  yearOrSemester: z.string().optional(),
  cgpa: z.number().min(0).max(10).optional(),
  percentage: z.number().min(0).max(100).optional(),
  coursework: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
});

export const careerGoalSchema = z.object({
  type: z.enum([
    "SHORT_TERM",
    "LONG_TERM",
    "CAREER",
    "SKILL",
    "PROJECT",
    "OTHER",
  ]),
  title: z.string().min(1, "Goal title is required").max(200),
  description: z.string().max(1000).optional(),
  targetDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const interestSchema = z.object({
  name: z.string().min(1, "Interest name is required").max(100),
  category: z.string().optional(),
  examples: z.string().max(1000).optional(),
  isCustom: z.boolean().default(false),
  intensity: z.number().min(1).max(5).optional(),
  careerRelevance: z.boolean().default(false),
});

// ================================================
// Type Exports
// ================================================

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type CareerGoalInput = z.infer<typeof careerGoalSchema>;
export type InterestInput = z.infer<typeof interestSchema>;
