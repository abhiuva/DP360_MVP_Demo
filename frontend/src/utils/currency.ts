export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  INR: "₹",
  AED: "د.إ",
  AUD: "A$",
  CAD: "C$",
  JPY: "¥",
};

export function symbolFrom(code?: string): string {
  const key = String(code || "GBP").toUpperCase();
  return CURRENCY_SYMBOLS[key] || "£";
}

export function formatMoney(value: any, code?: string): string {
  const v = Number(value || 0);
  const sym = symbolFrom(code);
  if (!Number.isFinite(v)) return `${sym}0`;
  return `${sym}${v.toLocaleString()}`;
}
