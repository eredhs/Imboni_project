import { z } from "zod";

export const skillLevelSchema = z.enum([
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
]);

export const languageProficiencySchema = z.enum([
  "Basic",
  "Conversational",
  "Fluent",
  "Native",
]);

export const availabilityStatusSchema = z.enum([
  "Available",
  "Open to Opportunities",
  "Not Available",
]);

export const availabilityTypeSchema = z.enum([
  "Full-time",
  "Part-time",
  "Contract",
]);

export const talentSkillSchema = z.object({
  name: z.string().min(1),
  level: skillLevelSchema,
  yearsOfExperience: z.number().min(0),
}).strict();

export const talentLanguageSchema = z.object({
  name: z.string().min(1),
  proficiency: languageProficiencySchema,
}).strict();

export const talentExperienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}$/),
  endDate: z.string().regex(/^(\d{4}-\d{2}|Present)$/),
  description: z.string().min(1),
  technologies: z.array(z.string().min(1)).min(1),
  isCurrent: z.boolean(),
}).strict();

export const talentEducationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  fieldOfStudy: z.string().min(1),
  startYear: z.number().int().min(1900),
  endYear: z.number().int().min(1900),
}).strict();

export const talentCertificationSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  issueDate: z.string().regex(/^\d{4}-\d{2}$/),
}).strict();

export const talentProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string().min(1)).min(1),
  role: z.string().min(1),
  link: z.string()
    .transform(val => val.trim())
    .refine(val => val === "" || /^https?:\/\/.+/.test(val), {
      message: "Link must be empty or a valid URL"
    })
    .optional()
    .or(z.literal("")),
  startDate: z.string().regex(/^\d{4}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}$/),
}).strict();

export const talentAvailabilitySchema = z.object({
  status: availabilityStatusSchema,
  type: availabilityTypeSchema,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).strict();

export const talentSocialLinksSchema = z
  .object({
    linkedin: z.string()
      .transform(val => val.trim())
      .refine(val => val === "" || /^https?:\/\/.+/.test(val), {
        message: "LinkedIn URL must be empty or a valid URL"
      })
      .optional()
      .or(z.literal(""))
      .nullish(),
    github: z.string()
      .transform(val => val.trim())
      .refine(val => val === "" || /^https?:\/\/.+/.test(val), {
        message: "GitHub URL must be empty or a valid URL"
      })
      .optional()
      .or(z.literal(""))
      .nullish(),
    portfolio: z.string()
      .transform(val => val.trim())
      .refine(val => val === "" || /^https?:\/\/.+/.test(val), {
        message: "Portfolio URL must be empty or a valid URL"
      })
      .optional()
      .or(z.literal(""))
      .nullish(),
  })
  .partial()
  .strict()
  .transform((val) => {
    // Remove empty strings and null/undefined
    const cleaned: Record<string, string> = {};
    if (val.linkedin && val.linkedin.trim()) cleaned.linkedin = val.linkedin;
    if (val.github && val.github.trim()) cleaned.github = val.github;
    if (val.portfolio && val.portfolio.trim()) cleaned.portfolio = val.portfolio;
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  });

export const talentProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  headline: z.string().min(1),
  bio: z.string().optional(),
  location: z.string().min(1),
  skills: z.array(talentSkillSchema).min(1),
  languages: z.array(talentLanguageSchema).optional(),
  experience: z.array(talentExperienceSchema).min(1),
  education: z.array(talentEducationSchema).min(1),
  certifications: z.array(talentCertificationSchema).optional(),
  projects: z.array(talentProjectSchema).min(1),
  availability: talentAvailabilitySchema,
  socialLinks: talentSocialLinksSchema.optional(),
}).strict();

export type TalentProfileRecord = z.infer<typeof talentProfileSchema>;
