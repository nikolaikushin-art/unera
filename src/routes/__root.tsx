import { HeadContent, Outlet, createRootRoute, useRouterState } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { Header, TopBar } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { labelFor } from "@/lib/pages";
import { A } from "@/components/A";
import { SiteSearch } from "@/components/sections/SiteSearch";
import { QuickContact } from "@/components/sections/QuickContact";

function NotFound() {
  return (
    <div className="container" style={{ padding: "96px 24px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 56, margin: 0 }}>404</h1>
      <p style={{ margin: "12px 0 24px" }}>The page you’re looking for doesn’t exist or has moved.</p>
      <A href="/" className="btn btn-primary">
        Go home
      </A>
    </div>
  );
}

function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const slug = pathname.replace(/^\/+|\/+$/g, "");
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return (
    <>
      <HeadContent />
      <TopBar home={slug === ""} />
      <Header />
      <Outlet />
      <Footer label={labelFor(slug)} />
      <SiteSearch />
      <QuickContact />
    </>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "UNERA | Universal Economic Reform Alliance" },
      {
        name: "description",
        content: "UNERA is a global institutional platform for economic reform, national transformation and long-term development.",
      },
      { property: "og:site_name", content: "UNERA" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Shell,
  notFoundComponent: NotFound,
});
