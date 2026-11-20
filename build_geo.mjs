// Convierte world-atlas (TopoJSON, Natural Earth 1:50m) a GeoJSON y conserva solo
// id numérico ISO + nombre. Salida: public/data/world.geo.json
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';

const topo = JSON.parse(readFileSync('node_modules/world-atlas/countries-50m.json', 'utf8'));
const geo = feature(topo, topo.objects.countries);

const slim = {
  type: 'FeatureCollection',
  features: geo.features
    .filter((f) => f.properties?.name !== 'Antarctica')
    .map((f) => ({
      type: 'Feature',
      properties: { num: f.id ? String(f.id).padStart(3, '0') : null, name: f.properties?.name ?? '' },
      geometry: f.geometry,
    })),
};

// Los polígonos que cruzan el antimeridiano (Rusia, Fiji, Alaska) saltan de +180 a -180 y Leaflet
// los dibuja como una banda horizontal. Se "desenvuelven" sumando 360° para que cada anillo sea continuo.
const unwrapRing = (ring) => {
  let offset = 0;
  return ring.map(([lon, lat], i) => {
    if (i > 0) {
      const prev = ring[i - 1][0];
      if (lon - prev > 180) offset -= 360;
      else if (lon - prev < -180) offset += 360;
    }
    return [lon + offset, lat];
  });
};
const unwrap = (geom) => {
  if (geom.type === 'Polygon') geom.coordinates = geom.coordinates.map(unwrapRing);
  if (geom.type === 'MultiPolygon') geom.coordinates = geom.coordinates.map((poly) => poly.map(unwrapRing));
};
slim.features.forEach((f) => unwrap(f.geometry));

// Redondeo a 2 decimales para aligerar el archivo (suficiente para un mapa mundial).
const round = (n) => Math.round(n * 100) / 100;
const walk = (c) => (typeof c[0] === 'number' ? c.map(round) : c.map(walk));
slim.features.forEach((f) => (f.geometry.coordinates = walk(f.geometry.coordinates)));

writeFileSync('public/data/world.geo.json', JSON.stringify(slim));
console.log('Features:', slim.features.length);
