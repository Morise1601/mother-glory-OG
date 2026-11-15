/**
 * Mother Glory Domain Models & Content Types
 * Aligned with the verified institution requirements.
 */

export type Role = 'admin' | 'editor' | 'staff';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type EnquiryStatus = 'new' | 'contacted' | 'in_progress' | 'closed';

export interface Campus {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  altPhone?: string;
  email: string;
  hours: string;
  mapsUrl: string;
  embedMapUrl: string;
  googlePlaceId: string;
  imageUrl: string;
  isPublished: boolean;
}

export interface Founder {
  id: string;
  name: string;
  title: string;
  qualifications: string;
  biography: string;
  message: string;
  portraitUrl: string;
  sortOrder: number;
  status: ContentStatus;
  version: number;
  updatedAt: string;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: 'neet_ug' | 'repeater' | 'foundation';
  targetAudience: string;
  overview: string;
  eligibility: string;
  curriculum: string[];
  features: string[];
  scheduleNotice?: string;
  campuses: string[]; // campus slugs e.g. ['puducherry', 'karaikal']
  imageUrl?: string;
  status: ContentStatus;
  sortOrder: number;
  version: number;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  year: number;
  category: 'Events' | 'Awards' | 'Initiatives' | 'Academic';
  campus: 'Puducherry' | 'Karaikal' | 'Both';
  summary: string;
  caption?: string;
  imageUrl: string;
  altText: string;
  featured: boolean;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  consentStatus: 'obtained' | 'pending' | 'na';
  status: ContentStatus;
  publishedAt?: string;
  sortOrder: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  description: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  focalPoint: 'center' | 'top' | 'bottom' | 'left' | 'right';
  ctaLabel: string;
  ctaUrl: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  startsAt?: string;
  endsAt?: string;
  status: 'visible' | 'hidden';
  sortOrder: number;
  version: number;
  achievementId?: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  normalizedPhone: string;
  email?: string;
  program: string;
  campus: string;
  message?: string;
  consentAt: string;
  status: EnquiryStatus;
  assignedTo?: string; // staff_profile user_id
  assignedStaffName?: string;
  idempotencyKey: string;
  notes?: EnquiryNote[];
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryNote {
  id: string;
  enquiryId: string;
  staffUserId: string;
  staffName: string;
  note: string;
  createdAt: string;
}

export interface StaffProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive' | 'invited';
  phone?: string;
  invitedBy?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface MediaAsset {
  kind?: 'image' | 'video';
  durationSeconds?: number;
  id: string;
  filename: string;
  bucket: 'cms-media' | 'site-media';
  objectPath: string;
  mimeType: string;
  bytes: number;
  width?: number;
  height?: number;
  altText: string;
  purpose: string;
  uploadedBy: string;
  isPublic: boolean;
  referencesCount: number;
  createdAt: string;
  url: string;
}

export interface GoogleReviewItem {
  id: string;
  authorName: string;
  authorPhotoUrl?: string;
  authorProfileUrl?: string;
  rating: number;
  relativeTimeDescription: string;
  text: string;
  publishTime: string;
  sourceUrl?: string;
}

export interface GooglePlaceReviewsResponse {
  configured: boolean;
  campus: string;
  placeId: string;
  rating?: number;
  userRatingCount?: number;
  reviews: GoogleReviewItem[];
  googleMapsUrl?: string;
  error?: string;
  latencyMs?: number;
}

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  module: string;
  entityType: string;
  entityId?: string;
  severity: 'info' | 'warning' | 'critical';
  summary: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface SiteSettings {
  siteTitle: string;
  institutionName: string;
  tagline: string;
  canonicalOrigin: string;
  announcementNotice?: string;
  showAnnouncement: boolean;
  puducherryPlaceId: string;
  karaikalPlaceId: string;
  contactPhones: string[];
  contactEmail: string;
  workingHours: string;
  seoDescription: string;
  updatedAt: string;
}

export interface WelcomePopupSettings {
  isEnabled: boolean;
  title: string;
  subtitle?: string;
  posterImageUrl: string;
  posterAltText?: string;
  aspectRatio: '16:9' | '4:5' | '9:16' | '1:1';
  ctaLabel?: string;
  ctaUrl?: string;
  showEnquiryButton: boolean;
  frequency: 'once_per_session' | 'always';
  startsAt?: string;
  endsAt?: string;
  version: number;
  updatedAt: string;
}


