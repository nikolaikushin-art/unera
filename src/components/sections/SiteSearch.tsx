import { useEffect, useMemo, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { A } from "@/components/A";
import navData from "@/data/nav.json";
import type { NavItem } from "@/data/types";
import { index as pageIndex } from "@/lib/pages";

export const OPEN_SEARCH = "unera:open-search";
type Entry = { label: string; section: string; href: string };

function buildIndex(): Entry[] {
  const seen = new Set<string>();
  const out: Entry[] = [];
  const push = (label: string, section: string, href: string) => {
    if (!href.startsWith("/") || seen.has(href)) return;
    seen.add(href);
    out.push({ label, section, href });
  };
  for (const m of navData as unknown as NavItem[]) {
    push(m.label, "Menu", m.href);
    for (const p of m.panels) {
      if (p.titleHref) push(p.title, m.label, p.titleHref);
      for (const col of p.cols) for (const c of col) if ("href" in c) push(c.text, `${m.label} / ${p.title}`, c.href);
    }
  }
  for (const [slug, v] of Object.entries(pageIndex)) if (slug !== "home") push(v.label, "Pages", `/${slug}`);
  return out;
}

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const entries = useMemo(buildIndex, []);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const show = () => setOpen(true);
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener(OPEN_SEARCH, show);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener(OPEN_SEARCH, show);
      window.removeEventListener("keydown", key);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  const term = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!term) return entries.filter((e) => e.section === "Menu");
    return entries.filter((e) => `${e.label} ${e.section}`.toLowerCase().includes(term)).slice(0, 14);
  }, [term, entries]);

  if (!open) return null;
  return (
    <>
      <div className="ss-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="ss-panel" role="dialog" aria-modal="true" aria-label="Search">
        <div className="container">
          <div className="ss-bar">
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search programmes, regions, sectors, pages" aria-label="Search the site" />
            <button type="button" aria-label="Close search" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          <p className="ss-label">{term ? "Results" : "Quick links"}</p>
          <ul className="ss-list">
            {results.length === 0 && <li className="ss-empty">No matches yet. A broader term will open more pages.</li>}
            {results.map((r) => (
              <li key={r.href}>
                <A href={r.href}>
                  <span>{r.label}</span>
                  <small>{r.section}</small>
                </A>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
