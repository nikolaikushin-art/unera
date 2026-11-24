import { useState } from "react";
import { A } from "@/components/A";
import { photos } from "@/lib/photos";
import { photoLibrary as lib } from "@/lib/photo-library";
import { OPEN_CONTACT } from "./QuickContact";
import { InsightsSubscribe, PracticeHero, ReformModels, SectorGallery } from "./more";
import { BigStatement, CompareLedger, ContactCards, ImageMosaic, InsightsRow, LayerModel, MandateTimeline, Matrix2x2, MetricStrip, PrinciplesBand, RegionGrid, TopicChips } from "./library";

/** Plain section wrapper in the existing UNERA container. */
function Section({ id, tone = "light", children }: { id?: string; tone?: "light" | "tint" | "dark"; children: React.ReactNode }) {
  return (
    <section id={id} className={`sx sx-${tone}`}>
      <div className="container">{children}</div>
    </section>
  );
}

export function PhotoBand() {
  const items = [
    { src: lib.nkMeeting, kicker: "Governance", title: "Where decisions are made", href: "/governance-detail" },
    { src: lib.nkBriefing, kicker: "Leadership", title: "Leadership in motion", href: "/leadership" },
    { src: lib.nkOffice, kicker: "Delivery", title: "Institutions at work", href: "/delivery" },
  ];
  return (
    <Section tone="light">
      <div className="sx-head">
        <div>
          <p className="sx-kicker">The work</p>
          <h2>Institutional reform, up close</h2>
        </div>
        <p>From the boardroom to the delivery floor: how UNERA works with partners to design reform and see it through.</p>
      </div>
      <div className="sx-photos">
        {items.map((it) => (
          <A key={it.href} href={it.href} className="sx-photo">
            <img src={it.src} alt="" loading="lazy" />
            <span className="sx-photo-cap">
              <small>{it.kicker}</small>
              <strong>{it.title}</strong>
            </span>
          </A>
        ))}
      </div>
    </Section>
  );
}

const STEPS = [
  { n: "01", t: "Diagnose", d: "Make the constraint, the stakeholder and the decision horizon explicit.", img: photos.glassTower },
  { n: "02", t: "Design", d: "Choose a small number of moves that reinforce one another.", img: photos.meetingGlass },
  { n: "03", t: "Deliver", d: "Give teams the rhythm, authority and evidence needed to adapt.", img: photos.teamTable },
  { n: "04", t: "Institutionalise", d: "Leave behind capability, ownership and a reason to keep improving.", img: photos.citySkylineNight },
];

