import { fmt } from '../../utils/format';

// Tooltip común: categoría, cantidad de títulos y definición del conteo (Fase 1, 7.1).
export default function ChartTooltip({ active, payload, label, labelPrefix = '' }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div style={{
      background: 'var(--color-night)', border: '1px solid var(--border)', borderRadius: 8,
      padding: '8px 12px', fontSize: 13, color: 'var(--color-smoke)', maxWidth: 240,
    }}>
      <strong>{labelPrefix}{row.name ?? label}</strong>
      <div>{fmt(payload[0].value)} títulos únicos</div>
    </div>
  );
}
