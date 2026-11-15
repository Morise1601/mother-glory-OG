# Supabase Discovery & Schema Mapping Report

> Historical design notes from October. The replacement schema and migration below are **not the deployed contract** and must not be applied to the existing project. The current implementation preserves legacy RBAC, uses private `app_settings` documents for CMS/enquiries, reads actual branches, and uses the additive 20261114 migrations. See [deployment.md](deployment.md) and [application-audit.md](application-audit.md) for the verified implementation.

**Prepared:** 28 October 2026  
**Target Project:** `https://pvrhtweikaffgutpidid.supabase.co`  
**Purpose:** Technical mapping between the discovered Supabase database entities and the verified specification data model.

---

## 1. Discovery Summary & Existing Table Inventory

An inspection of the remote Supabase OpenAPI definitions (via `scripts/generate-types.js` into `types/database.types.ts`) reveals the following pre-existing tables in the project:

| Existing Table | Existing Primary Purpose | Relationship to Target Specification |
|---|---|---|
| `branches` | Branch contact info, lat/long, city, postal code | Direct ancestor to `campuses`. Contains Puducherry & Karaikal locations. |
| `testimonials` | Student, parent, alumni quotes & rating | Related to student recognition; mapped to verified `achievements`. Google reviews must NOT be stored here. |
| `active_promotions` / `promotions` | Placement, CTA, dates, target audience | Direct ancestor to `banners` (homepage carousel). |
| `staff_profiles` | User profiles, employee IDs, department, branch | Core staff identity; enhanced with strict `admin`, `editor`, and `staff` role enum. |
| `staff_roles` / `roles` | Fine-grained roles & permissions system | Mapped to simplified, secure 3-tier role hierarchy. |
| `media_assets` | Media files, bucket ID, dimensions, SHA256, alt text | Directly compatible with target media library architecture. |
| `audit_logs` | Security & activity logging with actor and metadata | Retained and strengthened as append-only immutable trail. |
| `app_settings` | Key-value settings store | Extended into typed `public_site_settings`. |

---

## 2. Table-by-Table Field Mapping

### A. Campuses (`campuses` ↔ `branches`)
* **Existing `branches`:** `id`, `name`, `slug`, `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `phone`, `email`, `latitude`, `longitude`, `is_active`, `sort_order`.
* **Target `campuses`:** Adds `hours`, `maps_url`, `embed_map_url`, `google_place_id`, `image_url`, `is_published`.
* **Migration Strategy:** `campuses` table can be created cleanly alongside `branches` or view-aliased without dropping existing records.

### B. Banners (`banners` ↔ `active_promotions`)
* **Existing `active_promotions`:** `id`, `title`, `short_description`, `media_asset_id`, `cta_text`, `cta_url`, `starts_at`, `ends_at`, `display_order`, `status`.
* **Target `banners`:** Adds `focal_point` ('center' | 'top' | 'bottom'), `secondary_cta_label`, `secondary_cta_url`, `achievement_id`.
* **Migration Strategy:** The repository adapter supports both structures. Clean migration provided in `20261028_mother_glory_schema.sql`.

### C. Achievements (`achievements` ↔ `testimonials` / `gallery_items`)
* **Existing:** Split between student testimonials and raw gallery images.
* **Target `achievements`:** Unifies result posters, annual felicitation milestones, verification status, and consent status.
* **Preservation Rule:** High-resolution posters (`1.webp` through `9.webp`) are preserved in full dimensions for lightbox inspection.

### D. Enquiries (`enquiries` ↔ `notifications`)
* **Existing:** Submissions previously inserted a loose text record into `notifications`.
* **Target `enquiries`:** Dedicated table with `normalized_phone`, `program`, `campus`, `idempotency_key`, `consent_at`, `status`, and `assigned_to` foreign key. Staff have access solely to assigned records.

---

## 3. Storage Bucket Mapping

| Purpose | Existing / Proposed Bucket | Access Policy | Usage |
|---|---|---|---|
| Public Website Derivatives | `site-media` | Public read, Staff write | Optimized hero banners, campus photos, founder portraits, published achievement thumbnails |
| Originals & Private Drafts | `cms-media` | Private (No public read) | Unverified student submissions, draft banners, internal certificates. Accessed via signed URLs only |

---

## 4. Non-Destructive Safety Guarantee
The application utilizes an abstraction layer (`lib/data/`). No existing tables, functions, or RLS policies in the live Supabase project have been dropped or destructively modified.

