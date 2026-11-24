import { useCallback, useEffect, useState } from "react";
import { A } from "@/components/A";
import { photoLibrary as lib } from "@/lib/photo-library";
import { studio } from "@/lib/photos";
import { ENQUIRY_EMAIL_RE, sendEnquiry } from "./LeadForm";

/* ------- Practice hero (NK&CO structure, via H-Hunters): copy left, three rounded cards right, service band below ------- */
const SLIDES = [
  { n: "01", cat: "UNERA — Institutional overview", h: "Reform that institutions\ncan actually run.", sub: "A global institutional platform for economic reform, national transformation and long-term development.", to: "/about", cta: "Explore UNERA" },
  { n: "02", cat: "Economic reform", h: "Sequenced, owned,\nmeasurable.", sub: "National economic agendas translated into programmes with named owners and visible results.", to: "/economy", cta: "Economic reform" },
  { n: "03", cat: "Capital & finance", h: "Capital behind\nthe plan.", sub: "Capital markets, blended finance and public-private structures aligned with national priorities.", to: "/capital-markets", cta: "Capital markets" },
  { n: "04", cat: "Institutions & governance", h: "Strong institutions\noutlast cycles.", sub: "Governance, transparency and capability building that keep reform moving beyond a single term.", to: "/governance-detail", cta: "Governance" },
  { n: "05", cat: "Delivery", h: "From decision\nto delivery.", sub: "Delivery routines, monitoring and evidence that let teams adapt while keeping to the plan.", to: "/delivery", cta: "How we deliver" },
  { n: "06", cat: "Where we work", h: "One platform,\nmany regions.", sub: "Regional and country pages across Africa, Asia, Europe, the Gulf, MENA and Latin America.", to: "/countries", cta: "Browse countries" },
];
const CARDS = [
  { title: "Economic reform", to: "/economy", img: studio.corridor, desc: "Fiscal, structural and monetary reform packages built to be implemented." },
  { title: "Capital & finance", to: "/capital-markets", img: studio.floor, desc: "Aligning public resources, DFIs and private capital behind national agendas." },
  { title: "Institutions & governance", to: "/governance-detail", img: studio.boardroom, desc: "Mandates, transparency and capability that make reform durable." },
];
const COLS = [
  { title: "Economic reform", to: "/economy", items: [["Fiscal frameworks", "/fiscal"], ["Structural reform", "/structural"], ["Monetary policy", "/monetary"]] },
  { title: "Capital & finance", to: "/capital-markets", items: [["Capital markets", "/capital-markets"], ["Blended finance", "/blended-finance"], ["Climate finance", "/climate-finance"]] },
  { title: "Institutions & governance", to: "/governance-detail", items: [["Public finance", "/public-finance"], ["Governance", "/governance-detail"], ["Transparency", "/transparency"]] },
];

