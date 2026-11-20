import KpiCard from './KpiCard';
import styles from './KpiRow.module.css';
import { fmt } from '../../utils/format';

// Los 5 KPIs de la Fase 2. Se calculan en utils/metrics.js a partir de los datos filtrados.
export default function KpiRow({ kpis, countryFilterActive }) {
  const none = kpis.total === 0;
  return (
    <section className={styles.row} aria-label="Indicadores clave">
      <div className={styles.main}>
        <KpiCard
          primary
          label="Títulos únicos"
          value={fmt(kpis.total)}
          caption="COUNT(DISTINCT show_id)"
          empty={none}
        />
      </div>
      <KpiCard
        label="Países representados"
        value={fmt(kpis.countries)}
        caption={`${fmt(kpis.withoutCountry)} títulos sin país registrado`}
        empty={none || (kpis.countries === 0 && !countryFilterActive)}
      />
      <KpiCard
        label="Películas / series"
        value={`${Math.round(kpis.moviePct)} % / ${Math.round(100 - kpis.moviePct)} %`}
        caption={`${fmt(kpis.movies)} películas · ${fmt(kpis.series)} series`}
        empty={none}
      />
      <KpiCard
        label="Año pico"
        value={kpis.peakYear}
        caption={`${fmt(kpis.peakCount)} títulos · release_year`}
        empty={none || kpis.peakYear == null}
      />
      <KpiCard
        label="Género líder"
        value={kpis.topGenre}
        caption={`${fmt(kpis.topGenreCount)} títulos · listed_in`}
        empty={none || kpis.topGenre == null}
      />
    </section>
  );
}
