import { photoLibrary } from "@/lib/photo-library";
import { index as pageIndex, SPECIAL } from "@/lib/pages";
import navData from "@/data/nav.json";
import type { NavItem } from "@/data/types";
import type { PageFields } from "@/generated/PageTemplate";

/* ------------------------------------------------------------------ helpers */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic "random" pick of n distinct items. */
export function pick<T>(items: readonly T[], seed: string, n: number): T[] {
  const a = items.map((x, i) => ({ x, k: hash(`${seed}:${i}`) }));
  a.sort((p, q) => p.k - q.k);
  return a.slice(0, n).map((e) => e.x);
}
const one = <T,>(items: readonly T[], seed: string) => pick(items, seed, 1)[0] as T;
const fill = (t: string, v: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k: string) => v[k] ?? "");
const clean = (s: string | undefined) => (s ?? "").replace(/\s+/g, " ").replace(/[›…]+$/g, "").trim();
const sentences = (s: string | undefined, n: number) => {
  const parts = clean(s).split(/(?<=[.?!])\s+/);
  return parts.slice(0, n).join(" ");
};

/* ------------------------------------------------------------------ photos */
/** Photos already placed on the home page, so a page never repeats them. */
export const HOME_PHOTO_KEYS = ["heroSkyline", "citySkylineNight", "glassTower", "meetingGlass", "teamTable", "windFarm", "solarField", "containerPort", "bankFacade", "factoryFloor", "airportTerminal", "nkMeeting", "nkBriefing", "nkOffice", "dubaiStreet", "cityAerial", "glassFacade", "officeAtrium", "conferenceHall"];
const EXCLUDE =
  /portrait|woman|women|man[A-Z]|men[A-Z]|girl|boy|child|kid|baby|family|couple|wedding|hotel|villa|resort|pool|beach|spa[A-Z]|yacht|chef|cook|kitchen|food|bowl|dining|restaurant|bar[A-Z]|cafe|coffee|butler|nanny|maid|housekeep|laundry|bedroom|bathroom|living|sofa|garden|lawn|pet[A-Z]|dog|chauffeur|limo|luxury|suite|lobby|interior|home|house|apartment|interview|handshake|hands|smile|celebrate|people|human|staff|worker|crew|person|face|selfie|laugh|nurse|doctor|waiter|guest|bride|massage|overwater|palm|marina|sunset|healthy|fashion|shop|retail|wine|brunch|plate|steak|spice|friends|host|banquet|event|networking|candidate|^re[A-Z]|^rec[A-Z]|^hr[A-Z]|^nkVilla|^nkDubai|^nkPalm|^nkMarina|^nkBay|keys|signing|claude/;

const TOPIC: [RegExp, string[]][] = [
  [/energy|oil|power|green|climate|sustain|environment|water/, ["powerLines", "hydroDam", "nvSunWindowBuilding"]],
  [/transport|logistics|trade|travel|mobility|transit/, ["logisticsPort", "railStation", "airportNight", "airportTravel"]],
  [/finance|capital|debt|fiscal|bank|monetary|invest|fdi|ppps|blended|^ma$/, ["financeCharts", "dataDashboard", "analytics"]],
  [/industry|chemicals|automotive|metals|mining|engineering|packaging|semiconductors|aerospace|manufactur/, ["industrialPlant", "nvFactorySmoke", "constructionSite", "maintenance"]],
  [/education|alumni|internship|institute-mobility/, ["universityCampus", "universityQuad", "lectureHall", "libraryStacks"]],
  [/health|life-sciences/, ["hospitalCorridor", "clinicalLab", "researchLab"]],
  [/digital|ai-|data|tech|telecom|innovation|intelligence|observatory/, ["serverRoom", "cloudTech", "codeScreen", "networkCables"]],
  [/urban|infrastructure|real-estate|locations/, ["cityAerial", "glassFacade", "reCraneSky", "skylineDay"]],
];

