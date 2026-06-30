"use server";

import { revalidatePath } from "next/cache";

import { locales } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { divisionFormSchema, normalizeDivisionFormInput, type DivisionFormInput } from "@/lib/validations/division";

export type DivisionActionResult = {
  ok: boolean;
  message: string;
  divisionId?: string;
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

async function resolveDivisionSlug(rawSlug: string, name: string, currentDivisionId?: string) {
  const explicitSlug = rawSlug.trim();
  const baseSlug = slugify(explicitSlug || name);

  if (!baseSlug) {
    throw new Error("Division slug could not be generated.");
  }

  const existing = await prisma.division.findUnique({
    where: { slug: baseSlug },
    select: { id: true }
  });

  if (!existing || existing.id === currentDivisionId) {
    return baseSlug;
  }

  if (explicitSlug) {
    throw new Error("Slug is already used by another division.");
  }

  for (let index = 2; index <= 50; index += 1) {
    const candidate = `${baseSlug}-${index}`;
    const conflict = await prisma.division.findUnique({
      where: { slug: candidate },
      select: { id: true }
    });

    if (!conflict || conflict.id === currentDivisionId) {
      return candidate;
    }
  }

  throw new Error("Could not generate a unique division slug.");
}

function parseDivisionInput(input: DivisionFormInput) {
  const parsed = divisionFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.flatten().fieldErrors
    };
  }

  return {
    data: normalizeDivisionFormInput(parsed.data),
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

function revalidateDivisionPaths(slug?: string) {
  safeRevalidatePath("/admin");
  safeRevalidatePath("/admin/divisions");
  safeRevalidatePath("/admin/products");

  for (const locale of locales) {
    safeRevalidatePath(`/${locale}`);
    safeRevalidatePath(`/${locale}/solutions`);
    safeRevalidatePath(`/${locale}/products`);

    if (slug) {
      safeRevalidatePath(`/${locale}/solutions/${slug}`);
    }
  }
}

export async function createDivisionAction(input: DivisionFormInput): Promise<DivisionActionResult> {
  const { data, error } = parseDivisionInput(input);

  if (!data) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: error
    };
  }

  try {
    const slug = await resolveDivisionSlug(data.slug, data.name);
    const division = await prisma.division.create({
      data: {
        name: data.name,
        slug,
        shortDescription: data.shortDescription,
        description: data.description,
        icon: data.icon,
        imageUrl: data.imageUrl,
        memberCount: data.memberCount,
        status: data.status,
        sortOrder: data.sortOrder
      }
    });

    revalidateDivisionPaths(division.slug);

    return {
      ok: true,
      message: "Division created.",
      divisionId: division.id,
      slug: division.slug
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Division could not be created."
    };
  }
}

export async function updateDivisionAction(divisionId: string, input: DivisionFormInput): Promise<DivisionActionResult> {
  const { data, error } = parseDivisionInput(input);

  if (!data) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: error
    };
  }

  try {
    const existingDivision = await prisma.division.findUnique({
      where: { id: divisionId },
      select: { id: true, slug: true }
    });

    if (!existingDivision) {
      return {
        ok: false,
        message: "Division not found."
      };
    }

    const slug = await resolveDivisionSlug(data.slug, data.name, divisionId);
    const division = await prisma.division.update({
      where: { id: divisionId },
      data: {
        name: data.name,
        slug,
        shortDescription: data.shortDescription,
        description: data.description,
        icon: data.icon,
        imageUrl: data.imageUrl,
        memberCount: data.memberCount,
        status: data.status,
        sortOrder: data.sortOrder
      }
    });

    revalidateDivisionPaths(existingDivision.slug);
    revalidateDivisionPaths(division.slug);

    return {
      ok: true,
      message: "Division updated.",
      divisionId: division.id,
      slug: division.slug
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Division could not be updated."
    };
  }
}

export async function hideDivisionAction(divisionId: string): Promise<DivisionActionResult> {
  try {
    const division = await prisma.division.update({
      where: { id: divisionId },
      data: { status: "HIDDEN" }
    });

    revalidateDivisionPaths(division.slug);

    return {
      ok: true,
      message: "Division hidden.",
      divisionId: division.id,
      slug: division.slug
    };
  } catch {
    return {
      ok: false,
      message: "Division could not be hidden."
    };
  }
}

export async function deleteDivisionAction(divisionId: string): Promise<DivisionActionResult> {
  try {
    const division = await prisma.division.delete({
      where: { id: divisionId }
    });

    revalidateDivisionPaths(division.slug);

    return {
      ok: true,
      message: "Division deleted.",
      divisionId: division.id,
      slug: division.slug
    };
  } catch {
    return {
      ok: false,
      message: "Division could not be deleted."
    };
  }
}
