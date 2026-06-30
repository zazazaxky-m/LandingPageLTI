import { prisma } from "@/lib/prisma";

export type AdminMediaFilters = {
  query?: string;
};

function cleanFilter(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

export function parseAdminMediaFilters(searchParams: Record<string, string | string[] | undefined>): Required<AdminMediaFilters> {
  return {
    query: cleanFilter(searchParams.q)
  };
}

export async function getAdminMedia(filters: Required<AdminMediaFilters>) {
  const media = await prisma.media.findMany({
    where: filters.query
      ? {
          OR: [
            { filename: { contains: filters.query, mode: "insensitive" } },
            { key: { contains: filters.query, mode: "insensitive" } },
            { mimeType: { contains: filters.query, mode: "insensitive" } },
            { altText: { contains: filters.query, mode: "insensitive" } }
          ]
        }
      : {},
    orderBy: [{ createdAt: "desc" }],
    take: 120
  });

  return {
    media: media.map((item) => ({
      id: item.id,
      filename: item.filename,
      key: item.key,
      url: item.url,
      mimeType: item.mimeType,
      size: item.size,
      provider: item.provider,
      altText: item.altText ?? "",
      createdAt: item.createdAt.toISOString()
    })),
    filters
  };
}
