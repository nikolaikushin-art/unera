import type { CSSProperties } from "react";

/** Parse an inline CSS string (as authored in the original HTML) into a React style object. */
export function css(input: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of input.split(/;(?![^(]*\))/)) {
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const key = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!key) continue;
    out[key.startsWith("--") ? key : key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = val;
  }
  return out as CSSProperties;
}
