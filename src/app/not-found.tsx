import { ErrorExperience } from "@/components/public/error-experience";

export default function NotFound() {
  return (
    <ErrorExperience
      code="404"
      eyebrow="Signal route missing"
      message="The page may have moved, been unpublished, or never existed."
      primaryHref="/id"
      primaryLabel="Back to home"
      title="Page not found"
    />
  );
}