export function ProcessTimeline() {
  return (
    <Section tone="tint">
      <div className="sx-head">
        <div>
          <p className="sx-kicker">Method</p>
          <h2>From clarity to durable movement</h2>
        </div>
        <p>Four stages, each with an owner and an output, so reform moves from intent to something institutions can run.</p>
      </div>
      <ol className="sx-steps">
        {STEPS.map((s) => (
          <li key={s.n}>
            <div className="sx-step-img" style={{ backgroundImage: `url(${s.img})` }} />
            <span className="sx-step-n">{s.n}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

const MODELS = [
  { n: "01", name: "Advisory mandate", how: "Senior-led diagnostic and policy advice with a defined scope, written deliverables and regular reporting.", basis: "Scope agreed in writing", pace: "Fixed timeline, regular reporting", suits: "Reform design and sequencing questions" },
  { n: "02", name: "Embedded delivery", how: "A joint delivery unit working alongside the ministry or institution to run implementation routines.", basis: "Programme scope agreed in writing", pace: "Continuous, reviewed on a set cadence", suits: "Programmes that must be owned locally" },
  { n: "03", name: "Partnership programme", how: "A multi-year platform aligning governments, development finance institutions and private capital.", basis: "Partnership terms agreed in writing", pace: "Multi-year, milestone based", suits: "National agendas that span cycles" },
];

/** Ledger-style engagement matrix. `highlight` marks the model that usually fits the page. */
export function EngagementModels({ subject, highlight }: { subject?: string; highlight?: 0 | 1 | 2 }) {
  return (
    <Section tone="light">
      <div className="sx-head">
        <div>
          <p className="sx-kicker">Engagement models</p>
          <h2>How partners work with UNERA</h2>
        </div>
        <p>
          {subject
            ? `Three ways to commission the work. The highlighted model is the one most often used for ${subject}; the others remain available.`
            : "Three ways to commission the work, each scoped in writing before anything starts."}
        </p>
      </div>
      <div className="sx-ledger">
        <div className="sx-ledger-head">
          <span />
          <span>Model</span>
          <span>How it runs</span>
          <span>Basis</span>
          <span>Pace</span>
          <span>Best for</span>
        </div>
        {MODELS.map((m, i) => (
          <div key={m.n} className={"sx-ledger-row" + (highlight === i ? " on" : "")}>
            <span className="sx-n">{m.n}</span>
            <div>
              <h3>{m.name}</h3>
              {highlight === i && <small>Typical for {subject ?? "this mandate"}</small>}
            </div>
            <p>{m.how}</p>
            <p><b>Basis</b>{m.basis}</p>
            <p><b>Pace</b>{m.pace}</p>
            <p><b>Best for</b>{m.suits}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const FAQS = [
  { q: "How do we start a conversation with UNERA?", a: "Use the enquiry form or write to the Secretariat at secretariat@unera.world. Messages are routed to the relevant team." },
  { q: "Which institutions does UNERA work with?", a: "Governments and ministries, finance ministries, central banks, development finance institutions and private-capital partners." },
  { q: "Where does UNERA operate?", a: "Across Africa, Asia, Europe, the Gulf and wider MENA region, and Latin America. See Where We Work for the regional pages." },
  { q: "Can organisations join or partner with UNERA?", a: "Yes. The Membership and Partnerships pages describe the routes, and the Secretariat can advise on the right one." },
  { q: "Who should media and press enquiries go to?", a: "Write to media@unera.world, or see the Media page for current announcements." },
];

export const CONTACT_FAQS = [
  { q: "Who should I write to first?", a: "The Secretariat at secretariat@unera.world. Say which country, sector or programme you are asking about and the message is routed accordingly." },
  { q: "Where do partnership proposals go?", a: "Partnership and alliance enquiries go to partnerships@unera.world. The Partnerships and Alliances pages explain the routes available." },
  { q: "How do media and speaker requests work?", a: "Send them to media@unera.world. The Media and Events pages list current announcements and upcoming convenings." },
  { q: "Is UNERA hiring?", a: "Open roles and internship information are on the Careers and Internships pages." },
  { q: "Can UNERA brief a delegation or ministry team?", a: "Use the enquiry form to describe the audience and the topic. The Secretariat will confirm what is possible." },
];

export function FaqSection({ title = "Frequently asked questions", faqs = FAQS }: { title?: string; faqs?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section tone="tint">
      <div className="sx-faq">
        <div>
          <p className="sx-kicker">FAQ</p>
          <h2>{title}</h2>
          <button type="button" className="btn btn-primary" onClick={() => window.dispatchEvent(new Event(OPEN_CONTACT))}>
            Ask a question
          </button>
        </div>
        <ul>
          {faqs.map((f, i) => (
            <li key={f.q}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                {f.q}
                <span aria-hidden="true">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && <p>{f.a}</p>}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function HomeExtras() {
  return (
    <>
      <PracticeHero />
      <MetricStrip />
      <BigStatement />
      <SectorGallery />
      <LayerModel />
      <PhotoBand />
      <RegionGrid />
      <ReformModels />
      <CompareLedger />
      <ImageMosaic />
      <Matrix2x2 />
      <MandateTimeline />
      <PrinciplesBand />
      <TopicChips />
      <InsightsRow />
      <ProcessTimeline />
      <EngagementModels />
      <ContactCards />
      <InsightsSubscribe />
      <FaqSection />
    </>
  );
}
