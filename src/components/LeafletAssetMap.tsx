import React, { useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, ScaleControl } from 'react-leaflet';
import type { LatLngBoundsLiteral, Layer } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { agricultureFC, forestFC, waterFC, homesteadsFC, filterByAllowedStates, ALLOWED_STATES } from '@/data/assetLayers';

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

const boundsIndia: LatLngBoundsLiteral = [[6, 68], [36, 98]]; // [southWest, northEast]

const LeafletAssetMap: React.FC = () => {
  const [activeLayers] = useState<LayerKey[]>(['agriculture', 'forest', 'water', 'homesteads']);

  const layers = useMemo(() => {
    return activeLayers.map((k) => ({ key: k, fc: fcForLayer(k) }));
  }, [activeLayers]);

  // Function to handle feature styling
  const styleFeature = useCallback((feature: any) => {
    const color = layerColors[feature?.properties?.type as LayerKey] || '#3388ff';
    return {
      color,
      weight: 1,
      opacity: 0.6,
      fillColor: color,
      fillOpacity: 0.35,
    };
  }, []);

  // Function to handle point layer creation
  const createPointLayer = useCallback((feature: any, latlng: L.LatLngExpression) => {
    const color = layerColors[feature?.properties?.type as LayerKey] || '#3388ff';
    return L.circleMarker(latlng, {
      radius: 5,
      color,
      weight: 1,
      fillColor: color,
      fillOpacity: 0.9
    });
  }, []);

  // Function to handle feature events
  const onEachFeature = useCallback((feature: any, layer: Layer) => {
    const props = feature?.properties || {};
    const label = props.label || feature?.properties?.type || 'Feature';
    const state = props.state || 'Unknown';
    
    if (layer) {
      layer.bindPopup(`<div><strong>${label}</strong><div>State: ${state}</div></div>`);
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
      <div style={{position:'absolute',top:10,left:10,zIndex:1000, background:'rgba(16,185,129,0.15)', border:'1px solid #10b981', color:'#d1fae5', padding:'6px 10px', borderRadius:6}}>
        <strong>AI-based Asset Mapping</strong>
        <div style={{fontSize:12, opacity:0.9}}>Shown only for: {ALLOWED_STATES.join(', ')}</div>
      </div>
      
      <MapContainer 
        bounds={boundsIndia}
        style={{ width: '100%', height: '100%' }}
      >
        <ScaleControl position="bottomleft" />
        
        {/* Base Layer */}
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=d9f8ca1e-c458-4b61-b119-fe219406ec61"
        />

        {/* GeoJSON Layers */}
        {layers.map(({ key, fc }) => {
          // Apply styles directly to the GeoJSON data
          const styledFC = {
            ...fc,
            features: fc.features.map((feature: any) => ({
              ...feature,
              properties: {
                ...feature.properties,
                style: styleFeature(feature)
              }
            }))
          };
          
          return (
            <GeoJSON
              key={key}
              data={styledFC as any}
              onEachFeature={onEachFeature}
              style={(feature) => ({
                color: layerColors[feature?.properties?.type as LayerKey] || '#3388ff',
                weight: 1,
                opacity: 0.6,
                fillColor: layerColors[feature?.properties?.type as LayerKey] || '#3388ff',
                fillOpacity: 0.35,
              })}
              pointToLayer={(feature, latlng) => {
                const color = layerColors[feature?.properties?.type as LayerKey] || '#3388ff';
                return L.circleMarker(latlng, {
                  radius: 5,
                  color,
                  weight: 1,
                  fillColor: color,
                  fillOpacity: 0.9
                });
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LeafletAssetMap;
