import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartCard from './ChartCard';
import ChartTooltip from './ChartTooltip';
import DataTable from './DataTable';
import EmptyState from './EmptyState';
import { palette } from '../../utils/colors';
import { fmt, pct } from '../../utils/format';

// Anillo de 2 categorías. La leyenda usa texto + símbolo (círculo / rombo), no solo color.
export default function TypeDonut({ kpis }) {
  const p = palette();
  const total = kpis.total;
  const data = [
    { name: 'Películas', titles: kpis.movies, color: p.red, symbol: '●', share: kpis.moviePct },
    { name: 'Series', titles: kpis.series, color: p.teal, symbol: '◆', share: 100 - kpis.moviePct },
  ];
  const table = total > 0 && (
    <DataTable caption="Películas frente a series" columns={['Tipo', 'Títulos · %']} rows={data.map((d) => [d.name, `${fmt(d.titles)} · ${pct(d.share)}`])} />
  );
  return (
    <ChartCard title="Películas vs series" subtitle="Proporción sobre títulos únicos" table={table || undefined}>
      {total === 0 ? <EmptyState /> : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ width: 180, height: 180 }} role="img" aria-label={`Anillo: ${data.map((d) => `${d.name} ${pct(d.share)}`).join(', ')}.`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="titles" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="none">
                  {data.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: 14, display: 'grid', gap: 10 }}>
            {data.map((d) => (
              <li key={d.name}>
                <span aria-hidden="true" style={{ color: d.color, marginRight: 8 }}>{d.symbol}</span>
                <strong>{d.name}</strong>
                <div style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 22 }}>{fmt(d.titles)} · {pct(d.share)}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  );
}
