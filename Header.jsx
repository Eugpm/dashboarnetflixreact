import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { fmt } from '../../utils/format';

export default function Header({ meta }) {
  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <span className={styles.logo} aria-hidden="true">N</span>
        <span className={styles.name}>NETFLIX / GLOBAL INSIGHTS</span>
      </div>
      <Link to="/metodologia" className={styles.pill}>
        {meta ? `Kaggle · ${fmt(meta.titles)} títulos · ${meta.minYear}–${meta.maxYear}` : 'Cargando datos…'}
      </Link>
    </header>
  );
}
