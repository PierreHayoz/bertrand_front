// lib/utils.js
export function toPlainText(node) {
  if (!node) return "";

  if (typeof node === "string" || typeof node === "number") return String(node);

  if (Array.isArray(node)) {
    return node
      .map(toPlainText)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (typeof node === "object") {
    if ("text" in node) return toPlainText(node.text);
    if ("children" in node) return toPlainText(node.children);
    return Object.values(node)
      .map(toPlainText)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return "";
}

export function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateRange(debut, fin) {
  const d1 = toDate(debut);
  if (!d1) return "";
  const f1 = d1.toLocaleDateString("fr-CH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const d2 = toDate(fin);
  if (!d2) return f1;

  const f2 = toDate(fin);
  if (!d2) return f1;

  return `${f1} — ${d2.toLocaleDateString("fr-CH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
}