function assignPhotos(): Record<string, string> {
  const lib = photoLibrary as Record<string, string>;
  const taken = new Set<string>(HOME_PHOTO_KEYS);
  const pool = Object.keys(lib).filter((k) => !EXCLUDE.test(k) && !taken.has(k));
  const out: Record<string, string> = {};
  const slugs = Object.keys(pageIndex).filter((s) => s !== "home" && !(SPECIAL as readonly string[]).includes(s)).sort();
  for (const slug of slugs) {
    let key: string | undefined;
    for (const [re, cands] of TOPIC) {
      if (!re.test(slug)) continue;
      key = cands.find((c) => lib[c] && !taken.has(c));
      if (key) break;
    }
    if (!key) {
      let i = hash(slug) % pool.length;
      for (let n = 0; n < pool.length; n++, i = (i + 1) % pool.length) {
        const cand = pool[i]!;
        if (!taken.has(cand)) {
          key = cand;
          break;
        }
      }
    }
    if (!key) continue;
    taken.add(key);
    out[slug] = lib[key]!;
  }
  return out;
}
export const pagePhotos = assignPhotos();

/* ------------------------------------------------------------------ related pages */
const nav = navData as unknown as NavItem[];
export function relatedPages(slug: string): { label: string; href: string; where: string }[] {
  const href = `/${slug}`;
  for (const m of nav)
    for (const p of m.panels) {
      const cells = p.cols.flat().filter((c): c is { text: string; href: string } => "href" in c);
      if (cells.some((c) => c.href === href) || p.titleHref === href) {
        const sibs = cells.filter((c) => c.href !== href && c.href.startsWith("/")).map((c) => ({ label: c.text, href: c.href, where: `${m.label} / ${p.title}` }));
        if (sibs.length >= 3) return pick(sibs, slug, 3);
      }
    }
  const all = Object.entries(pageIndex).filter(([s]) => s !== slug && s !== "home").map(([s, v]) => ({ label: v.label, href: `/${s}`, where: "Related pages" }));
  return pick(all, slug, 3);
}

/* ------------------------------------------------------------------ content blocks */
export type Block =
  | { type: "spotlight"; kicker: string; title: string; lead: string; body: string; bullets: { t: string; d: string }[]; caption: string; flip: boolean }
  | { type: "questions"; title: string; items: { q: string; a: string }[] }
  | { type: "ledger"; title: string; intro: string; rows: { name: string; how: string; basis: string; pace: string; suits: string }[]; highlight: number }
  | { type: "moves"; title: string; items: { label: string; href: string; where: string }[] }
  | { type: "checklist"; title: string; items: string[] }
  | { type: "compare" }
  | { type: "matrix"; cells: [string, string, string, string] }
  | { type: "layers"; title: string };

export interface Extras {
  photo: string;
  blocks: Block[];
  subscribe: { eyebrow: string; title: string; blurb: string };
}

const LAYOUTS = ["spotlight", "questions", "ledger", "moves", "checklist", "compare", "matrix", "layers"] as const;

