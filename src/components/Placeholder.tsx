import { A } from "@/components/A";

/** Shown for pages the original site linked to but never published. */
export function Placeholder({ label }: { label: string }) {
  return (
    <>
      <div className="page-breadcrumb-bar">
        <div className="container">
          <A href="/">Home</A> / {label}
        </div>
      </div>
      <section className="cap-hero">
        <div className="ch-text">
          <h1>{label}</h1>
          <p className="ch-sub">This page is being prepared. In the meantime, the Secretariat can answer any question about {label.toLowerCase()}.</p>
          <A href="/contact" className="btn-blue">
            ✉ Get in touch
          </A>
        </div>
        <div className="ch-visual" style={{ backgroundImage: "url('/assets/globe-network.jpg')" }}></div>
      </section>
    </>
  );
}
