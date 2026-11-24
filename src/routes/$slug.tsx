import { createFileRoute, notFound } from "@tanstack/react-router";
import { ContactPage } from "@/generated/ContactPage";
import { LeadershipPage } from "@/generated/LeadershipPage";
import { PageTemplate, type PageFields } from "@/generated/PageTemplate";
import { Placeholder } from "@/components/Placeholder";
import { CONTACT_FAQS, FaqSection } from "@/components/sections/sections";
import { PageExtras } from "@/components/sections/PageExtras";
import { index, isTemplated, labelFor, pageLoaders, placeholderSlugs } from "@/lib/pages";

type Loaded =
  | { kind: "template"; slug: string; label: string; title: string; f: PageFields }
  | { kind: "contact" | "leadership"; title: string }
  | { kind: "placeholder"; title: string; label: string };

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }): Promise<Loaded> => {
    const { slug } = params;
    if (slug === "contact") return { kind: "contact", title: index["contact"]!.title };
    if (slug === "leadership") return { kind: "leadership", title: index["leadership"]!.title };
    if (isTemplated(slug)) {
      const mod = await pageLoaders[`../data/pages/${slug}.json`]!();
      return { kind: "template", slug, label: mod.default.label, title: mod.default.title, f: mod.default.f as unknown as PageFields };
    }
    if (placeholderSlugs.includes(slug)) {
      const label = labelFor(slug);
      return { kind: "placeholder", title: `${label} | UNERA`, label };
    }
    throw notFound();
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ?? "UNERA" },
      ...(loaderData?.kind === "placeholder" ? [{ name: "robots", content: "noindex" }] : []),
    ],
  }),
  component: SlugPage,
});

function SlugPage() {
  const data = Route.useLoaderData();
  switch (data.kind) {
    case "contact":
      return (
        <>
          <ContactPage />
          <FaqSection title="Contacting UNERA" faqs={CONTACT_FAQS} />
        </>
      );
    case "leadership":
      return <LeadershipPage />;
    case "placeholder":
      return <Placeholder label={data.label} />;
    default:
      return (
        <>
          <PageTemplate f={data.f} />
          <PageExtras slug={data.slug} label={data.label} f={data.f} />
        </>
      );
  }
}
