export const cursorVariantValues = ["GLOW", "RING", "TRAIL", "SYSTEM"] as const;

export type CursorVariant = (typeof cursorVariantValues)[number];

export const cursorVariantLabels: Record<CursorVariant, string> = {
  GLOW: "Glow orb",
  RING: "Tech ring",
  TRAIL: "Signal trail",
  SYSTEM: "System default"
};

export function normalizeCursorVariant(value: unknown): CursorVariant {
  return cursorVariantValues.includes(value as CursorVariant) ? (value as CursorVariant) : "GLOW";
}
