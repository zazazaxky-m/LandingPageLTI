"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { locales } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { employeeFormSchema, normalizeEmployeeFormInput, type EmployeeFormInput } from "@/lib/validations/employee";

export type EmployeeActionResult = {
  ok: boolean;
  message: string;
  employeeId?: string;
  slug?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

type EmployeeWriteData = ReturnType<typeof normalizeEmployeeFormInput>;
type TransactionClient = Prisma.TransactionClient;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function resolveEmployeeSlug(rawSlug: string, name: string, currentEmployeeId?: string) {
  const explicitSlug = rawSlug.trim();
  const baseSlug = slugify(explicitSlug || name);

  if (!baseSlug) {
    throw new Error("Employee slug could not be generated.");
  }

  const existing = await prisma.employee.findUnique({
    where: { slug: baseSlug },
    select: { id: true }
  });

  if (!existing || existing.id === currentEmployeeId) {
    return baseSlug;
  }

  if (explicitSlug) {
    throw new Error("Slug is already used by another employee.");
  }

  for (let index = 2; index <= 50; index += 1) {
    const candidate = `${baseSlug}-${index}`;
    const conflict = await prisma.employee.findUnique({
      where: { slug: candidate },
      select: { id: true }
    });

    if (!conflict || conflict.id === currentEmployeeId) {
      return candidate;
    }
  }

  throw new Error("Could not generate a unique employee slug.");
}

function parseEmployeeInput(input: EmployeeFormInput) {
  const parsed = employeeFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.flatten().fieldErrors
    };
  }

  return {
    data: normalizeEmployeeFormInput(parsed.data),
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

function revalidateEmployeePaths(divisionSlugs: string[] = []) {
  safeRevalidatePath("/admin");
  safeRevalidatePath("/admin/employees");
  safeRevalidatePath("/admin/divisions");

  for (const locale of locales) {
    safeRevalidatePath(`/${locale}`);
    safeRevalidatePath(`/${locale}/employee`);
    safeRevalidatePath(`/${locale}/solutions`);

    for (const divisionSlug of divisionSlugs) {
      safeRevalidatePath(`/${locale}/solutions/${divisionSlug}`);
    }
  }
}

async function getDivisionSlugsByIds(ids: Array<string | null | undefined>) {
  const cleanIds = Array.from(new Set(ids.filter(Boolean))) as string[];

  if (cleanIds.length === 0) {
    return [];
  }

  const divisions = await prisma.division.findMany({
    where: { id: { in: cleanIds } },
    select: { slug: true }
  });

  return divisions.map((division) => division.slug);
}

export async function createEmployeeAction(input: EmployeeFormInput): Promise<EmployeeActionResult> {
  const { data, error } = parseEmployeeInput(input);

  if (!data) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: error
    };
  }

  try {
    const slug = await resolveEmployeeSlug(data.slug, data.name);
    const employee = await prisma.$transaction(async (tx) => {
      const createdEmployee = await tx.employee.create({
        data: {
          name: data.name,
          slug,
          role: data.role,
          divisionId: data.divisionId,
          photoUrl: data.photoUrl,
          shortBio: data.shortBio,
          experienceHistory: data.experienceHistory,
          linkedinUrl: data.linkedinUrl,
          githubUrl: data.githubUrl,
          portfolioUrl: data.portfolioUrl,
          email: data.email,
          status: data.status,
          sortOrder: data.sortOrder
        }
      });

      await writeEmployeeSkills(tx, createdEmployee.id, data);

      return createdEmployee;
    });
    const divisionSlugs = await getDivisionSlugsByIds([employee.divisionId]);

    revalidateEmployeePaths(divisionSlugs);

    return {
      ok: true,
      message: "Employee created.",
      employeeId: employee.id,
      slug: employee.slug
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Employee could not be created."
    };
  }
}

export async function updateEmployeeAction(employeeId: string, input: EmployeeFormInput): Promise<EmployeeActionResult> {
  const { data, error } = parseEmployeeInput(input);

  if (!data) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: error
    };
  }

  try {
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { id: true, slug: true, divisionId: true }
    });

    if (!existingEmployee) {
      return {
        ok: false,
        message: "Employee not found."
      };
    }

    const slug = await resolveEmployeeSlug(data.slug, data.name, employeeId);
    const employee = await prisma.$transaction(async (tx) => {
      const updatedEmployee = await tx.employee.update({
        where: { id: employeeId },
        data: {
          name: data.name,
          slug,
          role: data.role,
          divisionId: data.divisionId,
          photoUrl: data.photoUrl,
          shortBio: data.shortBio,
          experienceHistory: data.experienceHistory,
          linkedinUrl: data.linkedinUrl,
          githubUrl: data.githubUrl,
          portfolioUrl: data.portfolioUrl,
          email: data.email,
          status: data.status,
          sortOrder: data.sortOrder
        }
      });

      await writeEmployeeSkills(tx, employeeId, data);

      return updatedEmployee;
    });
    const divisionSlugs = await getDivisionSlugsByIds([existingEmployee.divisionId, employee.divisionId]);

    revalidateEmployeePaths(divisionSlugs);

    return {
      ok: true,
      message: "Employee updated.",
      employeeId: employee.id,
      slug: employee.slug
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Employee could not be updated."
    };
  }
}

export async function deactivateEmployeeAction(employeeId: string): Promise<EmployeeActionResult> {
  try {
    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: { status: "INACTIVE" }
    });
    const divisionSlugs = await getDivisionSlugsByIds([employee.divisionId]);

    revalidateEmployeePaths(divisionSlugs);

    return {
      ok: true,
      message: "Employee set inactive.",
      employeeId: employee.id,
      slug: employee.slug
    };
  } catch {
    return {
      ok: false,
      message: "Employee could not be set inactive."
    };
  }
}

export async function deleteEmployeeAction(employeeId: string): Promise<EmployeeActionResult> {
  try {
    const employee = await prisma.employee.delete({
      where: { id: employeeId }
    });
    const divisionSlugs = await getDivisionSlugsByIds([employee.divisionId]);

    revalidateEmployeePaths(divisionSlugs);

    return {
      ok: true,
      message: "Employee deleted.",
      employeeId: employee.id,
      slug: employee.slug
    };
  } catch {
    return {
      ok: false,
      message: "Employee could not be deleted."
    };
  }
}

async function writeEmployeeSkills(tx: TransactionClient, employeeId: string, data: EmployeeWriteData) {
  await tx.employeeSkill.deleteMany({ where: { employeeId } });

  if (data.skills.length > 0) {
    await tx.employeeSkill.createMany({
      data: data.skills.map((skill) => ({
        employeeId,
        name: skill.name,
        sortOrder: skill.sortOrder
      }))
    });
  }
}
