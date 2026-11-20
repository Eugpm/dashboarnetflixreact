import { useEffect, useState } from 'react';

const base = import.meta.env.BASE_URL;

// Carga los datos depurados (fase de preprocesamiento) y la geometría del mapa.
export function useCatalog() {
  const [state, setState] = useState({ status: 'loading', data: null, geo: null, error: null });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`${base}data/netflix.json`).then((r) => { if (!r.ok) throw new Error('netflix.json'); return r.json(); }),
      fetch(`${base}data/world.geo.json`).then((r) => { if (!r.ok) throw new Error('world.geo.json'); return r.json(); }),
    ])
      .then(([data, geo]) => !cancelled && setState({ status: 'ready', data, geo, error: null }))
      .catch((error) => !cancelled && setState({ status: 'error', data: null, geo: null, error }));
    return () => { cancelled = true; };
  }, []);

  return state;
}
