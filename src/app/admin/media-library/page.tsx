import Link from "next/link";
import { Copy, Search } from "lucide-react";

import { MediaUploader } from "@/components/admin/media-uploader";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAdminMedia, parseAdminMediaFilters } from "@/features/media/media-service";

type MediaLibraryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function formatBytes(value: number) {
  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export const dynamic = "force-dynamic";

export default async function MediaLibraryPage({ searchParams }: MediaLibraryPageProps) {
  const filters = parseAdminMediaFilters(await searchParams);
  const content = await getAdminMedia(filters);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-lumen-400">Media Library</p>
          <h1 className="mt-2 text-3xl font-black">Uploaded media</h1>
          <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
            Upload local development media and reuse the generated URL in product, division, partner, employee, academic, and company settings forms.
          </p>
        </div>
        <MediaUploader />
      </div>

      <Card className="p-4">
        <form className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input className="pl-9" defaultValue={filters.query} name="q" placeholder="Search filename, key, mime type" />
          </label>
          <button className={buttonClasses("solid")} type="submit">
            Filter
          </button>
          <Link className={buttonClasses("ghost")} href="/admin/media-library">
            Reset
          </Link>
        </form>
      </Card>

      {content.media.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {content.media.map((item) => (
            <Card className="overflow-hidden" key={item.id}>
              <div className="grid aspect-[4/3] place-items-center bg-white/[0.04]">
                {item.mimeType.startsWith("image/") ? (
                  <img alt={item.altText || item.filename} className="h-full w-full object-cover" src={item.url} />
                ) : (
                  <span className="text-sm font-bold text-zinc-500">{item.mimeType}</span>
                )}
              </div>
              <div className="grid gap-3 p-4">
                <div>
                  <p className="truncate font-black text-white">{item.filename}</p>
                  <p className="mt-1 truncate text-xs text-zinc-500">{item.url}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{item.provider}</Badge>
                  <Badge>{formatBytes(item.size)}</Badge>
                </div>
                <a className={buttonClasses("ghost", "min-h-9 px-3 text-xs")} href={item.url} target="_blank">
                  <Copy className="h-4 w-4" />
                  Open URL
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <h2 className="text-lg font-black text-white">No media found</h2>
          <p className="mt-3 text-zinc-400">Upload an image or clear the filters.</p>
        </Card>
      )}
    </div>
  );
}
