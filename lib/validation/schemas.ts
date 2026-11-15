import { z } from 'zod';

export const contentIdSchema = z.string().trim().min(1).max(120).regex(/^[a-zA-Z0-9_-]+$/);

export function isSafeDestination(value: string): boolean {
  if (/[\u0000-\u0020\\]/.test(value)) return false;
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch { return false; }
}

export const destinationSchema = z.string().trim().max(2048).refine(isSafeDestination, 'Use a local path or a secure HTTPS URL');
export const imageUrlSchema = destinationSchema;
const optionalDestinationSchema = z.union([destinationSchema, z.literal('')]).optional();
const optionalDateSchema = z.string().refine(value => !value || Number.isFinite(Date.parse(value)), 'Enter a valid date').optional();

/**
 * Phone normalization helper
 * Strips whitespace, brackets, hyphens, and standardizes Indian numbers.
 */
export function normalizePhoneNumber(input: string): string {
  const cleaned = input.trim().replace(/[\s\-\(\)]/g, '');
  // If starts with +91 or 91 with 10 digits following, keep +91
  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    return cleaned;
  }
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  if (/^0[6-9]\d{9}$/.test(cleaned)) {
    return `+91${cleaned.slice(1)}`;
  }
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  // International format with +
  if (/^\+[1-9]\d{6,14}$/.test(cleaned)) {
    return cleaned;
  }
  return cleaned;
}

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name cannot exceed 80 characters'),
  phone: z
    .string()
    .trim()
    .min(8, 'Phone number is too short')
    .max(18, 'Phone number is too long')
    .refine((val) => {
      const normalized = normalizePhoneNumber(val);
      return /^\+[1-9]\d{6,14}$/.test(normalized) || /^[6-9]\d{9}$/.test(val.replace(/[\s\-]/g, ''));
    }, {
      message: 'Please enter a valid 10-digit mobile number or international number with country code.',
    }),
  email: z.string().trim().max(254).email('Invalid email address').optional().or(z.literal('')),
  program: z.string().trim().min(1, 'Please select a program').max(150),
  campus: z.enum(['Puducherry', 'Karaikal'], {
    message: 'Please select either Puducherry or Karaikal campus',
  }),
  message: z.string().trim().max(1000, 'Message cannot exceed 1000 characters').optional().or(z.literal('')),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy to submit your enquiry.',
  }),
  // Bot mitigation honeypot
  institutionRef: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
  idempotencyKey: z.string().min(8).max(100).regex(/^[a-zA-Z0-9_-]+$/).optional(),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

export const staffInviteSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  role: z.enum(['admin', 'editor', 'staff'], {
    message: 'Role must be admin, editor, or staff',
  }),
});

export type StaffInviteFormData = z.infer<typeof staffInviteSchema>;

