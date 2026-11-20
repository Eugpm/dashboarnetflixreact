import { useMemo, useState } from 'react';
import styles from './Dashboard.module.css';
import FilterBar from '../components/layout/FilterBar';
import KpiRow from '../components/kpi/KpiRow';
import CountryMap from '../components/map/CountryMap';
import YearLine from '../components/charts/YearLine';
import RankingBars from '../components/charts/RankingBars';
import TypeDonut from '../components/charts/TypeDonut';
import {
  DEFAULT_FILTERS, applyFilters, computeKpis, countryCounts, topDirectors, topGenres, yearSeries,
} from '../utils/metrics';
import { countryName } from '../utils/format';

export default function Dashboard({ data, geo }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { titles, genres, countries } = data;

  const countryOptions = useMemo(() => {
    const totals = {};
    titles.forEach((t) => t.countries.forEach((c) => { totals[c] = (totals[c] ?? 0) + 1; }));
    return Object.keys(countries)
      .map((code) => ({ code, name: countryName(code, countries[code].name) }))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }, [titles, countries]);

  const genreOptions = useMemo(
    () => genres.map((name, index) => ({ name, index })).sort((a, b) => a.name.localeCompare(b.name)),
    [genres],
  );

  const filtered = useMemo(() => applyFilters(titles, filters), [titles, filters]);
  // El mapa ignora el filtro de país para no quedarse con un solo polígono coloreado; el país elegido se resalta.
  const forMap = useMemo(() => applyFilters(titles, filters, { ignoreCountry: true }), [titles, filters]);

  const kpis = useMemo(() => computeKpis(filtered, genres), [filtered, genres]);
  const series = useMemo(() => yearSeries(filtered), [filtered]);
  const genreRank = useMemo(() => topGenres(filtered, genres), [filtered, genres]);
  const directorRank = useMemo(() => topDirectors(filtered), [filtered]);
  const mapCounts = useMemo(() => countryCounts(forMap), [forMap]);

  const toggleCountry = (code) => setFilters((f) => ({ ...f, country: f.country === code ? 'all' : code }));

  return (
    <>
      <div id="top">
        <h1 className={styles.title}>La economía del entretenimiento</h1>
        <p className={styles.sub}>Exploración de la oferta histórica del catálogo</p>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} countries={countryOptions} genres={genreOptions} />

      <KpiRow kpis={kpis} countryFilterActive={filters.country !== 'all'} />

      <div className={styles.analytic}>
        <CountryMap geo={geo} countries={countries} counts={mapCounts} selected={filters.country} onSelect={toggleCountry} />
        <YearLine series={series} />
      </div>

      <div className={styles.compare}>
        <RankingBars title="Top 5 géneros" subtitle="Etiquetas de listed_in · títulos únicos" rows={genreRank} colorKey="teal" unit="Género" />
        <RankingBars title="Top 5 directores" subtitle="Campo director · títulos con director registrado" rows={directorRank} colorKey="red" unit="Director" />
        <TypeDonut kpis={kpis} />
      </div>

      <footer className={styles.foot}>
        Fuente: Kaggle, Shivam Bansal · Netflix Movies and TV Shows. Los conteos por país, género y director pueden sumar más que los
        títulos únicos porque un título puede tener varias etiquetas. El año corresponde a <code>release_year</code> (estreno), no a la fecha en que
        se añadió a Netflix. La presencia en el catálogo no mide audiencia, ingresos ni popularidad.
      </footer>
    </>
  );
}
