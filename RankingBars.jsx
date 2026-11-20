import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from './ChartCard';
import ChartTooltip from './ChartTooltip';
import DataTable from './DataTable';
import EmptyState from './EmptyState';
import { palette } from '../../utils/colors';
import { fmt } from '../../utils/format';

const short = (s, n = 20) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

// Barras horizontales (nombres largos sin rotar etiquetas). Se reutiliza para géneros y directores.
export default function RankingBars({ title, subtitle, rows, colorKey, unit }) {
  const p = palette();
  const color = p[colorKey];
  const data = rows.map((r, i) => ({ ...r, label: `0${i + 1}  ${short(r.name, 24)}` }));
  const table = rows.length > 0 && (
    <DataTable caption={title} columns={['Posición · ' + unit, 'Títulos']} rows={rows.map((r, i) => [`${i + 1}. ${r.name}`, fmt(r.titles)])} />
  );
  return (
    <ChartCard title={title} subtitle={subtitle} table={table || undefined}>
      {rows.length === 0 ? <EmptyState /> : (
        <div style={{ height: 230 }} role="img" aria-label={`${title}: ${rows.map((r) => `${r.name} ${r.titles}`).join('; ')}.`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="label" width={185} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: p.smoke }} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="titles" radius={[0, 6, 6, 0]} barSize={16}>
                {data.map((d) => <Cell key={d.name} fill={color} />)}
                <LabelList dataKey="titles" position="right" fill={p.smoke} fontSize={12} formatter={fmt} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