export const achievementSchema = z.object({
  id: contentIdSchema.optional(),
  updatedAt: z.string().optional(),
  title: z.string().trim().min(3, 'Title is required').max(150),
  slug: z.string().trim().min(3).max(160).regex(/^[a-z0-9\-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  year: z.number().int().min(2000).max(2035),
  category: z.enum(['Events', 'Awards', 'Initiatives', 'Academic']),
  campus: z.enum(['Puducherry', 'Karaikal', 'Both']),
  summary: z.string().trim().max(500).nullish().transform(val => val || '').default(''),
  caption: z.string().trim().max(300).optional(),
  imageUrl: imageUrlSchema,
  altText: z.string().trim().min(3, 'Alt text is required for accessibility').max(300),
  featured: z.boolean().default(false),
  verificationStatus: z.enum(['verified', 'pending', 'unverified']).default('verified'),
  consentStatus: z.enum(['obtained', 'pending', 'na']).default('obtained'),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  sortOrder: z.number().int().default(0),
  version: z.number().int().default(1),
});

export type AchievementFormData = z.infer<typeof achievementSchema>;

export const bannerSchema = z.object({
  id: contentIdSchema.optional(),
  updatedAt: z.string().optional(),
  title: z.string().trim().min(3, 'Title is required').max(120),
  description: z.string().trim().min(5, 'Description is required').max(250),
  desktopImageUrl: imageUrlSchema,
  mobileImageUrl: optionalDestinationSchema,
  focalPoint: z.enum(['center', 'top', 'bottom', 'left', 'right']).default('center'),
  ctaLabel: z.string().trim().min(1, 'CTA label is required').max(50),
  ctaUrl: destinationSchema,
  secondaryCtaLabel: z.string().trim().max(50).optional(),
  secondaryCtaUrl: optionalDestinationSchema,
  startsAt: optionalDateSchema,
  endsAt: optionalDateSchema,
  status: z.enum(['visible', 'hidden']).default('visible'),
  sortOrder: z.number().int().default(0),
  version: z.number().int().default(1),
  achievementId: contentIdSchema.optional().nullable(),
}).refine(value => !value.startsAt || !value.endsAt || Date.parse(value.endsAt) > Date.parse(value.startsAt), {
  path: ['endsAt'], message: 'End date must be after the start date',
});

export type BannerFormData = z.infer<typeof bannerSchema>;

export const founderSchema = z.object({
  id: contentIdSchema.optional(),
  updatedAt: z.string().optional(),
  name: z.string().trim().min(2, 'Founder name is required').max(100),
  title: z.string().trim().min(2, 'Official title is required').max(100),
  qualifications: z.string().trim().max(150).optional(),
  biography: z.string().trim().min(10, 'Biography is required').max(1500),
  message: z.string().trim().min(10, 'Vision message is required').max(1000),
  portraitUrl: imageUrlSchema,
  sortOrder: z.number().int().default(0),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  version: z.number().int().default(1),
});

export type FounderFormData = z.infer<typeof founderSchema>;

export const programSchema = z.object({
  id: contentIdSchema.optional(),
  updatedAt: z.string().optional(),
  title: z.string().trim().min(3).max(120),
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9-]+$/),
  tagline: z.string().trim().min(5).max(150),
  category: z.enum(['neet_ug', 'repeater', 'foundation']),
  targetAudience: z.string().trim().min(3).max(120),
  overview: z.string().trim().min(10).max(2000),
  eligibility: z.string().trim().min(5).max(300),
  curriculum: z.array(z.string().trim().min(1).max(500)).min(1, 'At least one curriculum item is required').max(100),
  features: z.array(z.string().trim().min(1).max(500)).min(1, 'At least one feature is required').max(100),
  scheduleNotice: z.string().max(1000).optional(),
  campuses: z.array(z.enum(['puducherry', 'karaikal'])).min(1, 'Select at least one campus').max(2),
  imageUrl: optionalDestinationSchema,
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  sortOrder: z.number().int().default(0),
  version: z.number().int().default(1),
});

export type ProgramFormData = z.infer<typeof programSchema>;

export const siteSettingsSchema = z.object({
  updatedAt: z.string().optional(),
  siteTitle: z.string().trim().min(3).max(120),
  institutionName: z.string().trim().min(3).max(120),
  tagline: z.string().trim().max(150),
  canonicalOrigin: z.string().url('Must be a valid URL').refine(value => {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash; } catch { return false; }
  }, 'Enter the HTTPS website origin without a path'),
  announcementNotice: z.string().max(250).optional(),
  showAnnouncement: z.boolean().default(false),
  puducherryPlaceId: z.string().trim().max(255),
  karaikalPlaceId: z.string().trim().max(255),
  contactPhones: z.array(z.string().trim().refine(value => /^\+[1-9]\d{6,14}$/.test(normalizePhoneNumber(value)), 'Enter a valid phone number')).min(1).max(10),
  contactEmail: z.string().email(),
  workingHours: z.string().min(3),
  seoDescription: z.string().min(10).max(300),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

export const welcomePopupSchema = z.object({
  isEnabled: z.boolean().default(true),
  title: z.string().trim().min(1, 'Popup title is required').max(120),
  subtitle: z.string().trim().max(250).optional(),
  posterImageUrl: imageUrlSchema,
  posterAltText: z.string().trim().max(150).optional(),
  aspectRatio: z.enum(['16:9', '4:5', '9:16', '1:1']).default('16:9'),
  ctaLabel: z.string().trim().max(50).optional(),
  ctaUrl: optionalDestinationSchema,
  showEnquiryButton: z.boolean().default(true),
  frequency: z.enum(['once_per_session', 'always']).default('once_per_session'),
  startsAt: optionalDateSchema,
  endsAt: optionalDateSchema,
  version: z.number().int().default(1),
  updatedAt: z.string().optional(),
}).refine(value => !value.startsAt || !value.endsAt || Date.parse(value.endsAt) > Date.parse(value.startsAt), {
  path: ['endsAt'], message: 'End date must be after the start date',
});

export type WelcomePopupFormData = z.infer<typeof welcomePopupSchema>;

