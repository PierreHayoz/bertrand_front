export function toPlainText(node) {
  if (!node) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toPlainText).join(" ").replace(/\s+/g, " ").trim();
  if (typeof node === "object") {
    if ("text" in node) return toPlainText(node.text);
    if ("children" in node) return toPlainText(node.children);
  }
  return "";
}

export function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const fmt = (d, opts) => d.toLocaleDateString("fr-CH", { timeZone: "Europe/Zurich", ...opts });

/** « 12 septembre — 10 octobre 2026 » (années répétées seulement si elles diffèrent). */
export function formatDateRange(debut, fin) {
  const d1 = toDate(debut);
  if (!d1) return "";
  const full = { day: "numeric", month: "long", year: "numeric" };
  const d2 = toDate(fin);
  if (!d2) return fmt(d1, full);
  const sameYear = d1.getFullYear() === d2.getFullYear();
  return `${fmt(d1, sameYear ? { day: "numeric", month: "long" } : full)} — ${fmt(d2, full)}`;
}

/** "current" | "upcoming" | "past" | "unknown" */
export function getExpoStatus(expo, now = new Date()) {
  const start = toDate(expo?.dateDebut);
  if (!start) return "unknown";
  const s = new Date(start);
  s.setHours(0, 0, 0, 0);
  const e = new Date(toDate(expo.dateFin) ?? start);
  e.setHours(23, 59, 59, 999);
  if (now < s) return "upcoming";
  if (now <= e) return "current";
  return "past";
}

export function place(expo) {
  return [expo?.lieu, expo?.ville].filter(Boolean).join(", ");
}
