import { A } from "@/components/A";
import { FooterTop } from "@/generated/footerTop";

export function Footer({ label }: { label: string }) {
  return (
    <footer className="main-footer">
      <div className="container footer-top">
        <FooterTop />
      </div>
      <div className="footer-advanced" data-footer-advanced="">
        <div className="container footer-advanced-inner">
          <div className="footer-advanced-copy">
            <span className="footer-module-kicker">Current focus / {label}</span>
            <h3>Make the next reform decision clearer.</h3>
            <p>Explore UNERA perspectives, delivery tools and partnership pathways built for the work between ambition and results.</p>
          </div>
          <div className="footer-advanced-actions">
            <A className="footer-advanced-link" href="/insights">
              Explore insights <span>↗</span>
            </A>
            <A className="footer-advanced-link" href="/contact">
              Contact the Secretariat <span>→</span>
            </A>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 Universal Economic Reform Alliance (UNERA). All rights reserved.</p>
        <div className="footer-links">
          <A href="/privacy">Privacy Policy</A>
          <A href="/terms">Terms of Use</A>
          <A href="/accessibility">Accessibility</A>
          <button type="button" className="footer-back-top" data-back-top="" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
