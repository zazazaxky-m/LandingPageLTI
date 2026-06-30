# Lumiatech Company Profile

Dynamic company profile, landing page, and admin dashboard foundation for Lumiatech.


## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Auth.js / NextAuth scaffold
- Zod validation scaffold
- React Hook Form dependency installed
- Modular upload scaffold

## 🚀 Setup dengan Docker (Direkomendasikan untuk Deployment)

Ini adalah cara termudah dan paling direkomendasikan untuk menjalankan aplikasi beserta databasenya, terutama di server.

1. **Siapkan file konfigurasi environment:**
   ```bash
   cp .env.example .env
   ```
2. **Sesuaikan koneksi database:**
   Buka file `.env` dan ubah `DATABASE_URL` agar terhubung ke database di dalam jaringan Docker:
   ```env
   DATABASE_URL="postgres://lumiatech:lumiatech@postgres:5432/lumiatech"
   ```
3. **Build dan jalankan container:**
   Aplikasi dan database akan berjalan di background.
   ```bash
   docker compose up -d --build
   ```
4. **Jalankan migrasi database & seed data:**
   Membentuk tabel di database dan mengisi data awal.
   ```bash
   docker compose exec app npx prisma migrate deploy
   docker compose exec app npm run db:seed
   ```

Aplikasi Anda sekarang dapat diakses di **`http://localhost:80`** (atau `http://<IP_SERVER_ANDA>` jika di-deploy di server).

---

## 💻 Setup Development Lokal (Node.js)

Jika Anda ingin mengembangkan aplikasi di komputer lokal (tanpa Docker untuk aplikasinya):

1. **Install dependencies:**
   ```bash
   npm install
   cp .env.example .env
   ```
2. **Jalankan hanya database PostgreSQL menggunakan Docker:**
   ```bash
   docker compose up -d postgres
   ```
3. **Generate Prisma client, jalankan migrasi, dan seed data:**
   ```bash
   npm run prisma:generate
   npx prisma migrate dev --name init
   npm run db:seed
   ```
4. **Jalankan server development:**
   ```bash
   npm run dev
   ```

Open:

- Public website: `http://localhost:3000/id`
- Solutions: `http://localhost:3000/id/solutions`
- Solution detail seed example: `http://localhost:3000/id/solutions/engineering-prototype`
- Employee / Team: `http://localhost:3000/id/employee`
- Partners: `http://localhost:3000/id/partners`
- Academic: `http://localhost:3000/id/academic`
- Academic detail seed example: `http://localhost:3000/id/academic/todo-internship-studio`
- Career: `http://localhost:3000/id/career`
- Career detail seed example: `http://localhost:3000/id/career/todo-full-stack-developer`
- Contact: `http://localhost:3000/id/contact`
- Product catalog: `http://localhost:3000/id/products`
- Product detail seed example: `http://localhost:3000/id/products/todo-fieldops-control-hub`
- English: `http://localhost:3000/en`
- Chinese: `http://localhost:3000/zh`
- Admin foundation: `http://localhost:3000/admin`
- Admin products: `http://localhost:3000/admin/products`
- Admin divisions: `http://localhost:3000/admin/divisions`
- Admin employees: `http://localhost:3000/admin/employees`
- Admin partners: `http://localhost:3000/admin/partners`
- Admin academic: `http://localhost:3000/admin/academic`
- Admin careers: `http://localhost:3000/admin/careers`
- Admin contact submissions: `http://localhost:3000/admin/contact-submissions`
- Admin company profile: `http://localhost:3000/admin/company-profile`
- Admin media library: `http://localhost:3000/admin/media-library`
- Admin settings: `http://localhost:3000/admin/settings`
- Admin login: `http://localhost:3000/admin/login`

## Verification

```bash
npm run db:seed
npm run typecheck
npm run build
npx prisma validate
```

## Notes

- The previous static prototype files are left in place as reference artifacts.
- The public locale home route is dynamic server-rendered and reads landing content from Prisma/PostgreSQL.
- Product catalog/detail routes are dynamic server-rendered and read published product data from Prisma/PostgreSQL.
- Solutions/list/detail routes are dynamic server-rendered and read visible divisions, related products, and related employees from Prisma/PostgreSQL.
- Employee/team routes are dynamic server-rendered and read active employee data, skills, and division filters from Prisma/PostgreSQL.
- Partner routes are dynamic server-rendered and read visible partner/client/collaboration data from Prisma/PostgreSQL.
- Academic routes are dynamic server-rendered and read published academic content from Prisma/PostgreSQL.
- Career routes are dynamic server-rendered and read open career/job vacancy data from Prisma/PostgreSQL.
- Contact route and landing contact form validate with Zod and store submissions in Prisma/PostgreSQL.
- Admin product CRUD is available, including local development image upload to `public/uploads`.
- Admin division CRUD is available, including local development image upload to `public/uploads`.
- Admin employee CRUD is available, including local development photo upload to `public/uploads`.
- Admin partner, academic, and career CRUD is available, including local development upload support where applicable.
- Admin contact submissions, company profile settings, media library, and settings pages are available.
- Admin routes are protected with NextAuth/Auth.js credentials login and session middleware.
- Seed content intentionally includes `TODO` placeholders so development data is easy to identify and replace later from admin.
- Seeded admin credentials come from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Production notes are documented in `docs/production-readiness.md`.

