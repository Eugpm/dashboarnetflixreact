import styles from './DataTable.module.css';

export default function DataTable({ caption, columns, rows }) {
  return (
    <div className={styles.scroll} tabIndex={0} role="region" aria-label={caption}>
      <table className={styles.table}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>{columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((cell, j) => (j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
