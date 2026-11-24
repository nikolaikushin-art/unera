import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { A } from "@/components/A";
import { OPEN_SEARCH } from "@/components/sections/SiteSearch";
import navData from "@/data/nav.json";
import type { NavCell, NavItem } from "@/data/types";

const nav = navData as unknown as NavItem[];

const HAMBURGER_MAIN = [
  ["/", "Home"],
  ["/about", "Who We Are"],
  ["/capabilities", "What We Do"],
  ["/countries", "Global Impact"],
  ["/insights", "Insights"],
  ["/opportunities", "Engage"],
] as const;
const HAMBURGER_QUICK = [
  ["/leadership", "Executive Leadership"],
  ["/programmes", "Flagship Programmes"],
  ["/membership", "Membership"],
  ["/contact", "Contact"],
  ["/careers", "Careers"],
] as const;

function Cell({ cell }: { cell: NavCell }) {
  if ("label" in cell) return <div className="mega-col-label">{cell.label}</div>;
  return <A href={cell.href}>{cell.text}</A>;
}

export function TopBar({ home }: { home: boolean }) {
  return (
    <div className="top-bar">
      <div className="container">
        <div className="left">Global Institutional Platform for Economic Reform &amp; National Transformation</div>
        <div className="top-utils">
          <A href="/about">About</A>
          <A href="/contact">Contact</A>
          <A href="/careers">Careers</A>
          <button type="button" className="top-search" onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH))}>
            Search
          </button>
          {home && (
            <div className="lang">
              <span className="active">EN</span> · <span>FR</span> · <span>ES</span> · <span>AR</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [panel, setPanel] = useState<Record<number, string>>({});
  const [pos, setPos] = useState({ top: 88, height: 600 });
  const headerRef = useRef<HTMLElement>(null);

  const close = useCallback(() => {
    setOpen(null);
    setMobile(false);
  }, []);

  // close everything on navigation
  useEffect(close, [pathname, close]);

  // body classes drive the existing stylesheet (mega-open / nav-open)
  useEffect(() => {
    document.body.classList.toggle("mega-open", open !== null);
    document.body.classList.toggle("nav-open", mobile);
    return () => document.body.classList.remove("mega-open", "nav-open");
  }, [open, mobile]);

  const place = useCallback(() => {
    const h = headerRef.current;
    if (!h) return;
    let top = Math.ceil(h.getBoundingClientRect().bottom);
    if (top < 40) top = 88;
    setPos({ top, height: window.innerHeight - top });
  }, []);

  useEffect(() => {
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
    };
  }, [place]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (t?.closest && !t.closest(".nav-item") && !t.closest(".mega") && !t.closest("#mobileToggle") && !t.closest(".hamburger-panel")) {
        setOpen(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [close]);

  const megaStyle = { top: pos.top, height: pos.height, maxHeight: pos.height };

  return (
    <>
      <header className="main-header" ref={headerRef}>
        <div className="container header-inner">
          <A href="/" className="logo">
            <img className="logo-img" src="/assets/logo-unera.png" alt="UNERA" />
          </A>
          <nav className="primary-nav" id="primaryNav">
            <ul className="nav-list">
              {nav.map((item, i) => {
                const active = panel[i] ?? item.rail[0]?.id;
                const body = (
                  <>
                    <div className="mega-rail">
                      {item.rail.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          className={"mega-rail-btn" + (active === r.id ? " active" : "")}
                          data-panel={r.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPanel((p) => ({ ...p, [i]: r.id }));
                          }}
                        >
                          {r.label} <span className="rail-chev">›</span>
                        </button>
                      ))}
                    </div>
                    <div className="mega-content">
                      {item.panels.map((p) => (
                        <div key={p.id} className={"mega-panel-view" + (active === p.id ? " active" : "") + (p.noFeat ? " no-feat" : "")} id={p.id}>
                          <div className="mega-main">
                            <h3>
                              {p.titleHref ? <A href={p.titleHref}>{p.title}</A> : p.title} <span className="title-arrow">→</span>
                            </h3>
                            <div className="mega-cols">
                              {p.cols.map((col, ci) => (
                                <div key={ci}>
                                  {col.map((cell, k) => (
                                    <Cell key={k} cell={cell} />
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="mega-featured">
                            <div className="feat-label">Featured</div>
                            {p.featured.map((f) => (
                              <div className="feat-item" key={f.href + f.title}>
                                <A href={f.href}>
                                  <h4>{f.title}</h4>
                                  <p>{f.text}</p>
                                </A>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
                return (
                  <li key={item.label} className={"nav-item" + (open === i ? " is-open" : "")}>
                    <a
                      href={item.href}
                      className="nav-link"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMobile(false);
                        setOpen((o) => (o === i ? null : i));
                        place();
                      }}
                    >
                      {item.label} <span className="chev">▾</span>
                    </a>
                    {item.wrapped ? (
                      <div className="mega" style={megaStyle}>
                        <div className="mega-mck">{body}</div>
                      </div>
                    ) : (
                      <div className="mega mega-mck" style={megaStyle}>
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="header-actions">
            <A href="/contact" className="btn btn-primary">
              Engage With Us
            </A>
            <button
              className="mobile-toggle"
              id="mobileToggle"
              type="button"
              aria-label="Menu"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(null);
                setMobile((m) => !m);
              }}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
      <div className="hamburger-panel" id="hamburgerPanel">
        <div className="hp-head">
          <span>UNERA Menu</span>
          <button type="button" className="hp-close" id="hpClose" aria-label="Close" onClick={() => setMobile(false)}>
            ×
          </button>
        </div>
        <div className="hp-group">Navigate</div>
        {HAMBURGER_MAIN.map(([href, label]) => (
          <A key={href} href={href}>
            {label}
          </A>
        ))}
        <div className="hp-group">Quick Links</div>
        {HAMBURGER_QUICK.map(([href, label]) => (
          <A key={href} href={href}>
            {label}
          </A>
        ))}
      </div>
      <div className="mega-backdrop" onClick={close} />
    </>
  );
}
