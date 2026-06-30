-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('EN', 'ID', 'ZH');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "VisibilityStatus" AS ENUM ('VISIBLE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('CLIENT', 'PARTNER', 'ACADEMIC', 'VENDOR', 'COLLABORATION');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('ONSITE', 'HYBRID', 'REMOTE');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'FREELANCE');

-- CreateEnum
CREATE TYPE "CareerStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "ContactInterest" AS ENUM ('ENGINEERING_PROTOTYPE', 'IT_SOLUTION', 'MOBILE_APP', 'CYBER_SECURITY', 'PARTNERSHIP', 'CAREER', 'ACADEMIC', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanySetting" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL DEFAULT 'Lumiatech',
    "tagline" TEXT NOT NULL DEFAULT 'Discover Engineering Technology',
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "vision" TEXT,
    "mission" TEXT,
    "address" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "socialLinks" JSONB,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "mainCtaText" TEXT,
    "mainCtaUrl" TEXT,
    "remoteHighlightTitle" TEXT,
    "remoteHighlightBody" TEXT,
    "defaultLocale" "Locale" NOT NULL DEFAULT 'ID',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanySetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Division" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "icon" TEXT,
    "imageUrl" TEXT,
    "memberCount" INTEGER,
    "status" "VisibilityStatus" NOT NULL DEFAULT 'VISIBLE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "fullDescription" TEXT,
    "category" TEXT,
    "divisionId" TEXT,
    "youtubeUrl" TEXT,
    "useCases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFeature" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSpecification" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSpecification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTechStack" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductTechStack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "description" TEXT,
    "type" "PartnerType" NOT NULL DEFAULT 'PARTNER',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "VisibilityStatus" NOT NULL DEFAULT 'VISIBLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "divisionId" TEXT,
    "photoUrl" TEXT,
    "shortBio" TEXT,
    "experienceHistory" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "portfolioUrl" TEXT,
    "email" TEXT,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeSkill" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "shortDescription" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career" (
    "id" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "divisionId" TEXT,
    "location" TEXT,
    "workType" "WorkType" NOT NULL DEFAULT 'REMOTE',
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
    "shortDescription" TEXT,
    "requirements" TEXT,
    "responsibilities" TEXT,
    "benefits" TEXT,
    "status" "CareerStatus" NOT NULL DEFAULT 'DRAFT',
    "applyUrl" TEXT,
    "applyEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "interestCategory" "ContactInterest" NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Division_slug_key" ON "Division"("slug");

-- CreateIndex
CREATE INDEX "Division_status_sortOrder_idx" ON "Division"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_status_featured_sortOrder_idx" ON "Product"("status", "featured", "sortOrder");

-- CreateIndex
CREATE INDEX "Product_divisionId_idx" ON "Product"("divisionId");

-- CreateIndex
CREATE INDEX "ProductImage_productId_sortOrder_idx" ON "ProductImage"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductFeature_productId_sortOrder_idx" ON "ProductFeature"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductSpecification_productId_sortOrder_idx" ON "ProductSpecification"("productId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductTechStack_productId_sortOrder_idx" ON "ProductTechStack"("productId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_slug_key" ON "Partner"("slug");

-- CreateIndex
CREATE INDEX "Partner_status_featured_sortOrder_idx" ON "Partner"("status", "featured", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_slug_key" ON "Employee"("slug");

-- CreateIndex
CREATE INDEX "Employee_divisionId_idx" ON "Employee"("divisionId");

-- CreateIndex
CREATE INDEX "Employee_status_sortOrder_idx" ON "Employee"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "EmployeeSkill_employeeId_sortOrder_idx" ON "EmployeeSkill"("employeeId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicContent_slug_key" ON "AcademicContent"("slug");

-- CreateIndex
CREATE INDEX "AcademicContent_status_publishedAt_idx" ON "AcademicContent"("status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Career_slug_key" ON "Career"("slug");

-- CreateIndex
CREATE INDEX "Career_divisionId_idx" ON "Career"("divisionId");

-- CreateIndex
CREATE INDEX "Career_status_workType_employmentType_idx" ON "Career"("status", "workType", "employmentType");

-- CreateIndex
CREATE INDEX "ContactSubmission_status_createdAt_idx" ON "ContactSubmission"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_interestCategory_idx" ON "ContactSubmission"("interestCategory");

-- CreateIndex
CREATE UNIQUE INDEX "Media_key_key" ON "Media"("key");

-- CreateIndex
CREATE INDEX "Translation_entityType_entityId_locale_idx" ON "Translation"("entityType", "entityId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_entityType_entityId_field_locale_key" ON "Translation"("entityType", "entityId", "field", "locale");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFeature" ADD CONSTRAINT "ProductFeature_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSpecification" ADD CONSTRAINT "ProductSpecification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTechStack" ADD CONSTRAINT "ProductTechStack_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSkill" ADD CONSTRAINT "EmployeeSkill_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Career" ADD CONSTRAINT "Career_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;
