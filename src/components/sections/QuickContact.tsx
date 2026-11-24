import { useEffect, useState } from "react";
import { LeadForm } from "./LeadForm";

export const OPEN_CONTACT = "unera:open-contact";

/** Slide-over enquiry panel plus floating actions. Open anywhere via window.dispatchEvent(new Event(OPEN_CONTACT)). */
export function QuickContact() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const scroll = () => setScrolled(window.scrollY > 600);
    window.addEventListener(OPEN_CONTACT, show);
    window.addEventListener("keydown", key);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener(OPEN_CONTACT, show);
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", scroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="float-actions">
        <button type="button" className="float-enquire" onClick={() => setOpen(true)}>
          Enquire
        </button>
        <button
          type="button"
          className={"float-top" + (scrolled ? " show" : "")}
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      </div>
      {open && (
        <div className="qc-overlay" onClick={() => setOpen(false)}>
          <aside className="qc-panel" role="dialog" aria-modal="true" aria-label="Quick enquiry" onClick={(e) => e.stopPropagation()}>
            <div className="qc-head">
              <div>
                <p className="sx-kicker">Enquiry</p>
                <h2>How can we help?</h2>
                <p>Tell the Secretariat what you are working on and we will route it to the right team.</p>
              </div>
              <button type="button" aria-label="Close" className="qc-close" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
            <LeadForm
              subject="UNERA quick enquiry"
              submitLabel="Send enquiry"
              fields={[
                { name: "name", label: "Full name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "org", label: "Organisation" },
                { name: "interest", label: "I am interested in", options: ["Advisory support", "Programmes", "Membership", "Partnerships", "Research & insights", "Careers", "Media"] },
                { name: "message", label: "Message", type: "textarea" },
              ]}
            />
          </aside>
        </div>
      )}
    </>
  );
}
