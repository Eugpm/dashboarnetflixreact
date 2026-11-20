import { useEffect, useState } from 'react';
import styles from './Methodology.module.css';
import { fmt } from '../utils/format';

const KPI_DEFS = [
  ['Títulos únicos', 'COUNT(DISTINCT show_id) sobre los títulos que cumplen los filtros activos.'],
  ['Países representados', 'Países distintos entre los títulos con país registrado. Los títulos sin país se informan aparte.'],
  ['Películas / series', 'Porcentaje de Movie y TV Show sobre títulos únicos.'],
  ['Año pico', 'Año de release_year con más títulos en la selección.'],
  ['Género líder', 'Etiqueta de listed_in con más títulos únicos. No equivale al género más visto.'],
];

export default function Methodology() {
  const [report, setReport] = useState(null);
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/quality_report.json`).then((r) => r.json()).then(setReport).catch(() => setReport(null));
  }, []);

  return (
    <article className={styles.page}>
      <h1>Metodología y notas</h1>
      <p className={styles.lead}>
        Definiciones de los indicadores y resumen del preprocesamiento aplicado al CSV antes de dibujar cualquier gráfico.
      </p>

      <h2>Definición de los KPIs</h2>
      <dl>
        {KPI_DEFS.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
      </dl>

      <h2>Reglas de lectura</h2>
      <ul>
        <li>Las etiquetas de <code>country</code>, <code>listed_in</code> y <code>director</code> pueden tener varios valores: un título puede aparecer en varias categorías y las sumas pueden superar el total de títulos únicos.</li>
        <li>La serie temporal usa <code>release_year</code> (estreno de la obra), no <code>date_added</code> (incorporación al catálogo).</li>
        <li>El mapa no aplica el filtro de país para poder compararlo con el resto; el país elegido se resalta con borde claro.</li>
        <li>Soviet Union, East Germany y West Germany se omiten del mapa y del conteo de países: no se reasignan a países actuales para no inventar datos.</li>
        <li>La presencia en el catálogo no mide reproducciones, audiencia, ingresos ni popularidad.</li>
      </ul>

      {report && (
        <>
          <h2>Resumen de calidad de datos</h2>
          <table className={styles.table}>
            <tbody>
              <tr><th scope="row">Filas originales</th><td>{fmt(report.filas_originales)}</td></tr>
              <tr><th scope="row">show_id duplicados / vacíos</th><td>{report.show_id_duplicados} / {report.show_id_vacios}</td></tr>
              <tr><th scope="row">Títulos sin país</th><td>{fmt(report.titulos_sin_pais)}</td></tr>
              <tr><th scope="row">Títulos sin director</th><td>{fmt(report.titulos_sin_director)}</td></tr>
              <tr><th scope="row">date_added nula o inválida</th><td>{fmt(report.date_added_invalidas_o_nulas)}</td></tr>
              <tr><th scope="row">Relaciones título–país / género / director</th><td>{fmt(report.relaciones_titulo_pais)} / {fmt(report.relaciones_titulo_genero)} / {fmt(report.relaciones_titulo_director)}</td></tr>
            </tbody>
          </table>
        </>
      )}
      <p className={styles.src}>Fuente: Kaggle, Shivam Bansal. Netflix Movies and TV Shows.</p>
    </article>
  );
}
