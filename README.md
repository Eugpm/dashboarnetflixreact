# Netflix Global Insights · Proyecto 03 (Fase 3)

Dashboard en React que implementa el wireframe de la Fase 2 sobre el catálogo histórico de Netflix
(Kaggle · *Netflix Movies and TV Shows*).

## Requisitos
Node.js 18+ y, solo si se regeneran los datos, Python 3 con `pandas`.

## Ejecutar
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run preview    # sirve dist/ en local
```

## Regenerar los datos (opcional)
`public/data/` ya incluye los datos limpios. Para rehacerlos desde el CSV original:
```bash
# coloque el CSV en data/raw/netflix_titles.csv
npm run data       # clean_data.py (limpieza) + build_geo.mjs (geometría del mapa)
```

## Estructura
- `data/raw/` CSV original sin modificar.
- `scripts/` limpieza reproducible (Python) y conversión del mapa (Node).
- `public/data/` datos depurados (`netflix.json`), geometría (`world.geo.json`) y reporte de calidad.
- `src/components/` layout, kpi, charts y map. `src/pages/` Dashboard y Metodología.
- `src/utils/metrics.js` todos los cálculos (KPIs, series y rankings). `src/styles/tokens.css` paleta de la Fase 2.

## Despliegue
`vite.config.js` usa `base: './'`, por lo que `dist/` funciona en Vercel o GitHub Pages sin cambios
(el enrutador es `HashRouter`). No hay credenciales ni variables de entorno: los datos son estáticos.
