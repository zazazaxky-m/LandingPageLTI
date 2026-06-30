"use server";

import { revalidatePath } from "next/cache";

import { locales } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { academicFormSchema, normalizeAcademicFormInput, type AcademicFormInput } from "@/lib/validations/academic";

export type AcademicActionResult = {
  ok: boolean;
  message: string;
  academicId?: string;
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

async function resolveAcademicSlug(rawSlug: string, title: string, currentAcademicId?: string) {
  const explicitSlug = rawSlug.trim();
  const baseSlug = slugify(explicitSlug || title);

  if (!baseSlug) {
    throw new Error("Academic slug could not be generated.");
  }

  const existing = await prisma.academicContent.findUnique({
    where: { slug: baseSlug },
    select: { id: true }
  });

  if (!existing || existing.id === currentAcademicId) {
    return baseSlug;
  }

  if (explicitSlug) {
    throw new Error("Slug is already used by another academic content.");
  }

  for (let index = 2; index <= 50; index += 1) {
    const candidate = `${baseSlug}-${index}`;
    const conflict = await prisma.academicContent.findUnique({
      where: { slug: candidate },
      select: { id: true }
    });

    if (!conflict || conflict.id === currentAcademicId) {
      return candidate;
    }
  }

  throw new Error("Could not generate a unique academic slug.");
}

function parseAcademicInput(input: AcademicFormInput) {
  const parsed = academicFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.flatten().fieldErrors
    };
  }

  return {
    data: normalizeAcademicFormInput(parsed.data),
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

function revalidateAcademicPaths(slug?: string) {
  safeRevalidatePath("/admin");
  safeRevalidatePath("/admin/academic");

  for (const locale of locales) {
    safeRevalidatePath(`/${locale}`);
    safeRevalidatePath(`/${locale}/academic`);

    if (slug) {
      safeRevalidatePath(`/${locale}/academic/${slug}`);
    }
  }
}

export async function createAcademicAction(input: AcademicFormInput): Promise<AcademicActionResult> {
  const { data, error } = parseAcademicInput(input);

  if (!data) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: error
    };
  }

  try {
    const slug = await resolveAcademicSlug(data.slug, data.title);
    const item = await prisma.academicContent.create({
      data: {
        title: data.title,
        slug,
        category: data.category,
        shortDescription: data.shortDescription,
        content: data.content,
        imageUrl: data.imageUrl,
        publishedAt: data.publishedAt,
        status: data.status,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription
      }
    });

    revalidateAcademicPaths(item.slug);

    return {
      ok: true,
      message: "Academic content created.",
      academicId: item.id,
      slug: item.slug
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Academic content could not be created."
    };
  }
}

export async function updateAcademicAction(academicId: string, input: AcademicFormInput): Promise<AcademicActionResult> {
  const { data, error } = parseAcademicInput(input);

  if (!data) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: error
    };
  }

  try {
    const existingItem = await prisma.academicContent.findUnique({
      where: { id: academicId },
      select: { id: true, slug: true }
    });

    if (!existingItem) {
      return {
        ok: false,
        message: "Academic content not found."
      };
    }

    const slug = await resolveAcademicSlug(data.slug, data.title, academicId);
    const item = await prisma.academicContent.update({
      where: { id: academicId },
      data: {
        title: data.title,
        slug,
        category: data.category,
        shortDescription: data.shortDescription,
        content: data.content,
        imageUrl: data.imageUrl,
        publishedAt: data.publishedAt,
        status: data.status,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription
      }
    });

    revalidateAcademicPaths(existingItem.slug);
    revalidateAcademicPaths(item.slug);

    return {
      ok: true,
      message: "Academic content updated.",
      academicId: item.id,
      slug: item.slug
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Academic content could not be updated."
    };
  }
}

export async function archiveAcademicAction(academicId: string): Promise<AcademicActionResult> {
  try {
    const item = await prisma.academicContent.update({
      where: { id: academicId },
      data: { status: "ARCHIVED" }
    });

    revalidateAcademicPaths(item.slug);

    return {
      ok: true,
      message: "Academic content archived.",
      academicId: item.id,
      slug: item.slug
    };
  } catch {
    return {
      ok: false,
      message: "Academic content could not be archived."
    };
  }
}

export async function deleteAcademicAction(academicId: string): Promise<AcademicActionResult> {
  try {
    const item = await prisma.academicContent.delete({
      where: { id: academicId }
    });

    revalidateAcademicPaths(item.slug);

    return {
      ok: true,
      message: "Academic content deleted.",
      academicId: item.id,
      slug: item.slug
    };
  } catch {
    return {
      ok: false,
      message: "Academic content could not be deleted."
    };
  }
}
