import { useMemo, useState } from "react";
import { A } from "@/components/A";
import type { PageFields } from "@/generated/PageTemplate";
import { buildExtras, type Block } from "@/lib/page-extras";
import { OPEN_CONTACT } from "./QuickContact";
import { InsightsSubscribe } from "./more";
import { CompareLedger, LayerModel, Matrix2x2 } from "./library";

function Frame({ tone = "light", children }: { tone?: "light" | "tint"; children: React.ReactNode }) {
  return (
    <section className={`sx sx-${tone}`}>
      <div className="container">{children}</div>
    </section>
  );
}

function BlockView({ b, photo, tone, label }: { b: Block; photo: string; tone: "light" | "tint"; label: string }) {
  const [open, setOpen] = useState<number | null>(0);
  switch (b.type) {
    case "spotlight":
      return (
        <Frame tone={tone}>
          <div className={"pe-spot" + (b.flip ? " flip" : "")}>
            <figure className="pe-spot-img" style={{ backgroundImage: `url(${photo})` }}>
              <figcaption>{b.caption}</figcaption>
            </figure>
            <div>
              <p className="sx-kicker">{b.kicker}</p>
              <h2>{b.title}</h2>
              <p className="pe-lead">{b.lead}</p>
              <p className="pe-body">{b.body}</p>
              <ul className="pe-bullets">
                {b.bullets.map((x) => (
                  <li key={x.t}>
                    <strong>{x.t}</strong>
                    <span>{x.d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Frame>
      );
    case "questions":
      return (
        <Frame tone={tone}>
          <div className="sx-faq">
            <div>
              <p className="sx-kicker">Questions</p>
              <h2>{b.title}</h2>
              <button type="button" className="btn btn-primary" onClick={() => window.dispatchEvent(new Event(OPEN_CONTACT))}>
                Ask a question
              </button>
            </div>
            <ul>
              {b.items.map((f, i) => (
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
        </Frame>
      );
    case "ledger":
      return (
        <Frame tone={tone}>
          <div className="sx-head">
            <div>
              <p className="sx-kicker">Engagement</p>
              <h2>{b.title}</h2>
            </div>
            <p>{b.intro}</p>
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
            {b.rows.map((m, i) => (
              <div key={m.name} className={"sx-ledger-row" + (b.highlight === i ? " on" : "")}>
                <span className="sx-n">0{i + 1}</span>
                <div>
                  <h3>{m.name}</h3>
                  {b.highlight === i && <small>Common fit</small>}
                </div>
                <p>{m.how}</p>
                <p><b>Basis</b>{m.basis}</p>
                <p><b>Pace</b>{m.pace}</p>
                <p><b>Best for</b>{m.suits}</p>
              </div>
            ))}
          </div>
        </Frame>
      );
    case "moves":
      return (
        <Frame tone={tone}>
          <div className="sx-head">
            <div>
              <p className="sx-kicker">Keep exploring</p>
              <h2>{b.title}</h2>
            </div>
            <span />
          </div>
          <div className="pe-moves">
            {b.items.map((m) => (
              <A key={m.href} href={m.href} className="pe-move">
                <small>{m.where}</small>
                <strong>{m.label}</strong>
                <span>Open page →</span>
              </A>
            ))}
          </div>
        </Frame>
      );
    case "compare":
      return <CompareLedger label={label} />;
    case "matrix":
      return <Matrix2x2 label={label} cells={b.cells} />;
    case "layers":
      return <LayerModel title={b.title} label={label} />;
    default:
      return (
        <Frame tone={tone}>
          <div className="sx-head">
            <div>
              <p className="sx-kicker">Readiness</p>
              <h2>{b.title}</h2>
            </div>
            <span />
          </div>
          <ol className="pe-check">
            {b.items.map((t) => {
              const [head, ...rest] = t.split(": ");
              return (
                <li key={t}>
                  <strong>{head}</strong>
                  <span>{rest.join(": ")}</span>
                </li>
              );
            })}
          </ol>
        </Frame>
      );
  }
}

/** Page-specific closing sections: unique photo, copy and layout mix for every page. */
export function PageExtras({ slug, label, f }: { slug: string; label: string; f: PageFields }) {
  const x = useMemo(() => buildExtras(slug, label, f), [slug, label, f]);
  return (
    <>
      {x.blocks.map((b, i) => (
        <BlockView key={b.type} b={b} photo={x.photo} label={label} tone={i % 2 === 0 ? "light" : "tint"} />
      ))}
      <InsightsSubscribe copy={x.subscribe} />
    </>
  );
}
