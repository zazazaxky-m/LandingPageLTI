"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { locales } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { normalizeProductFormInput, productFormSchema, type ProductFormInput } from "@/lib/validations/product";

export type ProductActionResult = {
  ok: boolean;
  message: string;
  productId?: string;
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

async function resolveProductSlug(rawSlug: string, name: string, currentProductId?: string) {
  const explicitSlug = rawSlug.trim();
  const baseSlug = slugify(explicitSlug || name);

  if (!baseSlug) {
    throw new Error("Product slug could not be generated.");
  }

  const existing = await prisma.product.findUnique({
    where: { slug: baseSlug },
    select: { id: true }
  });

  if (!existing || existing.id === currentProductId) {
    return baseSlug;
  }

  if (explicitSlug) {
    throw new Error("Slug is already used by another product.");
  }

  for (let index = 2; index <= 50; index += 1) {
    const candidate = `${baseSlug}-${index}`;
    const conflict = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true }
    });

    if (!conflict || conflict.id === currentProductId) {
      return candidate;
    }
  }

  throw new Error("Could not generate a unique product slug.");
}

function parseProductInput(input: ProductFormInput) {
  const parsed = productFormSchema.safeParse(input);

  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.flatten().fieldErrors
    };
  }

  return {
    data: normalizeProductFormInput(parsed.data),
    error: null
  };
}

function revalidateProductPaths(slug?: string) {
  safeRevalidatePath("/admin");
  safeRevalidatePath("/admin/products");

  for (const locale of locales) {
    safeRevalidatePath(`/${locale}`);
    safeRevalidatePath(`/${locale}/products`);

    if (slug) {
      safeRevalidatePath(`/${locale}/products/${slug}`);
    }
  }
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

export async function createProductAction(input: ProductFormInput): Promise<ProductActionResult> {
  const { data, error } = parseProductInput(input);

  if (!data) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: error
    };
  }

  try {
    const slug = await resolveProductSlug(data.slug, data.name);

    const product = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          name: data.name,
          slug,
          shortDescription: data.shortDescription,
          fullDescription: data.fullDescription,
          category: data.category,
          divisionId: data.divisionId,
          youtubeUrl: data.youtubeUrl,
          useCases: data.useCases,
          status: data.status,
          featured: data.featured,
          sortOrder: data.sortOrder,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription
        }
      });

      await writeProductChildren(tx, createdProduct.id, data);

      return createdProduct;
    });

    revalidateProductPaths(product.slug);

    return {
      ok: true,
      message: "Product created.",
      productId: product.id,
      slug: product.slug
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Product could not be created."
    };
  }
}

export async function updateProductAction(productId: string, input: ProductFormInput): Promise<ProductActionResult> {
  const { data, error } = parseProductInput(input);

  if (!data) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: error
    };
  }

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, slug: true }
    });

    if (!existingProduct) {
      return {
        ok: false,
        message: "Product not found."
      };
    }

    const slug = await resolveProductSlug(data.slug, data.name, productId);

    const product = await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          name: data.name,
          slug,
          shortDescription: data.shortDescription,
          fullDescription: data.fullDescription,
          category: data.category,
          divisionId: data.divisionId,
          youtubeUrl: data.youtubeUrl,
          useCases: data.useCases,
          status: data.status,
          featured: data.featured,
          sortOrder: data.sortOrder,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription
        }
      });

      await writeProductChildren(tx, productId, data);

      return updatedProduct;
    });

    revalidateProductPaths(existingProduct.slug);
    revalidateProductPaths(product.slug);

    return {
      ok: true,
      message: "Product updated.",
      productId: product.id,
      slug: product.slug
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Product could not be updated."
    };
  }
}

export async function archiveProductAction(productId: string): Promise<ProductActionResult> {
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { status: "ARCHIVED" }
    });

    revalidateProductPaths(product.slug);

    return {
      ok: true,
      message: "Product archived.",
      productId: product.id,
      slug: product.slug
    };
  } catch {
    return {
      ok: false,
      message: "Product could not be archived."
    };
  }
}

export async function deleteProductAction(productId: string): Promise<ProductActionResult> {
  try {
    const product = await prisma.product.delete({
      where: { id: productId }
    });

    revalidateProductPaths(product.slug);

    return {
      ok: true,
      message: "Product deleted.",
      productId: product.id,
      slug: product.slug
    };
  } catch {
    return {
      ok: false,
      message: "Product could not be deleted."
    };
  }
}

type ProductWriteData = ReturnType<typeof normalizeProductFormInput>;
type TransactionClient = Prisma.TransactionClient;

async function writeProductChildren(tx: TransactionClient, productId: string, data: ProductWriteData) {
  await Promise.all([
    tx.productImage.deleteMany({ where: { productId } }),
    tx.productFeature.deleteMany({ where: { productId } }),
    tx.productSpecification.deleteMany({ where: { productId } }),
    tx.productTechStack.deleteMany({ where: { productId } })
  ]);

  if (data.images.length > 0) {
    await tx.productImage.createMany({
      data: data.images.map((image) => ({
        productId,
        url: image.url,
        altText: image.altText,
        sortOrder: image.sortOrder
      }))
    });
  }

  if (data.features.length > 0) {
    await tx.productFeature.createMany({
      data: data.features.map((feature) => ({
        productId,
        title: feature.title,
        description: feature.description,
        sortOrder: feature.sortOrder
      }))
    });
  }

  if (data.specifications.length > 0) {
    await tx.productSpecification.createMany({
      data: data.specifications.map((specification) => ({
        productId,
        label: specification.label,
        value: specification.value,
        unit: specification.unit,
        sortOrder: specification.sortOrder
      }))
    });
  }

  if (data.techStack.length > 0) {
    await tx.productTechStack.createMany({
      data: data.techStack.map((stack) => ({
        productId,
        name: stack.name,
        version: stack.version,
        sortOrder: stack.sortOrder
      }))
    });
  }
}
