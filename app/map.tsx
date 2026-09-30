'use client';
import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import type { ranked } from '../lib/model';

export default function Map({points, onSelect, selected}: {points: ReturnType<typeof ranked>; onSelect: (id: string) => void; selected: string}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const callback = useRef(onSelect);
  useEffect(() => { callback.current = onSelect; }, [onSelect]);
  const boundsKey = points.map(p => p.id).sort().join('|');
  const previousBounds = useRef('');
  useEffect(() => {
    let disposed = false;
    import('leaflet').then(({default: L}) => {
      if (disposed || !el.current) return;
      map.current = L.map(el.current, {scrollWheelZoom: false, zoomControl: false}).setView([20, 40], 2);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18}).addTo(map.current);
      L.control.zoom({position: 'bottomright'}).addTo(map.current);
      layer.current = L.layerGroup().addTo(map.current);
      setReady(true);
    }).catch(() => setError(true));
    return () => {disposed = true; map.current?.remove(); map.current = null; layer.current = null;};
  }, []);
  useEffect(() => {
    if (!ready) return;
    let disposed = false;
    import('leaflet').then(({default: L}) => {
      if (disposed || !map.current || !layer.current) return;
      layer.current.clearLayers();
      points.forEach(p => L.marker([p.lat, p.lng], {title: `${p.name}, ${p.country}: ${p.count} open reports`, icon: L.divIcon({className: '', html: `<div class="map-pin ${p.score >= 75 ? 'high' : ''} ${selected === p.id ? 'selected' : ''}">${p.count}</div>`, iconSize: [42,42], iconAnchor: [21,21]})}).addTo(layer.current!).bindTooltip(`${p.name} · ${p.country}`).on('click', () => callback.current(p.id)));
      if (points.length && previousBounds.current !== boundsKey) {
        map.current.fitBounds(L.latLngBounds(points.map(p => [p.lat, p.lng])), {padding: [55,55], maxZoom: 12});
        previousBounds.current = boundsKey;
      }
    });
    return () => {disposed = true;};
  }, [points, selected, ready, boundsKey]);
  return <><div className="map-canvas" ref={el} aria-label="Interactive map of demonstration community infrastructure projects"/>{error && <p role="alert">Map unavailable. Projects remain available in the list.</p>}</>;
}
