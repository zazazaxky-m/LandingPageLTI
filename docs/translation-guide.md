# Translation Guide

Lumiatech uses a hybrid i18n approach.

## Static UI

Static interface text lives in:

- `src/i18n/dictionaries.ts`

Supported locales:

- `en`
- `id`
- `zh`

These labels cover navbar text, footer text, CTA labels, public form labels, section headings, empty states, and public module labels.

## Dynamic Content

Dynamic model content is stored in the main Prisma tables and can be localized through:

- `Translation`

Translation key structure:

- `entityType`
- `entityId`
- `field`
- `locale`

Example:

```text
entityType: Product
entityId: product.id
field: shortDescription
locale: ZH
value: localized product short description
```

Runtime helpers:

- `getTranslationLookup`
- `readTranslation`
- `formatEnumLabel`

These helpers live in:

- `src/lib/translations.ts`

## Admin Translation Polish

Current admin forms edit the base content fields. Runtime pages already read from `Translation` records when they exist.

A future polish step can add a reusable translated-field editor that writes rows to `Translation` for any entity type.
