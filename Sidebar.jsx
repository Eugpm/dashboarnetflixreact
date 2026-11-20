import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const icons = {
  panel: <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" />,
  map: <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />,
  line: <path d="M3 17l5-6 4 3 6-8 3 2-8.5 11-4-3-3 4z" />,
  info: <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2zm0-8h-2V7h2z" />,
};

function Icon({ name }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">{icons[name]}</svg>;
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const goTo = (id) => {
    if (pathname !== '/') navigate('/');
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  return (
    <nav className={styles.sidebar} aria-label="Navegación principal">
      <NavLink to="/" end className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`} title="Panel principal">
        <Icon name="panel" /><span className="sr-only">Panel principal</span>
      </NavLink>
      <button type="button" className={styles.item} onClick={() => goTo('mapa')} title="Mapa de títulos por país">
        <Icon name="map" /><span className="sr-only">Ir al mapa</span>
      </button>
      <button type="button" className={styles.item} onClick={() => goTo('evolucion')} title="Evolución de estrenos">
        <Icon name="line" /><span className="sr-only">Ir a la evolución de estrenos</span>
      </button>
      <NavLink to="/metodologia" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`} title="Metodología y notas">
        <Icon name="info" /><span className="sr-only">Metodología y notas</span>
      </NavLink>
    </nav>
  );
}
