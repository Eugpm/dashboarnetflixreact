import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from './ChartCard';
import ChartTooltip from './ChartTooltip';
import DataTable from './DataTable';
import EmptyState from './EmptyState';
import { palette } from '../../utils/colors';
import { fmt } from '../../utils/format';

// Serie temporal por release_year (año de estreno), NO por date_added (Fase 2, reglas para no inducir a error).
export default function YearLine({ series }) {
  const p = palette();
  const hasData = series.length > 0;
  const table = hasData && (
    <DataTable
      caption="Títulos por año de estreno"
      columns={['Año de estreno', 'Títulos']}
      rows={[...series].reverse().map((r) => [r.year, fmt(r.titles)])}
    />
  );
  return (
    <ChartCard id="evolucion" title="Evolución de estrenos" subtitle="Serie temporal por release_year" table={table || undefined}>
      {!hasData ? <EmptyState /> : (
        <div style={{ height: 270 }} role="img" aria-label={`Gráfico de líneas: títulos por año de estreno, de ${series[0].year} a ${series.at(-1).year}.`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 8, right: 12, left: -8, bottom: 16 }}>
              <CartesianGrid stroke={p.border} vertical={false} />
              <XAxis dataKey="year" stroke={p.muted} tick={{ fontSize: 12, fill: p.muted }} minTickGap={28}
                label={{ value: 'Año de estreno · release_year', position: 'insideBottom', offset: -12, fill: p.muted, fontSize: 12 }} />
              <YAxis stroke={p.muted} tick={{ fontSize: 12, fill: p.muted }} allowDecimals={false} />
              <Tooltip content={<ChartTooltip labelPrefix="Estrenos de " />} cursor={{ stroke: p.border }} />
              <Line type="monotone" dataKey="titles" stroke={p.teal} strokeWidth={2.5}
                dot={series.length < 40 ? { r: 3, fill: p.teal, stroke: p.teal } : false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
