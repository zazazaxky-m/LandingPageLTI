# Phase 3 Summary

## Completed

- Connected the public landing page to Prisma/PostgreSQL through `src/features/company/landing-service.ts`.
- Replaced the old static landing data source with database-backed content.
- Removed `src/features/company/landing-data.ts` so the landing page has one source of truth.
- Made `/[locale]` dynamic server-rendered instead of statically prerendered, so database edits can be reflected at runtime.
- Updated header and footer brand text to read from `CompanySetting`.
- Updated the landing page sections to use dynamic data:
  - Hero: `CompanySetting`
  - Partner logos: `Partner`
  - About company: `CompanySetting`
  - Solutions: `Division`
  - Featured products: published featured `Product`
  - Why choose us: `CompanySetting`
  - Remote collaboration: `CompanySetting`
  - Team teaser: active `Employee`
  - Academic teaser: published `AcademicContent`
  - Career teaser: open `Career`
  - Contact info: `CompanySetting`
- Added locale-aware enum labels for public display.
- Fixed Mandarin UI text encoding in i18n config/dictionaries.
- Expanded seed translations for landing-visible company, division, employee, academic, and career content.

## Dynamic Content Rules

- Public landing only shows visible/published/open records:
  - `Division.status = VISIBLE`
  - `Partner.status = VISIBLE` and `featured = true`
  - `Product.status = PUBLISHED` and `featured = true`
  - `Employee.status = ACTIVE`
  - `AcademicContent.status = PUBLISHED`
  - `Career.status = OPEN`
- `Translation` table is used for translated dynamic fields.
- Static UI labels remain in locale dictionaries.

## Verification

- `npm run db:seed`: success.
- `npm run typecheck`: success.
- `npm run build`: success.
- Build output marks `/[locale]` as dynamic server-rendered.
- Landing content service check:
  - `/en`: 4 divisions, 2 featured products, 6 partners, 1 academic item, 2 open careers.
  - `/id`: 4 divisions, 2 featured products, 6 partners, 1 academic item, 2 open careers.
  - `/zh`: 4 divisions, 2 featured products, 6 partners, 1 academic item, 2 open careers.
- Translation records after seed: 141.

## Not Completed Yet

- Contact form still has a non-submitting UI placeholder. Database submission handling starts in Phase 8.
- Product listing/detail pages and admin product CRUD start in Phase 4.
- Dedicated public pages for solutions, employee, academic, career, and contact start in later phases.
- Media upload/admin editing is still scheduled for later phases.

## Next Phase

Phase 4 should implement the Product module:

- Public product listing and detail routes.
- Product filters/search.
- Entaniya-inspired product detail layout.
- Admin CRUD for products.
- Product image upload abstraction usage.
- Product validation and status management.
