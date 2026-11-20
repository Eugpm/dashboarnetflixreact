import { HashRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Methodology from './pages/Methodology';
import { useCatalog } from './hooks/useCatalog';

export default function App() {
  const { status, data, geo } = useCatalog();

  return (
    <HashRouter>
      <div className={styles.shell}>
        <Sidebar />
        <main className={styles.main}>
          <Header meta={data?.meta} />
          {status === 'loading' && <p role="status">Cargando datos del catálogo…</p>}
          {status === 'error' && <p role="alert">No se pudieron cargar los datos. Ejecute <code>npm run data</code> y recargue.</p>}
          {status === 'ready' && (
            <Routes>
              <Route path="/" element={<Dashboard data={data} geo={geo} />} />
              <Route path="/metodologia" element={<Methodology />} />
            </Routes>
          )}
        </main>
      </div>
    </HashRouter>
  );
}
