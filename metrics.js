// Funciones puras: reciben títulos ya cargados y devuelven los números que dibujan KPIs y gráficos.
// Regla de conteo (Fase 1, 5.2): cada título cuenta una sola vez (equivale a COUNT(DISTINCT show_id)).
// En rankings multivalor (país, género, director) un título puede sumar en varias categorías.

export const PERIODS = [
  { id: 'all', label: 'Todos los años', min: -Infinity, max: Infinity },
  { id: '2020s', label: '2020 – 2021', min: 2020, max: 2100 },
  { id: '2010s', label: '2010 – 2019', min: 2010, max: 2019 },
  { id: '2000s', label: '2000 – 2009', min: 2000, max: 2009 },
  { id: '1990s', label: '1990 – 1999', min: 1990, max: 1999 },
  { id: 'old', label: 'Antes de 1990', min: -Infinity, max: 1989 },
];

export const DEFAULT_FILTERS = { type: 'all', period: 'all', country: 'all', genre: 'all' };

export function applyFilters(titles, f, { ignoreCountry = false } = {}) {
  const period = PERIODS.find((p) => p.id === f.period) ?? PERIODS[0];
  const genre = f.genre === 'all' ? null : Number(f.genre);
  return titles.filter((t) => {
    if (f.type !== 'all' && t.type !== f.type) return false;
    if (t.year == null ? f.period !== 'all' : t.year < period.min || t.year > period.max) return false;
    if (!ignoreCountry && f.country !== 'all' && !t.countries.includes(f.country)) return false;
    if (genre !== null && !t.genres.includes(genre)) return false;
    return true;
  });
}

function countBy(items, getKeys) {
  const map = new Map();
  for (const item of items) {
    for (const key of getKeys(item)) map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

const sortDesc = (map) => [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));

export function computeKpis(filtered, genres) {
  const total = filtered.length;
  const movies = filtered.filter((t) => t.type === 'M').length;
  const countryCounts = countBy(filtered, (t) => t.countries);
  const yearCounts = countBy(filtered, (t) => (t.year == null ? [] : [t.year]));
  const genreCounts = countBy(filtered, (t) => t.genres);

  const [peakYear, peakCount] = sortDesc(yearCounts)[0] ?? [null, 0];
  const [topGenreIdx, topGenreCount] = sortDesc(genreCounts)[0] ?? [null, 0];

  return {
    total,
    countries: countryCounts.size,
    withoutCountry: filtered.filter((t) => t.countries.length === 0).length,
    movies,
    series: total - movies,
    moviePct: total ? (movies / total) * 100 : 0,
    peakYear, peakCount,
    topGenre: topGenreIdx == null ? null : genres[topGenreIdx],
    topGenreCount,
  };
}

export function yearSeries(filtered) {
  const counts = countBy(filtered, (t) => (t.year == null ? [] : [t.year]));
  if (!counts.size) return [];
  const years = [...counts.keys()];
  const min = Math.min(...years), max = Math.max(...years);
  const rows = [];
  for (let y = min; y <= max; y++) rows.push({ year: y, titles: counts.get(y) ?? 0 });
  return rows;
}

export const topGenres = (filtered, genres, n = 5) =>
  sortDesc(countBy(filtered, (t) => t.genres)).slice(0, n).map(([i, c]) => ({ name: genres[i], titles: c }));

export const topDirectors = (filtered, n = 5) =>
  sortDesc(countBy(filtered, (t) => t.directors)).slice(0, n).map(([name, c]) => ({ name, titles: c }));

export const countryCounts = (filtered) => Object.fromEntries(countBy(filtered, (t) => t.countries));

export const sortedCountryList = (counts) => sortDesc(new Map(Object.entries(counts)));
