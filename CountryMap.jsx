import { useMemo } from 'react';
import { GeoJSON, MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ChartCard from '../charts/ChartCard';
import DataTable from '../charts/DataTable';
import EmptyState from '../charts/EmptyState';
import styles from './CountryMap.module.css';
import { palette } from '../../utils/colors';
import { countryName, fmt } from '../../utils/format';
import { sortedCountryList } from '../../utils/metrics';

const SCALE_COLORS = 4; // clases con datos (la clase 0 = sin títulos)

// Clases de la escala: cortes proporcionales al máximo, para que el contraste sea legible aunque domine un país.
function buildClasses(max) {
  if (max <= 0) return [];
  const cuts = [...new Set([0.04, 0.2, 0.5].map((r) => Math.max(1, Math.round(max * r))))].filter((c) => c < max).sort((a, b) => a - b);
  const edges = [0, ...cuts, max];
  return edges.slice(1).map((hi, i) => ({ lo: edges[i] + 1, hi }));
}

const classIndex = (value, classes) => classes.findIndex((c) => value >= c.lo && value <= c.hi);

export default function CountryMap({ geo, countries, counts, selected, onSelect }) {
  const p = palette();
  const max = Math.max(0, ...Object.values(counts));
  const classes = useMemo(() => buildClasses(max), [max]);
  const colorFor = (value) => {
    if (!value) return p.scale[0];
    const i = classIndex(value, classes);
    return p.scale[p.scale.length - classes.length + i]; // las últimas clases usan los tonos más intensos
  };

  const byNum = useMemo(() => Object.fromEntries(Object.entries(countries).map(([code, c]) => [c.num, { code, name: c.name }])), [countries]);
  const list = sortedCountryList(counts);
  const table = list.length > 0 && (
    <DataTable
      caption="Títulos por país"
      columns={['País', 'Títulos']}
      rows={list.map(([code, n]) => [countryName(code, countries[code]?.name), fmt(n)])}
    />
  );

  const style = (feature) => {
    const meta = byNum[feature.properties.num];
    const value = meta ? counts[meta.code] ?? 0 : 0;
    const isSel = meta && meta.code === selected;
    return {
      fillColor: colorFor(value), fillOpacity: 1,
      color: isSel ? p.smoke : p.night, weight: isSel ? 2.2 : 0.6,
    };
  };

  const onEach = (feature, layer) => {
    const meta = byNum[feature.properties.num];
    if (!meta) return;
    const value = counts[meta.code] ?? 0;
    layer.bindTooltip(
      `<strong>${countryName(meta.code, meta.name)}</strong><br/>${value ? `${fmt(value)} títulos únicos` : 'Sin títulos en esta selección'}`,
      { sticky: true, className: 'map-tip' },
    );
    layer.on('click', () => onSelect(meta.code));
  };

  const signature = `${selected}|${JSON.stringify(counts)}`;

  return (
    <ChartCard
      id="mapa"
      title="Títulos por país"
      subtitle="Mapa coroplético · conteo de títulos (clic en un país para filtrar)"
      table={table || undefined}
      defaultTable={typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches}
    >
      {max === 0 ? <EmptyState /> : (
        <>
          <div className={styles.map} role="img" aria-label="Mapa mundial coroplético de títulos por país. Use el botón Ver tabla para la versión en lista.">
            <MapContainer
              bounds={[[-56, -170], [80, 192]]} zoomSnap={0.25} minZoom={0.75} maxZoom={6}
              scrollWheelZoom={false} attributionControl={false} worldCopyJump={false}
              style={{ height: '100%', width: '100%', background: p.night }}
            >
              <GeoJSON key={signature} data={geo} style={style} onEachFeature={onEach} />
            </MapContainer>
          </div>
          <div className={styles.legend} aria-label="Leyenda del mapa">
            <span>Menor presencia</span>
            {classes.map((c, i) => (
              <span key={c.lo} className={styles.chip}>
                <i style={{ background: p.scale[p.scale.length - classes.length + i] }} />
                {c.lo === c.hi ? fmt(c.lo) : `${fmt(c.lo)}–${fmt(c.hi)}`}
              </span>
            ))}
            <span>Mayor</span>
          </div>
        </>
      )}
    </ChartCard>
  );
}
