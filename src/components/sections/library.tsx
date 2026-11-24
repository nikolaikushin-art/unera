import { A } from "@/components/A";
import { photoLibrary as lib } from "@/lib/photo-library";
import { pick } from "@/lib/page-extras";

/** Extra section layouts ported from the H-Hunters / NK&CO section library, written with UNERA content. */
function Frame({ tone = "light", children, id }: { tone?: "light" | "tint" | "dark"; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className={`sx sx-${tone}`}>
      <div className="container">{children}</div>
    </section>
  );
}
function Head({ kicker, title, intro }: { kicker: string; title: string; intro?: string }) {
  return (
    <div className="sx-head">
      <div>
        <p className="sx-kicker">{kicker}</p>
        <h2>{title}</h2>
      </div>
      {intro ? <p>{intro}</p> : <span />}
    </div>
  );
}

/* Metric strip (figures are the ones already published on UNERA's original pages) */
export function MetricStrip() {
  const m = [["120+", "Flagship programmes supported"], ["15+", "Years of institutional delivery"], ["47", "Partner nations engaged"], ["$12B+", "Capital mobilised with partners"]];
  return (
    <Frame tone="dark">
      <div className="lib-metrics">
        {m.map(([n, l]) => (
          <div key={l}>
            <strong>{n}</strong>
            <span>{l}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* Big statement */
export function BigStatement() {
  return (
    <Frame tone="light">
      <p className="lib-statement">
        Reform is not announced. <em>It is built, owned and delivered.</em>
      </p>
    </Frame>
  );
}

/* Layer model */
export function LayerModel({ title = "The layers of a reform platform", label }: { title?: string; label?: string }) {
  const layers = [
    ["Mandate", label ? `Who is accountable for ${label.toLowerCase()} outcomes` : "Who is accountable for outcomes"],
    ["Policy", "The sequenced choices that turn intent into a plan"],
    ["Institutions", "The organisations and capabilities that run the plan"],
    ["Capital", "Public budgets, DFIs and private capital aligned to the pace"],
    ["Delivery", "Routines, evidence and adaptation that keep results moving"],
  ];
  return (
    <Frame tone="light">
      <Head kicker="Architecture" title={title} intro="Five layers, each dependent on the one beneath it. A weak layer limits everything above." />
      <ol className="lib-layers">
        {layers.map(([a, b], i) => (
          <li key={a} style={{ marginLeft: `${(layers.length - 1 - i) * 3}%` }}>
            <span>0{layers.length - i}</span>
            <strong>{layers[layers.length - 1 - i]![0]}</strong>
            <em>{layers[layers.length - 1 - i]![1]}</em>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

/* Region link grid */
export function RegionGrid() {
  const r = [["Africa", "/africa"], ["Asia", "/asia"], ["Europe", "/europe"], ["Gulf (GCC)", "/gcc"], ["Middle East & North Africa", "/mena"], ["Latin America", "/latam"]];
  return (
    <Frame tone="tint">
      <Head kicker="Where we work" title="Regions and countries" intro="Regional pages lead to country pages, programmes and the teams supporting them." />
      <div className="lib-regions">
        {r.map(([l, h]) => (
          <A key={h} href={h!}>
            <span>{l}</span>
            <i>→</i>
          </A>
        ))}
        <A href="/countries" className="all">
          <span>All countries</span>
          <i>→</i>
        </A>
      </div>
    </Frame>
  );
}

/* Comparison ledger */
export function CompareLedger({ label }: { label?: string }) {
  const all = [
    ["Starts from", "An announcement", "A diagnosed constraint"],
    ["Ownership", "Shared, so unclear", "Named, with a mandate"],
    ["Sequencing", "Everything at once", "A few moves that reinforce each other"],
    ["Evidence", "Reported at the end", "Used every cycle to adapt"],
    ["Capability", "Assumed", "Built alongside delivery"],
    ["Funding", "Committed in principle", "Aligned to the delivery pace"],
    ["Partners", "Informed", "Given a clear role and a reason to stay"],
    ["Continuity", "Tied to one term", "Designed to outlast administrations"],
  ];
  const rows = label ? pick(all, `compare:${label}`, 5) : all.slice(0, 5);
  return (
    <Frame tone="tint">
      <Head kicker="Contrast" title={label ? `${label}: announced reform vs delivered reform` : "Announced reform vs delivered reform"} intro="Where the difference usually lies." />
      <div className="lib-compare">
        <div className="lib-compare-head"><span /><span>Announced</span><span>Delivered</span></div>
        {rows.map(([a, b, c]) => (
          <div key={a}><b>{a}</b><span>{b}</span><span className="win">{c}</span></div>
        ))}
      </div>
    </Frame>
  );
}

/* 2x2 matrix */
export function Matrix2x2({ label, cells }: { label?: string; cells?: [string, string, string, string] }) {
  const c = cells ?? ["Reform on paper", "Reform that endures", "Reform that stalls", "Reform that outruns capacity"];
  const d = [c[2], c[1], c[0], c[3]];
  const copy = ["Capacity is high but the ambition is not yet set.", "Ambition and capacity move together: the target position.", "Neither the ambition nor the capacity is in place yet.", "The plan is bold but the institutions cannot yet carry it."];
  return (
    <Frame tone="light">
      <Head kicker="Framework" title={label ? `Ambition and capacity in ${label}` : "Ambition and capacity"} intro="Where an agenda sits tells you what to do next: build capacity, raise ambition, or both." />
      <div className="lib-matrix">
        <span className="y">High capacity</span>
        <span className="y2">Low capacity</span>
        <div className="grid">
          {d.map((t, i) => (
            <div key={t + i} className={i === 1 ? "target" : ""}>
              <strong>{t}</strong>
              <em>{copy[i]}</em>
            </div>
          ))}
        </div>
        <span className="x1">Lower ambition</span>
        <span className="x2">Higher ambition</span>
      </div>
    </Frame>
  );
}

/* Vertical timeline */
export function MandateTimeline() {
  const s = [["Frame", "State the national objective and the decision horizon."], ["Diagnose", "Find the constraint that blocks the most progress."], ["Sequence", "Choose the first moves and what follows them."], ["Mobilise", "Align institutions, capital and partners."], ["Deliver", "Run routines; track evidence; adapt."], ["Embed", "Transfer capability so results outlast advisers."]];
  return (
    <Frame tone="tint">
      <Head kicker="Anatomy" title="The shape of a reform mandate" intro="Six stages in order. Each ends with something an institution can use." />
      <ol className="lib-timeline">
        {s.map(([a, b], i) => (
          <li key={a}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{a}</strong>
            <p>{b}</p>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

/* Principles band */
export function PrinciplesBand() {
  const p = [["Evidence before ambition", "Diagnose the constraint before choosing the remedy."], ["Ownership over output", "A named owner beats a perfect plan."], ["Capability that stays", "Leave institutions stronger than we found them."], ["Candour with partners", "Say what is working and what is not, early."]];
  return (
    <Frame tone="dark">
      <Head kicker="Principles" title="How we work" />
      <div className="lib-principles">
        {p.map(([a, b], i) => (
          <div key={a}>
            <span>0{i + 1}</span>
            <strong>{a}</strong>
            <p>{b}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* Image mosaic */
export function ImageMosaic() {
  const imgs = [lib.dubaiStreet, lib.cityAerial, lib.glassFacade, lib.officeAtrium, lib.conferenceHall];
  return (
    <Frame tone="light">
      <Head kicker="Perspective" title="Institutions, cities and the people who run them" />
      <div className="lib-mosaic">
        {imgs.map((u, i) => (
          <div key={i} className={"m" + i} style={{ backgroundImage: `url(${u})` }} role="img" aria-label="" />
        ))}
      </div>
    </Frame>
  );
}

/* Topic chips */
export function TopicChips() {
  const t = [["Economy", "/economy"], ["Climate finance", "/climate-finance"], ["Digital infrastructure", "/digital-infra"], ["AI governance", "/ai-governance"], ["Trade", "/trade"], ["Urban", "/urban"], ["Education", "/education-sector"], ["Healthcare", "/healthcare-sector"], ["Governance", "/governance-detail"], ["Fiscal policy", "/fiscal"], ["Water", "/water"], ["Transport", "/transport"]];
  return (
    <Frame tone="tint">
      <Head kicker="Topics" title="Explore by topic" />
      <div className="lib-chips">
        {t.map(([l, h]) => (
          <A key={h} href={h!}>{l}</A>
        ))}
      </div>
    </Frame>
  );
}

/* Insights row */
export function InsightsRow() {
  const i = [["Policy briefs", "/policy-briefs", "Short, decision-ready analysis"], ["Working papers", "/working-papers", "Longer research in progress"], ["Case studies", "/case-studies", "Reform in practice"], ["Podcast", "/podcast", "Conversations with practitioners"], ["Roundtables", "/roundtables", "Convenings and summaries"], ["Week in charts", "/week-in-charts", "The numbers behind the news"]];
  return (
    <Frame tone="light">
      <Head kicker="Insights" title="Research and perspectives" />
      <div className="lib-insights">
        {i.map(([a, h, d]) => (
          <A key={h} href={h!}>
            <strong>{a}</strong>
            <span>{d}</span>
          </A>
        ))}
      </div>
    </Frame>
  );
}

/* Contact cards */
export function ContactCards() {
  const c = [["Secretariat", "secretariat@unera.world", "General and programme enquiries"], ["Partnerships", "partnerships@unera.world", "Alliances, funding and collaboration"], ["Media", "media@unera.world", "Press and speaker requests"]];
  return (
    <Frame tone="tint">
      <Head kicker="Contact" title="Reach the right team" />
      <div className="lib-contacts">
        {c.map(([a, e, d]) => (
          <a key={e} href={`mailto:${e}`}>
            <small>{a}</small>
            <strong>{e}</strong>
            <span>{d}</span>
          </a>
        ))}
      </div>
    </Frame>
  );
}
