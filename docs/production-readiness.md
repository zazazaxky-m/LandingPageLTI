# Production Readiness

## Required Environment Variables

```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=
UPLOAD_PROVIDER=local
```

Optional future upload providers:

```bash
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Install And Build

```bash
npm install
npm run prisma:generate
npm run build
```

## Database Setup

For a new environment:

```bash
npm run prisma:migrate -- --name phase2_schema
npm run db:seed
```

For managed production deploys, prefer Prisma migration deploy:

```bash
npx prisma migrate deploy
npm run db:seed
```

## Admin Login

The seed script creates or updates the admin user from:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Passwords are hashed with scrypt before storage.

## Uploads

Development uploads use:

- `UPLOAD_PROVIDER=local`
- `public/uploads`
- `Media` table records

For production platforms without persistent disk, replace `src/lib/upload.ts` with Cloudinary, S3, or Supabase Storage implementation while keeping the same `UploadResult` contract.

## SEO

Implemented:

- Root metadata
- Open Graph metadata
- `robots.txt`
- `sitemap.xml`
- Per-page metadata for major public modules

## Security

Implemented:

- Admin credentials login
- Password hash verification
- Middleware protection for `/admin`
- Server-side admin layout session check
- Upload endpoint session protection

Recommended next hardening:

- Rate limit contact form
- Rate limit login attempts
- Add CSRF/spam protection for high-traffic deployments
- Configure database backups

## Database Backup

For PostgreSQL:

```bash
pg_dump "$DATABASE_URL" > backup.sql
```

Restore:

```bash
psql "$DATABASE_URL" < backup.sql
```
