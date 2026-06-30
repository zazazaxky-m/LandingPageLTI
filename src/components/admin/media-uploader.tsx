"use client";

import { UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";

import { buttonClasses } from "@/components/ui/button";

export function MediaUploader() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setMessage("Uploading media...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        setMessage(payload.error ?? "Upload failed.");
        return;
      }

      setMessage(`Uploaded: ${payload.url}`);
      router.refresh();
    } catch {
      setMessage("Upload failed.");
    }
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <label className={buttonClasses("solid", "cursor-pointer")}>
        <UploadCloud className="h-4 w-4" />
        Upload media
        <input accept="image/*" className="sr-only" onChange={handleUpload} type="file" />
      </label>
      {message ? <p className="text-sm font-bold text-lumen-300">{message}</p> : null}
    </div>
  );
}
