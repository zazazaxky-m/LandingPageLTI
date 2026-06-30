# Lumiatech Reference Analysis

## Scope

This note summarizes how the local Dewesoft and Entaniya references are used as design inspiration for the first landing page prototype. The implementation intentionally does not copy their HTML, CSS, or proprietary assets.

## Dewesoft-Inspired Direction

- Strong corporate hero with a clear technical promise, dark mode polish, concise metrics, and visible calls to action.
- Navigation that feels B2B and product-led: solutions, products, team, academic, career, and contact.
- Section flow based on trust first: hero, partners, company profile, solutions, featured products, proof points, remote collaboration, and final CTA.
- Visual rhythm with large engineering imagery, crisp typography, compact technical labels, and high contrast orange accents.

## Entaniya-Inspired Direction

- Product catalog cards use clear product names, short use-case descriptions, category labels, feature chips, and a CTA.
- Product content is presented in a clean grid that can later evolve into listing, detail pages, specifications, gallery, and related products.
- The landing page keeps product cards visual and scannable without copying Entaniya's product images.

## Lumiatech Design Adaptation

- Theme: black, graphite, white text, and orange accents for a premium engineering-tech feel.
- Layout: full-bleed hero image, compact sticky navbar, responsive mobile drawer, structured content bands, and repeated cards with restrained 8px radius.
- Brand: company name, tagline, nav labels, and section copy are centralized in `site-data.js` for easy replacement.
- Languages: English, Indonesian, and Chinese content are available through the language switcher.
- Assets: generated original hero image stored in `assets/hero-engineering-lab.png`.

## Next Build Path

- This prototype is static so it can run immediately without installing dependencies.
- The next phase should migrate the data model into Next.js, Prisma, PostgreSQL, and admin-managed content.
