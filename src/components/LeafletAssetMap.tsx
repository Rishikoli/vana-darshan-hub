import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl, ScaleControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection } from 'geojson';
import { agricultureFC, forestFC, waterFC, homesteadsFC, filterByAllowedStates, ALLOWED_STATES } from '@/data/assetLayers';

const { BaseLayer, Overlay } = LayersControl;

type LayerKey = 'agriculture' | 'forest' | 'water' | 'homesteads';

const layerColors: Record<LayerKey, string> = {
  agriculture: '#84cc16',
  forest: '#22c55e',
  water: '#38bdf8',
  homesteads: '#f59e0b',
};

function fcForLayer(key: LayerKey): FeatureCollection {
  switch (key) {
    case 'agriculture':
      return filterByAllowedStates(agricultureFC);
    case 'forest':
      return filterByAllowedStates(forestFC);
    case 'water':
      return filterByAllowedStates(waterFC);
    case 'homesteads':
      return filterByAllowedStates(homesteadsFC);
    default:
      return { type: 'FeatureCollection', features: [] } as FeatureCollection;
  }
}

const boundsIndia: [[number, number], [number, number]] = [[6, 68], [36, 98]]; // [southWest, northEast]

const LeafletAssetMap: React.FC = () => {
  const [activeLayers] = useState<LayerKey[]>(['agriculture', 'forest', 'water', 'homesteads']);

  const layers = useMemo(() => {
    return activeLayers.map((k) => ({ key: k, fc: fcForLayer(k) }));
  }, [activeLayers]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
      <div style={{position:'absolute',top:10,left:10,zIndex:1000, background:'rgba(16,185,129,0.15)', border:'1px solid #10b981', color:'#d1fae5', padding:'6px 10px', borderRadius:6}}>
        <strong>AI-based Asset Mapping</strong>
        <div style={{fontSize:12, opacity:0.9}}>Shown only for: {ALLOWED_STATES.join(', ')}</div>
      </div>
      <MapContainer bounds={boundsIndia} style={{ width: '100%', height: '100%' }}>
        <ScaleControl position="bottomleft" />
        <LayersControl position="topright">
          <BaseLayer checked name="Stadia Dark">
            <TileLayer url="https://tiles.stadiamaps.com/styles/alidade_smooth_dark/{z}/{x}/{y}.png" attribution="© Stadia Maps" />
          </BaseLayer>
          <BaseLayer name="Outdoors">
            <TileLayer url="https://tiles.stadiamaps.com/styles/outdoors/{z}/{x}/{y}.png" attribution="© Stadia Maps" />
          </BaseLayer>

          {layers.map(({ key, fc }) => (
            <Overlay key={key} checked name={key.charAt(0).toUpperCase() + key.slice(1)}>
              <GeoJSON
                data={fc as any}
                style={(feature) => {
                  const color = layerColors[key as LayerKey];
                  const isLine = feature?.geometry?.type === 'LineString' || feature?.geometry?.type === 'MultiLineString';
                  return isLine
                    ? { color, weight: 3, opacity: 0.8 }
                    : { color: '#ffffff', weight: 1, opacity: 0.6, fillColor: color, fillOpacity: 0.35 };
                }}
                pointToLayer={(_feature, latlng) => {
                  const color = layerColors[key as LayerKey];
                  return L.circleMarker(latlng, { radius: 5, color, weight: 1, fillColor: color, fillOpacity: 0.9 });
                }}
                onEachFeature={(feature, layer) => {
                  const props: any = feature.properties || {};
                  const label = props.label || key;
                  const state = props.state || 'Unknown';
                  (layer as any).bindPopup(`<div><strong>${label}</strong><div>State: ${state}</div></div>`);
                }}
              />
            </Overlay>
          ))}
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default LeafletAssetMap;
