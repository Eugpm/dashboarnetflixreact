const nf = new Intl.NumberFormat('es-MX');
export const fmt = (n) => nf.format(n);
export const pct = (n) => `${n.toFixed(1).replace('.0', '')} %`;

const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
// Nombre de país en español a partir del código ISO; si el navegador no lo conoce, se usa el original.
export function countryName(code, fallback = code) {
  try { return regionNames.of(code) ?? fallback; } catch { return fallback; }
}
