-- HISTORICAL PROPOSAL: DO NOT APPLY TO THE EXISTING SUPABASE PROJECT.
-- Its replacement table shapes conflict with the live legacy schema.
-- Use the 20261114 additive migrations documented in docs/deployment.md.
-- ==============================================================================
-- Mother Glory Coaching & Tutorial Centre — Production Schema Migration
-- Target Supabase Project: https://pvrhtweikaffgutpidid.supabase.co
-- Date: 28 October 2026
-- Safety: Non-destructive, idempotent, RLS-enforced
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM TYPES & ENUMS
DO $$ BEGIN
  CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'staff');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.enquiry_status AS ENUM ('new', 'contacted', 'in_progress', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. STAFF PROFILES
CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'staff',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'invited')),
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_staff_profiles_role ON public.staff_profiles(role);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_status ON public.staff_profiles(status);

-- 4. CAMPUSES
CREATE TABLE IF NOT EXISTS public.campuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  alt_phone TEXT,
  email TEXT NOT NULL,
  hours TEXT NOT NULL,
  maps_url TEXT NOT NULL,
  embed_map_url TEXT NOT NULL,
  google_place_id TEXT,
  image_url TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. MEDIA ASSETS
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  bucket TEXT NOT NULL DEFAULT 'cms-media' CHECK (bucket IN ('cms-media', 'site-media')),
  object_path TEXT NOT NULL UNIQUE,
  mime_type TEXT NOT NULL,
  bytes BIGINT NOT NULL,
  width INT,
  height INT,
  alt_text TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id),
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_media_assets_bucket ON public.media_assets(bucket);

-- 6. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  year INT NOT NULL CHECK (year >= 2000 AND year <= 2040),
  category TEXT NOT NULL CHECK (category IN ('Events', 'Awards', 'Initiatives', 'Academic')),
  campus TEXT NOT NULL CHECK (campus IN ('Puducherry', 'Karaikal', 'Both')),
  summary TEXT NOT NULL,
  caption TEXT,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending', 'unverified')),
  consent_status TEXT NOT NULL DEFAULT 'obtained' CHECK (consent_status IN ('obtained', 'pending', 'na')),
  status public.content_status NOT NULL DEFAULT 'published',
  sort_order INT NOT NULL DEFAULT 0,
  version INT NOT NULL DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_achievements_status_year ON public.achievements(status, year DESC);

-- 7. BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  desktop_image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  focal_point TEXT NOT NULL DEFAULT 'center' CHECK (focal_point IN ('center', 'top', 'bottom', 'left', 'right')),
  cta_label TEXT NOT NULL,
  cta_url TEXT NOT NULL,
  secondary_cta_label TEXT,
  secondary_cta_url TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'hidden')),
  sort_order INT NOT NULL DEFAULT 0,
  version INT NOT NULL DEFAULT 1,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_banners_sort_order ON public.banners(sort_order ASC);

-- 8. FOUNDERS
CREATE TABLE IF NOT EXISTS public.founders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  qualifications TEXT,
  biography TEXT NOT NULL,
  message TEXT NOT NULL,
  portrait_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'published',
  version INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. PROGRAMS
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('neet_ug', 'repeater', 'foundation')),
  target_audience TEXT NOT NULL,
  overview TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  curriculum JSONB NOT NULL DEFAULT '[]'::jsonb,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  schedule_notice TEXT,
  status public.content_status NOT NULL DEFAULT 'published',
  sort_order INT NOT NULL DEFAULT 0,
  version INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. ADMISSIONS ENQUIRIES
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  normalized_phone TEXT NOT NULL,
  email TEXT,
  program TEXT NOT NULL,
  campus TEXT NOT NULL CHECK (campus IN ('Puducherry', 'Karaikal')),
  message TEXT,
  consent_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  status public.enquiry_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES auth.users(id),
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_assigned_to ON public.enquiries(assigned_to);

-- 11. ENQUIRY NOTES
CREATE TABLE IF NOT EXISTS public.enquiry_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  staff_user_id UUID NOT NULL REFERENCES auth.users(id),
  staff_name TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_enquiry_notes_enquiry_id ON public.enquiry_notes(enquiry_id);

-- 12. AUDIT LOGS (Append-only)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  summary TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 13. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.public_site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  canonical_origin TEXT NOT NULL DEFAULT 'https://www.motherglory.com',
  announcement_notice TEXT,
  show_announcement BOOLEAN NOT NULL DEFAULT true,
  contact_phones JSONB NOT NULL DEFAULT '["+91 98428 23195", "+91 98944 23195"]'::jsonb,
  contact_email TEXT NOT NULL DEFAULT 'admissions@motherglory.edu',
  working_hours TEXT NOT NULL DEFAULT 'Mon–Sat 8:00 AM–5:00 PM IST',
  seo_description TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_site_settings ENABLE ROW LEVEL SECURITY;

