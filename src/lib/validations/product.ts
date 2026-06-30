import { z } from "zod";

const optionalText = z.string().trim().optional().default("");

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine((value) => {
    if (!value) {
      return true;
    }

    if (value.startsWith("/")) {
      return true;
    }

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, "Use a valid URL or local path starting with /.");

export const productFormSchema = z.object({
  name: z.string().trim().min(2, "Product name is required."),
  slug: optionalText,
  shortDescription: z.string().trim().min(8, "Short description is required."),
  fullDescription: z.string().trim().min(20, "Full description is required."),
  category: optionalText,
  divisionId: optionalText,
  youtubeUrl: optionalUrl,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  seoTitle: optionalText,
  seoDescription: optionalText,
  images: z
    .array(
      z.object({
        url: optionalUrl,
        altText: optionalText,
        sortOrder: z.coerce.number().int().min(0).default(0)
      })
    )
    .default([]),
  features: z
    .array(
      z.object({
        title: optionalText,
        description: optionalText
      })
    )
    .default([]),
  specifications: z
    .array(
      z.object({
        label: optionalText,
        value: optionalText,
        unit: optionalText
      })
    )
    .default([]),
  techStack: z
    .array(
      z.object({
        name: optionalText,
        version: optionalText
      })
    )
    .default([]),
  useCases: z
    .array(
      z.object({
        value: optionalText
      })
    )
    .default([])
});

export type ProductFormInput = z.input<typeof productFormSchema>;
type ParsedProductFormInput = z.output<typeof productFormSchema>;

export function normalizeProductFormInput(input: ParsedProductFormInput) {
  return {
    ...input,
    slug: input.slug.trim(),
    category: input.category.trim() || null,
    divisionId: input.divisionId.trim() || null,
    youtubeUrl: input.youtubeUrl.trim() || null,
    seoTitle: input.seoTitle.trim() || null,
    seoDescription: input.seoDescription.trim() || null,
    images: input.images
      .map((image, index) => ({
        url: image.url.trim(),
        altText: image.altText.trim() || null,
        sortOrder: image.sortOrder || index + 1
      }))
      .filter((image) => image.url),
    features: input.features
      .map((feature, index) => ({
        title: feature.title.trim(),
        description: feature.description.trim() || null,
        sortOrder: index + 1
      }))
      .filter((feature) => feature.title),
    specifications: input.specifications
      .map((specification, index) => ({
        label: specification.label.trim(),
        value: specification.value.trim(),
        unit: specification.unit.trim() || null,
        sortOrder: index + 1
      }))
      .filter((specification) => specification.label && specification.value),
    techStack: input.techStack
      .map((stack, index) => ({
        name: stack.name.trim(),
        version: stack.version.trim() || null,
        sortOrder: index + 1
      }))
      .filter((stack) => stack.name),
    useCases: input.useCases.map((useCase) => useCase.value.trim()).filter(Boolean)
  };
}

export function emptyProductFormValues(): ProductFormInput {
  return {
    name: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    divisionId: "",
    youtubeUrl: "",
    status: "DRAFT",
    featured: false,
    sortOrder: 0,
    seoTitle: "",
    seoDescription: "",
    images: [],
    features: [{ title: "", description: "" }],
    specifications: [{ label: "", value: "", unit: "" }],
    techStack: [{ name: "", version: "" }],
    useCases: [{ value: "" }]
  };
}