export function PracticeHero() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setI((v) => (v + 1) % SLIDES.length), 7000);
    return () => clearTimeout(t);
  }, [i, playing]);
  const s = SLIDES[i]!;
  return (
    <section className="ph" aria-roledescription="carousel" aria-label="UNERA practices">
      <div className="container ph-grid">
        <div className="ph-copy">
          <div>
            <p key={`c${i}`} className="ph-cat fade">{s.cat}</p>
            <h2 key={`h${i}`} className="ph-h fade">{s.h}</h2>
            <p key={`s${i}`} className="ph-sub fade">{s.sub}</p>
            <div className="ph-btns">
              <A href={s.to} className="btn btn-primary">{s.cta}</A>
              <A href="/contact" className="btn btn-outline">Discuss your agenda →</A>
            </div>
          </div>
          <div className="ph-rail">
            <p className="sx-kicker">Practice · UNERA perspectives</p>
            <div className="ph-player">
              <button type="button" aria-label={playing ? "Pause slides" : "Play slides"} onClick={() => setPlaying((p) => !p)}>{playing ? "❚❚" : "▶"}</button>
              <span>{s.n}</span>
              <div className="ph-ticks" role="tablist" aria-label="Slides">
                {SLIDES.map((sl, k) => (
                  <button key={sl.n} role="tab" aria-selected={k === i} aria-label={sl.cat} className={k <= i ? "on" : ""} onClick={() => setI(k)} />
                ))}
              </div>
              <span>{String(SLIDES.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
        <ul className="ph-cards" onMouseEnter={() => setPlaying(false)} onMouseLeave={() => setPlaying(true)}>
          {CARDS.map((c) => (
            <li key={c.title}>
              <A href={c.to} className="ph-card" style={{ backgroundImage: `url(${c.img})` }}>
                <span className="ph-card-body">
                  <strong>{c.title}</strong>
                  <em>{c.desc}</em>
                  <small>Explore →</small>
                </span>
              </A>
            </li>
          ))}
        </ul>
      </div>
      <div className="ph-band">
        <div className="container ph-band-grid">
          {COLS.map((c) => (
            <div key={c.title}>
              <p>{c.title}</p>
              <ul>
                {c.items.map(([l, h]) => (
                  <li key={h}><A href={h!}>{l}</A></li>
                ))}
              </ul>
              <A href={c.to} className="ph-band-more">Explore →</A>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Sector gallery ---------------- */
const SECTORS = [
  { t: "Energy & infrastructure", to: "/energy-infra", img: lib.windFarm },
  { t: "Electric power", to: "/electric-power", img: lib.solarField },
  { t: "Transport & logistics", to: "/transport-infra", img: lib.containerPort },
  { t: "Financial services", to: "/financial-services", img: lib.bankFacade },
  { t: "Industry", to: "/industry", img: lib.factoryFloor },
  { t: "Aerospace & aviation", to: "/aerospace", img: lib.airportTerminal },
];

export function SectorGallery() {
  return (
    <section className="sx sx-light">
      <div className="container">
        <div className="sx-head">
          <div>
            <p className="sx-kicker">Sectors</p>
            <h2>Sectors in focus</h2>
          </div>
          <p>Reform is delivered through sectors. These are the ones where UNERA partners most often build programmes.</p>
        </div>
        <div className="sg">
          {SECTORS.map((s) => (
            <A key={s.to} href={s.to} className="sg-tile" style={{ backgroundImage: `url(${s.img})` }}>
              <span>{s.t}</span>
            </A>
          ))}
          <A href="/sectors" className="sg-tile sg-all">
            <span>All sectors →</span>
          </A>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Reform models (chain / funnel / curve / equation) ---------------- */
const TABS = ["Chain", "Funnel", "Curve", "Equation"] as const;
type Tab = (typeof TABS)[number];

export function ReformModels() {
  const [tab, setTab] = useState<Tab>("Chain");
  return (
    <section className="sx sx-tint">
      <div className="container">
        <div className="sx-head">
          <div>
            <p className="sx-kicker">Frameworks</p>
            <h2>Four ways to read a reform agenda</h2>
          </div>
          <p>Short mental models UNERA teams use to test whether an agenda is likely to hold. Choose one to explore.</p>
        </div>
        <div className="rm-tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="rm-body" role="tabpanel">
          {tab === "Chain" && (
            <>
              <p className="rm-state">Every link has to hold. If one fails, the chain below it stalls.</p>
              <ol className="rm-chain">
                {[["Policy intent", "Clear objective", "Ambition without a mandate"], ["Mandate", "Named owner and authority", "Work stalls between ministries"], ["Capability", "People and systems ready", "Plans outrun delivery capacity"], ["Delivery", "Routine, tracked execution", "Drift goes unnoticed"], ["Results", "Evidence of change", "Reform cannot defend itself"]].map(([a, b, c]) => (
                  <li key={a}><strong>{a}</strong><span>{b}</span><em>If it fails: {c}</em></li>
                ))}
              </ol>
            </>
          )}
          {tab === "Funnel" && (
            <>
              <p className="rm-state">Reform leaks at every gate. Find the widest leak first.</p>
              <ol className="rm-funnel">
                {[["Agenda set", "Priorities stated", 100], ["Funded", "Budget and capital committed", 82], ["Mobilised", "Teams and partners in place", 64], ["Delivered", "Outputs reaching citizens", 46], ["Sustained", "Capability retained", 30]].map(([a, b, w]) => (
                  <li key={a as string} style={{ width: `${w}%` }}><strong>{a}</strong><span>{b}</span></li>
                ))}
              </ol>
              <p className="rm-note">Illustrative widths: the shape of the idea, not measured data.</p>
            </>
          )}
          {tab === "Curve" && (
            <>
              <p className="rm-state">Reform rarely moves in a straight line. Plan for the dip.</p>
              <ol className="rm-curve">
                {[["Announce", "Energy and expectation peak."], ["Friction", "Constraints surface; momentum dips."], ["Adapt", "Routines and evidence rebuild trust."], ["Compound", "Gains reinforce each other."]].map(([a, b], k) => (
                  <li key={a} style={{ marginTop: [0, 60, 30, 0][k] }}><strong>{a}</strong><span>{b}</span></li>
                ))}
              </ol>
            </>
          )}
          {tab === "Equation" && (
            <>
              <p className="rm-state">Delivery is a product, not a sum. If any factor is zero, so is the result.</p>
              <div className="rm-eq">
                {[["Mandate", "who decides"], ["×", ""], ["Capability", "who can do"], ["×", ""], ["Capital", "what it costs"], ["×", ""], ["Continuity", "how long it lasts"], ["=", ""], ["Results", "what changes"]].map(([a, b], k) => (
                  <div key={k} className={a!.length === 1 ? "op" : ""}><strong>{a}</strong>{b && <span>{b}</span>}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Insights subscribe band ---------------- */
export function InsightsSubscribe({ copy }: { copy?: { eyebrow: string; title: string; blurb: string } }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!ENQUIRY_EMAIL_RE.test(email.trim())) return setError("Please enter a valid email address.");
    if (!consent) return setError("Please confirm you agree to be contacted.");
    setState("sending");
    const ok = await sendEnquiry("UNERA insights subscription", { Email: email.trim() });
    if (ok) setState("done");
    else {
      setState("idle");
      setError("Something went wrong. Please try again.");
    }
  }
  return (
    <section className="sx sx-dark sub">
      <div className="container sub-inner">
        <p className="sx-kicker">{copy?.eyebrow ?? "Stay ahead"}</p>
        <h2>{copy?.title ?? "Subscribe to UNERA insights"}</h2>
        <p>{copy?.blurb ?? "Research, briefings and perspectives on economic reform, delivered by the Secretariat. No noise."}</p>
        {state === "done" ? (
          <p className="sub-done" role="status">Thank you. We will be in touch.</p>
        ) : (
          <form onSubmit={submit} noValidate>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address" />
            <button type="submit" className="btn btn-primary" disabled={state === "sending"}>Subscribe</button>
            <label className="sub-consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>I agree to receive UNERA insights by email.</span>
            </label>
            {error && <em className="lf-err sub-err">{error}</em>}
          </form>
        )}
      </div>
    </section>
  );
}
