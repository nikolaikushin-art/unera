import pagesIndex from "@/data/pages-index.json";
import missing from "@/data/missing-pages.json";

export const SPECIAL = ["home", "contact", "leadership"] as const;
export const index = pagesIndex as Record<string, { title: string; label: string }>;

/** Targets that the original site linked to but never shipped a page for. */
const EXTRA_MISSING = ["privacy", "terms", "accessibility"];
export const placeholderSlugs = [...new Set([...(missing as string[]), ...EXTRA_MISSING])].sort();

const OVERRIDES: Record<string, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Use",
  accessibility: "Accessibility",
  "annual-report": "Annual Report",
  "dev-banks": "Development Banks",
  me: "Middle East",
  ppps: "PPPs",
};

export function labelFor(slug: string): string {
  if (slug === "") return index["home"]?.label ?? "UNERA";
  const known = index[slug];
  if (known) return known.label;
  return (
    OVERRIDES[slug] ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export const pageLoaders = import.meta.glob<{ default: { title: string; label: string; f: Record<string, string> } }>("../data/pages/*.json");

export function isTemplated(slug: string) {
  return `../data/pages/${slug}.json` in pageLoaders;
}
