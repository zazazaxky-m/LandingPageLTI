"use client";

import { ErrorExperience } from "@/components/public/error-experience";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorExperience
      code="500"
      detail={error.digest ? `Digest: ${error.digest}` : undefined}
      eyebrow="Runtime protection"
      message={error.message || "The page could not be rendered."}
      onPrimaryAction={reset}
      primaryLabel="Try again"
      secondaryHref="/id"
      secondaryLabel="Back home"
      title="Something went wrong"
    />
  );
}
