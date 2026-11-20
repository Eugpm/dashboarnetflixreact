import styles from './KpiCard.module.css';

// Tarjeta de indicador. `primary` = KPI principal (2× el tamaño y borde rojo, según el wireframe).
export default function KpiCard({ label, value, caption, primary = false, empty = false }) {
  return (
    <article className={`${styles.card} ${primary ? styles.primary : ''}`} aria-label={label}>
      <h3 className={styles.label}>{label}</h3>
      <p className={styles.value}>{empty ? '—' : value}</p>
      <p className={styles.caption}>{empty ? 'Sin datos para esta selección' : caption}</p>
    </article>
  );
}
