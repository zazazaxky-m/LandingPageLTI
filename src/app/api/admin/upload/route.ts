import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/upload";

const maxFileSize = 5 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  if (!allowedMimeTypes.has(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP, and GIF images are allowed." }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });
  }

  const result = await uploadFile(file);
  const media = await prisma.media.upsert({
    where: { key: result.key },
    update: {
      filename: file.name,
      url: result.url,
      mimeType: file.type,
      size: file.size,
      provider: result.provider
    },
    create: {
      filename: file.name,
      key: result.key,
      url: result.url,
      mimeType: file.type,
      size: file.size,
      provider: result.provider,
      altText: file.name
    }
  });

  return NextResponse.json({ ...result, mediaId: media.id });
}