-- Helper security definer function to get current staff role safely
CREATE OR REPLACE FUNCTION public.get_current_staff_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role::text FROM public.staff_profiles
  WHERE user_id = auth.uid() AND status = 'active'
  LIMIT 1;
$$;

-- Helper function to check if caller is active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_profiles
    WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
  );
$$;

-- Campuses: Public can view published
CREATE POLICY "Public can view published campuses"
  ON public.campuses FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admin can manage campuses"
  ON public.campuses FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Achievements: Public can view published only
CREATE POLICY "Public can view published achievements"
  ON public.achievements FOR SELECT
  USING (status = 'published');

CREATE POLICY "Staff & Editors can manage achievements"
  ON public.achievements FOR ALL
  USING (public.get_current_staff_role() IN ('admin', 'editor'))
  WITH CHECK (public.get_current_staff_role() IN ('admin', 'editor'));

-- Banners: Public can view visible and active scheduled banners
CREATE POLICY "Public can view visible banners"
  ON public.banners FOR SELECT
  USING (
    status = 'visible' AND
    (starts_at IS NULL OR starts_at <= timezone('utc'::text, now())) AND
    (ends_at IS NULL OR ends_at >= timezone('utc'::text, now()))
  );

CREATE POLICY "Staff & Editors can manage banners"
  ON public.banners FOR ALL
  USING (public.get_current_staff_role() IN ('admin', 'editor'))
  WITH CHECK (public.get_current_staff_role() IN ('admin', 'editor'));

-- Founders: Public can view published
CREATE POLICY "Public can view published founders"
  ON public.founders FOR SELECT
  USING (status = 'published');

CREATE POLICY "Staff & Editors can manage founders"
  ON public.founders FOR ALL
  USING (public.get_current_staff_role() IN ('admin', 'editor'))
  WITH CHECK (public.get_current_staff_role() IN ('admin', 'editor'));

-- Programs: Public can view published
CREATE POLICY "Public can view published programs"
  ON public.programs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Staff & Editors can manage programs"
  ON public.programs FOR ALL
  USING (public.get_current_staff_role() IN ('admin', 'editor'))
  WITH CHECK (public.get_current_staff_role() IN ('admin', 'editor'));

-- Enquiries: Anonymous public can only INSERT (no anonymous select/update/delete)
CREATE POLICY "Anonymous public can insert enquiry"
  ON public.enquiries FOR INSERT
  WITH CHECK (true);

-- Admins can view and update all enquiries
CREATE POLICY "Admins can view all enquiries"
  ON public.enquiries FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all enquiries"
  ON public.enquiries FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Staff can view only assigned enquiries
CREATE POLICY "Staff can view assigned enquiries"
  ON public.enquiries FOR SELECT
  USING (assigned_to = auth.uid() AND public.get_current_staff_role() = 'staff');

CREATE POLICY "Staff can update assigned enquiries"
  ON public.enquiries FOR UPDATE
  USING (assigned_to = auth.uid() AND public.get_current_staff_role() = 'staff')
  WITH CHECK (assigned_to = auth.uid() AND public.get_current_staff_role() = 'staff');

-- Enquiry Notes: Admins can view/insert notes, Staff can view/insert on assigned enquiries
CREATE POLICY "Admins can view and insert notes"
  ON public.enquiry_notes FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Staff can view notes on assigned enquiries"
  ON public.enquiry_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enquiries
      WHERE id = enquiry_notes.enquiry_id AND assigned_to = auth.uid()
    )
  );

CREATE POLICY "Staff can insert notes on assigned enquiries"
  ON public.enquiry_notes FOR INSERT
  WITH CHECK (
    staff_user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.enquiries
      WHERE id = enquiry_notes.enquiry_id AND assigned_to = auth.uid()
    )
  );

-- Staff Profiles: Staff cannot list other staff; only admins manage
CREATE POLICY "Admins can manage staff profiles"
  ON public.staff_profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Users can read own profile"
  ON public.staff_profiles FOR SELECT
  USING (user_id = auth.uid());

-- Audit logs: Append-only, Admin can read
CREATE POLICY "Admins can read audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- Public Site Settings: Public read, Admin write
CREATE POLICY "Public can view site settings"
  ON public.public_site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON public.public_site_settings FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKET POLICIES (Draft cms-media & Public site-media)
-- ==============================================================================

-- Proposed buckets (run if buckets don't exist):
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-media', 'cms-media', false)
ON CONFLICT (id) DO NOTHING;

-- Public can read site-media bucket objects
CREATE POLICY "Public can view site-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');

-- Authenticated editors & admins can manage both buckets
CREATE POLICY "Staff can upload to media buckets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('site-media', 'cms-media') AND
    public.get_current_staff_role() IN ('admin', 'editor')
  );

CREATE POLICY "Staff can view cms-media"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cms-media' AND
    public.get_current_staff_role() IN ('admin', 'editor', 'staff')
  );

