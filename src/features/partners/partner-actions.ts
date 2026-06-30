"use server";

import { revalidatePath } from "next/cache";

import { locales } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { normalizePartnerFormInput, partnerFormSchema, type PartnerFormInput } from "@/lib/validations/partner";

export type PartnerActionResult = {
  ok: boolean;
  message: string;
  partnerId?: string;
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

async function resolvePartnerSlug(rawSlug: string, name: string, currentPartnerId?: string) {
  const explicitSlug = rawSlug.trim();
  const baseSlug = slugify(explicitSlug || name);

  if (!baseSlug) {
    throw new Error("Partner slug could not be generated.");
  }

  const existing = await prisma.partner.findUnique({
    where: { slug: baseSlug },
    select: { id: true }
  });

  if (!existing || existing.id === currentPartnerId) {
    return baseSlug;
  }

  if (explicitSlug) {
    throw new Error("Slug is already used by another partner.");
  }

  for (let index = 2; index <= 50; index += 1) {
    const candidate = `${baseSlug}-${index}`;
    const conflict = await prisma.partner.findUnique({
      where: { slug: candidate },
      select: { id: true }
    });

    if (!conflict || conflict.id === currentPartnerId) {
      return candidate;
    }
  }

  throw new Error("Could not generate a unique partner slug.");
}

function parsePartnerInput(input: PartnerFormInput) {
  const parsed = partnerFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.flatten().fieldErrors
    };
  }

  return {
    data: normalizePartnerFormInput(parsed.data),
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

function revalidatePartnerPaths() {
  safeRevalidatePath("/admin");
  safeRevalidatePath("/admin/partners");

  for (const locale of locales) {
    safeRevalidatePath(`/${locale}`);
    safeRevalidatePath(`/${locale}/partners`);
  }
}

export async function createPartnerAction(input: PartnerFormInput): Promise<PartnerActionResult> {
  const { data, error } = parsePartnerInput(input);

  if (!data) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: error
    };
  }

  try {
    const slug = await resolvePartnerSlug(data.slug, data.name);
    const partner = await prisma.partner.create({
      data: {
        name: data.name,
        slug,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        description: data.description,
        type: data.type,
        featured: data.featured,
        sortOrder: data.sortOrder,
        status: data.status
      }
    });

    revalidatePartnerPaths();

    return {
      ok: true,
      message: "Partner created.",
      partnerId: partner.id,
      slug: partner.slug
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Partner could not be created."
    };
  }
}

export async function updatePartnerAction(partnerId: string, input: PartnerFormInput): Promise<PartnerActionResult> {
  const { data, error } = parsePartnerInput(input);

  if (!data) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: error
    };
  }

  try {
    const existingPartner = await prisma.partner.findUnique({
      where: { id: partnerId },
      select: { id: true }
    });

    if (!existingPartner) {
      return {
        ok: false,
        message: "Partner not found."
      };
    }

    const slug = await resolvePartnerSlug(data.slug, data.name, partnerId);
    const partner = await prisma.partner.update({
      where: { id: partnerId },
      data: {
        name: data.name,
        slug,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        description: data.description,
        type: data.type,
        featured: data.featured,
        sortOrder: data.sortOrder,
        status: data.status
      }
    });

    revalidatePartnerPaths();

    return {
      ok: true,
      message: "Partner updated.",
      partnerId: partner.id,
      slug: partner.slug
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Partner could not be updated."
    };
  }
}

export async function hidePartnerAction(partnerId: string): Promise<PartnerActionResult> {
  try {
    const partner = await prisma.partner.update({
      where: { id: partnerId },
      data: { status: "HIDDEN" }
    });

    revalidatePartnerPaths();

    return {
      ok: true,
      message: "Partner hidden.",
      partnerId: partner.id,
      slug: partner.slug
    };
  } catch {
    return {
      ok: false,
      message: "Partner could not be hidden."
    };
  }
}

export async function deletePartnerAction(partnerId: string): Promise<PartnerActionResult> {
  try {
    const partner = await prisma.partner.delete({
      where: { id: partnerId }
    });

    revalidatePartnerPaths();

    return {
      ok: true,
      message: "Partner deleted.",
      partnerId: partner.id,
      slug: partner.slug
    };
  } catch {
    return {
      ok: false,
      message: "Partner could not be deleted."
    };
  }
}
