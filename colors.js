// Lee los colores desde las variables CSS (tokens.css) para que la paleta tenga una sola fuente de verdad,
// también en librerías que necesitan valores de color en JavaScript (Recharts, Leaflet).
export const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const palette = () => ({
  red: cssVar('--color-red'),
  teal: cssVar('--color-teal'),
  smoke: cssVar('--color-smoke'),
  night: cssVar('--color-night'),
  surface: cssVar('--surface-1'),
  surface2: cssVar('--surface-2'),
  border: cssVar('--border'),
  muted: cssVar('--text-muted'),
  scale: ['--scale-0', '--scale-1', '--scale-2', '--scale-3', '--scale-4'].map(cssVar),
});
