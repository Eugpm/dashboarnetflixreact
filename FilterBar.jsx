import { useState } from 'react';
import styles from './FilterBar.module.css';
import { PERIODS, DEFAULT_FILTERS } from '../../utils/metrics';

function Select({ id, label, value, onChange, children }) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className="sr-only">{label}</span>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {children}
      </select>
    </label>
  );
}

export default function FilterBar({ filters, setFilters, countries, genres }) {
  const [open, setOpen] = useState(false);
  const set = (key) => (value) => setFilters((f) => ({ ...f, [key]: value }));
  const isDefault = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);

  return (
    <section className={styles.wrap} aria-label="Filtros">
      <button type="button" className={styles.toggle} aria-expanded={open} aria-controls="filtros-panel" onClick={() => setOpen((o) => !o)}>
        Filtros {isDefault ? '' : '(activos)'}
      </button>
      <div id="filtros-panel" className={`${styles.panel} ${open ? styles.open : ''}`}>
        <Select id="f-type" label="Tipo de contenido" value={filters.type} onChange={set('type')}>
          <option value="all">Tipo de contenido</option>
          <option value="M">Películas</option>
          <option value="S">Series</option>
        </Select>
        <Select id="f-period" label="Año de estreno" value={filters.period} onChange={set('period')}>
          {PERIODS.map((p) => <option key={p.id} value={p.id}>{p.id === 'all' ? 'Año de estreno' : p.label}</option>)}
        </Select>
        <Select id="f-country" label="País" value={filters.country} onChange={set('country')}>
          <option value="all">País</option>
          {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
        </Select>
        <Select id="f-genre" label="Género" value={filters.genre} onChange={set('genre')}>
          <option value="all">Género</option>
          {genres.map((g) => <option key={g.index} value={g.index}>{g.name}</option>)}
        </Select>
        <button type="button" className={styles.reset} onClick={() => setFilters(DEFAULT_FILTERS)} disabled={isDefault}>
          Restablecer
        </button>
      </div>
    </section>
  );
}
