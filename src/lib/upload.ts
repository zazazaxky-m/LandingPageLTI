import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type UploadProvider = "local" | "cloudinary" | "s3" | "supabase";

export type UploadResult = {
  url: string;
  key: string;
  provider: UploadProvider;
};

export async function uploadFile(file: File): Promise<UploadResult> {
  const provider = (process.env.UPLOAD_PROVIDER || "local") as UploadProvider;

  if (provider !== "local") {
    throw new Error(`Upload provider ${provider} is not implemented yet.`);
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name).toLowerCase();
  const safeExtension = extension && extension.length <= 12 ? extension : "";
  const key = `${randomUUID()}${safeExtension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, key), bytes);

  return {
    url: `/uploads/${key}`,
    key,
    provider
  };
}
