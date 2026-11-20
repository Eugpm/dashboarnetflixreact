import { useId, useState } from 'react';
import styles from './ChartCard.module.css';

// Contenedor común de los módulos (título nivel 2 + subtítulo con la unidad).
// Ofrece siempre una alternativa en tabla al gráfico (accesibilidad, Fase 2 sección 02).
export default function ChartCard({ id, title, subtitle, table, defaultTable = false, className = '', children }) {
  const [asTable, setAsTable] = useState(defaultTable);
  const headingId = useId();
  return (
    <section id={id} className={`${styles.card} ${className}`} aria-labelledby={headingId}>
      <header className={styles.head}>
        <div>
          <h2 id={headingId} className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {table && (
          <button type="button" className={styles.toggle} aria-pressed={asTable} onClick={() => setAsTable((v) => !v)}>
            {asTable ? 'Ver gráfico' : 'Ver tabla'}
          </button>
        )}
      </header>
      <div className={styles.body}>{asTable && table ? table : children}</div>
    </section>
  );
}
