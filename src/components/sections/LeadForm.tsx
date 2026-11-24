import { useState, type FormEvent } from "react";

/** Sends a payload to VITE_ENQUIRY_ENDPOINT, or opens a pre-filled email. Resolves true when handed off. */
export async function sendEnquiry(subject: string, payload: Record<string, string>): Promise<boolean> {
  if (ENDPOINT) {
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ subject, ...payload }) });
      return res.ok;
    } catch {
      return false;
    }
  }
  const lines = Object.entries(payload).map(([k, v]) => `${k}: ${v}`);
  window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  return true;
}

export interface Field {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  options?: string[];
}

export const ENQUIRY_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT as string | undefined;
const TO = (import.meta.env.VITE_ENQUIRY_EMAIL as string | undefined) ?? "secretariat@unera.world";

/**
 * Enquiry form with inline validation, consent and a honeypot. Submits as JSON to
 * VITE_ENQUIRY_ENDPOINT (Formspree, Resend function, …) when set; otherwise opens a pre-filled
 * email to VITE_ENQUIRY_EMAIL (default: secretariat@unera.world).
 */
export function LeadForm({ subject, fields, submitLabel = "Send enquiry" }: { subject: string; fields: Field[]; submitLabel?: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (String(data.get("website") ?? "")) return; // honeypot
    const next: Record<string, string> = {};
    for (const f of fields) {
      const val = String(data.get(f.name) ?? "").trim();
      if (f.required && !val) next[f.name] = "This field is required.";
      else if (f.type === "email" && val && !ENQUIRY_EMAIL_RE.test(val)) next[f.name] = "Enter a valid email address.";
    }
    if (!data.get("consent")) next["consent"] = "Please confirm consent to continue.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const payload: Record<string, string> = { subject };
    for (const f of fields) payload[f.label] = String(data.get(f.name) ?? "").trim();

    if (ENDPOINT) {
      setState("sending");
      try {
        const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
        setState(res.ok ? "done" : "failed");
      } catch {
        setState("failed");
      }
      return;
    }
    const lines = Object.entries(payload).filter(([k]) => k !== "subject").map(([k, v]) => `${k}: ${v}`);
    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setState("done");
  }

  if (state === "done")
    return (
      <div className="lf-done" role="status">
        <h3>Thank you.</h3>
        <p>Your enquiry is on its way to the Secretariat.</p>
      </div>
    );

  return (
    <form className="lf" onSubmit={onSubmit} noValidate>
      {fields.map((f) => (
        <label key={f.name} className="lf-row">
          <span>
            {f.label}
            {f.required ? " *" : ""}
          </span>
          {f.options ? (
            <select name={f.name} defaultValue="" aria-invalid={!!errors[f.name]}>
              <option value="">Select…</option>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : f.type === "textarea" ? (
            <textarea name={f.name} rows={4} aria-invalid={!!errors[f.name]} />
          ) : (
            <input name={f.name} type={f.type ?? "text"} aria-invalid={!!errors[f.name]} />
          )}
          {errors[f.name] && <em className="lf-err">{errors[f.name]}</em>}
        </label>
      ))}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="lf-hp" aria-hidden="true" />
      <label className="lf-consent">
        <input type="checkbox" name="consent" value="yes" />
        <span>I agree to UNERA contacting me about this enquiry.</span>
      </label>
      {errors["consent"] && <em className="lf-err">{errors["consent"]}</em>}
      {state === "failed" && <em className="lf-err">Something went wrong sending your enquiry. Please try again or email {TO}.</em>}
      <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
