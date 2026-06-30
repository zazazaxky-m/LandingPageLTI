"use server";

import { revalidatePath } from "next/cache";

import { locales } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { careerFormSchema, normalizeCareerFormInput, type CareerFormInput } from "@/lib/validations/career";

export type CareerActionResult = {
  ok: boolean;
  message: string;
  careerId?: string;
  slug?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function resolveCareerSlug(rawSlug: string, jobTitle: string, currentCareerId?: string) {
  const explicitSlug = rawSlug.trim();
  const baseSlug = slugify(explicitSlug || jobTitle);

  if (!baseSlug) {
    throw new Error("Career slug could not be generated.");
  }

  const existing = await prisma.career.findUnique({
    where: { slug: baseSlug },
    select: { id: true }
  });

  if (!existing || existing.id === currentCareerId) {
    return baseSlug;
  }

  if (explicitSlug) {
    throw new Error("Slug is already used by another career.");
  }

  for (let index = 2; index <= 50; index += 1) {
    const candidate = `${baseSlug}-${index}`;
    const conflict = await prisma.career.findUnique({
      where: { slug: candidate },
      select: { id: true }
    });

    if (!conflict || conflict.id === currentCareerId) {
      return candidate;
    }
  }

  throw new Error("Could not generate a unique career slug.");
}

function parseCareerInput(input: CareerFormInput) {
  const parsed = careerFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.flatten().fieldErrors
    };
  }

  return {
    data: normalizeCareerFormInput(parsed.data),
    error: null
  };
}

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch (error) {
    if (error instanceof Error && error.message.includes("static generation store missing")) {
      return;
    }

    throw error;
  }
}

function revalidateCareerPaths(slug?: string) {
  safeRevalidatePath("/admin");
  safeRevalidatePath("/admin/careers");

  for (const locale of locales) {
    safeRevalidatePath(`/${locale}`);
    safeRevalidatePath(`/${locale}/career`);

    if (slug) {
      safeRevalidatePath(`/${locale}/career/${slug}`);
    }
  }
}

export async function createCareerAction(input: CareerFormInput): Promise<CareerActionResult> {
  const { data, error } = parseCareerInput(input);

  if (!data) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: error
    };
  }

  try {
    const slug = await resolveCareerSlug(data.slug, data.jobTitle);
    const career = await prisma.career.create({
      data: {
        jobTitle: data.jobTitle,
        slug,
        divisionId: data.divisionId,
        location: data.location,
        workType: data.workType,
        employmentType: data.employmentType,
        shortDescription: data.shortDescription,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        benefits: data.benefits,
        status: data.status,
        applyUrl: data.applyUrl,
        applyEmail: data.applyEmail
      }
    });

    revalidateCareerPaths(career.slug);

    return {
      ok: true,
      message: "Career created.",
      careerId: career.id,
      slug: career.slug
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Career could not be created."
    };
  }
}

export async function updateCareerAction(careerId: string, input: CareerFormInput): Promise<CareerActionResult> {
  const { data, error } = parseCareerInput(input);

  if (!data) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: error
    };
  }

  try {
    const existingCareer = await prisma.career.findUnique({
      where: { id: careerId },
      select: { id: true, slug: true }
    });

    if (!existingCareer) {
      return {
        ok: false,
        message: "Career not found."
      };
    }

    const slug = await resolveCareerSlug(data.slug, data.jobTitle, careerId);
    const career = await prisma.career.update({
      where: { id: careerId },
      data: {
        jobTitle: data.jobTitle,
        slug,
        divisionId: data.divisionId,
        location: data.location,
        workType: data.workType,
        employmentType: data.employmentType,
        shortDescription: data.shortDescription,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        benefits: data.benefits,
        status: data.status,
        applyUrl: data.applyUrl,
        applyEmail: data.applyEmail
      }
    });

    revalidateCareerPaths(existingCareer.slug);
    revalidateCareerPaths(career.slug);

    return {
      ok: true,
      message: "Career updated.",
      careerId: career.id,
      slug: career.slug
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Career could not be updated."
    };
  }
}

export async function closeCareerAction(careerId: string): Promise<CareerActionResult> {
  try {
    const career = await prisma.career.update({
      where: { id: careerId },
      data: { status: "CLOSED" }
    });

    revalidateCareerPaths(career.slug);

    return {
      ok: true,
      message: "Career closed.",
      careerId: career.id,
      slug: career.slug
    };
  } catch {
    return {
      ok: false,
      message: "Career could not be closed."
    };
  }
}

export async function deleteCareerAction(careerId: string): Promise<CareerActionResult> {
  try {
    const career = await prisma.career.delete({
      where: { id: careerId }
    });

    revalidateCareerPaths(career.slug);

    return {
      ok: true,
      message: "Career deleted.",
      careerId: career.id,
      slug: career.slug
    };
  } catch {
    return {
      ok: false,
      message: "Career could not be deleted."
    };
  }
}