export function buildExtras(slug: string, label: string, f: PageFields): Extras {
  const ff = f as unknown as Record<string, string>;
  const lens = [clean(ff["container_experience_cards_h3"]), clean(ff["container_experience_cards_h3_2"]), clean(ff["container_experience_cards_h3_3"])].filter(Boolean);
  const stage = clean(ff["container_experience_image_span"]).replace(/^UNERA \/ /, "") || "reform delivery";
  const v = { label, lens1: lens[0] ?? "delivery", lens2: lens[1] ?? "capability", lens3: lens[2] ?? "capital", stage: stage.toLowerCase(), l: label.toLowerCase() };
  const s = (k: string) => `${slug}:${k}`;
  const helpItems = Array.from({ length: 8 }, (_, i) => {
    const sfx = i === 0 ? "" : `_${i + 1}`;
    return { t: clean(ff[`help_grid_help_item_h3${sfx}`]), d: clean(ff[`help_grid_help_item_p${sfx}`]) };
  }).filter((x) => x.t && x.d);

  // Every page gets its own photograph (spotlight) plus two other layouts, in a page-specific order.
  const others: (typeof LAYOUTS)[number][] = pick(LAYOUTS.filter((l) => l !== "spotlight"), s("layout"), 2);
  const order: (typeof LAYOUTS)[number][] = [...others];
  order.splice(hash(s("pos")) % 3, 0, "spotlight");
  const blocks: Block[] = order.map((type): Block => {
    switch (type) {
      case "spotlight":
        return {
          type,
          kicker: one(["In practice", "The working view", "What it takes", "Field notes", "Operating lens", "Why it matters"], s("sk")),
          title: fill(one(["Where {label} turns into decisions", "{label}: from intent to institution", "What makes {label} reform hold", "Making {label} work beyond one cycle", "The practical case for {label} reform", "{label}, one decision at a time"], s("st")), v),
          lead: sentences(ff["container_experience_lead_p"], 1) || sentences(ff["impact_banner_p"], 1),
          body: sentences(ff["container_experience_feature_copy_p_2"] || ff["experience_overview_container_p"], 2),
          bullets: pick(helpItems, s("sb"), 3),
          caption: `UNERA / ${stage}`,
          flip: hash(s("flip")) % 2 === 0,
        };
      case "questions": {
        const pool: { q: string; a: string }[] = [
          { q: fill("What does UNERA do on {label}?", v), a: sentences(ff["impact_banner_p"], 2) },
          { q: fill("Where should a {label} agenda start?", v), a: fill("With a clear diagnosis of the binding constraint. {x}", { x: sentences(ff["experience_overview_container_p"], 1) }) },
          { q: clean(ff["container_page_question_h3"]), a: clean(ff["experience_cards_experience_card_dark_p"]) },
          { q: fill("How does {lens1} fit into {label}?", v), a: clean(ff["container_experience_cards_p"]) },
          { q: fill("What role does {lens2} play in {label}?", v), a: clean(ff["container_experience_cards_p_2"]) },
          { q: fill("Why does {lens3} matter for {label}?", v), a: clean(ff["container_experience_cards_p_3"]) },
          { q: fill("Who should we contact about {label}?", v), a: fill("Write to the Secretariat at secretariat@unera.world and mention {label}; the enquiry is routed to the relevant team.", v) },
          { q: fill("Where can I read UNERA's thinking on {label}?", v), a: fill("The Insights section collects research, briefings and case studies, and this page lists the latest on {label}.", v) },
          { q: fill("Can {label} reform survive a change of administration?", v), a: sentences(ff["feat_section_container_p_2"], 1) || "That is the design test: reform needs owners, routines and evidence that outlast a single term." },
        ].filter((x) => x.q && x.a);
        return { type, title: one(["Questions on {label}", "What leaders ask about {label}", "{label}: common questions", "Before you start on {label}"].map((t) => fill(t, v)), s("qt")), items: pick(pool, s("qi"), 4) };
      }
      case "ledger": {
        const rows = [
          { name: "Advisory mandate", how: ["Senior-led diagnostic and policy advice with written deliverables.", "A scoped advisory engagement with named leads and regular reporting.", "Short, senior diagnostic work that ends in a decision-ready recommendation."], basis: "Scope agreed in writing", pace: ["Fixed timeline, regular reporting", "Time-boxed, with reviews at set points", "Short cycles with a clear end-point"], suits: ["{label} questions that need an outside diagnosis", "Sequencing choices in {label}", "Teams shaping a first {label} agenda"] },
          { name: "Embedded delivery", how: ["A joint delivery unit working alongside the institution.", "UNERA specialists embedded with your team to run routines.", "A shared unit that builds delivery habits inside the ministry."], basis: "Programme scope agreed in writing", pace: ["Continuous, reviewed on a set cadence", "Steady rhythm with monthly reviews", "Ongoing, with milestones agreed up front"], suits: ["{label} programmes that must be owned locally", "Implementation that needs daily support", "{label} work already approved and moving"] },
          { name: "Partnership programme", how: ["A multi-year platform aligning governments, DFIs and private capital.", "A long-horizon partnership across institutions and funders.", "A structured alliance that spans political cycles."], basis: "Partnership terms agreed in writing", pace: ["Multi-year, milestone based", "Phased across several years", "Long horizon, reviewed annually"], suits: ["National {label} agendas that span cycles", "{label} efforts needing many funders", "Cross-border {label} collaboration"] },
        ].map((r, i) => ({ name: r.name, how: one(r.how, s(`lh${i}`)), basis: r.basis, pace: one(r.pace, s(`lp${i}`)), suits: fill(one(r.suits, s(`ls${i}`)), v) }));
        return { type, title: one(["How partners engage on {label}", "Three ways to commission {label} work", "Working with UNERA on {label}"].map((t) => fill(t, v)), s("lt")), intro: fill(one(["Each model is scoped in writing before work starts. The marked row is the one most often used for {l}.", "Pick the shape that matches your decision horizon. For {l}, the marked row is the usual starting point.", "Three structures, one standard: scope agreed first. The marked row is the common fit for {l}."], s("li")), v), rows, highlight: hash(s("lh")) % 3 };
      }
      case "moves":
        return { type, title: one(["Related work to {label}", "Read next from {label}", "Connected to {label}", "Where {label} leads"].map((t) => fill(t, v)), s("mt")), items: relatedPages(slug) };
      case "compare":
        return { type };
      case "matrix":
        return { type, cells: [fill("{label} on paper", v), fill("{label} that endures", v), fill("{label} that stalls", v), fill("{label} that outruns capacity", v)] };
      case "layers":
        return { type, title: one(["The layers behind {label}", "What {label} reform stands on", "Five layers of {label} delivery"].map((t) => fill(t, v)), s("yt")) };
      default: {
        const items = [
          "Name the owner: who is accountable for {label} results, by name and mandate?",
          "Agree the constraint: which single constraint, if removed, would unlock the most in {label}?",
          "Sequence the moves: what has to happen first for {lens1} to take hold?",
          "Fund the delivery: is capital for {label} aligned with the pace the plan assumes?",
          "Prove it early: what visible result in {label} can partners see within the first cycle?",
          "Protect continuity: how will {label} work survive a change of administration?",
          "Measure outcomes: which {label} measure tracks opportunity created, not only activity done?",
          "Build capability: who will run {label} routines once advisers step back?",
          "Connect the pieces: how do {lens2} and {lens3} reinforce one another in {label}?",
        ];
        return { type: "checklist", title: one(["Five checks before commissioning {label} work", "Is {label} ready to move? Five questions", "A short readiness test for {label}", "Five questions to settle on {label}"].map((t) => fill(t, v)), s("ct")), items: pick(items, s("ci"), 5).map((t) => fill(t, v)) };
      }
    }
  });

  return {
    photo: pagePhotos[slug] ?? "",
    blocks,
    subscribe: {
      eyebrow: fill(one(["Stay ahead", "{label} briefings", "Keep {label} in view", "From the Secretariat"], s("e")), v),
      title: fill(one(["Subscribe to the {label} briefing", "Get {label} insights in your inbox", "Follow {label} with UNERA", "{label}: UNERA insights, delivered"], s("h")), v),
      blurb: fill(one(["A short, dated note on {label}: what changed and what it means for the next decision.", "Research and briefings on {label}, written for leaders who need more than headlines.", "What is moving in {label}, and how reform partners are responding.", "Perspectives on {label} from the Secretariat, sent when there is something worth saying."], s("b")), v),
    },
  };
}
