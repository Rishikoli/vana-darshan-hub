import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Map, MapRef } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react/typed';
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers/typed';
import type { PickingInfo, MapViewState } from '@deck.gl/core/typed';
import type { Feature, Polygon, FeatureCollection } from 'geojson';

interface Forest3DMapProps {
  height?: number | string;
  interactive?: boolean;
}

interface ForestProperties {
  name?: string;
  forest_cover: number;
  tree_cover: number;
  total_cover: number;
}

type ForestFeature = Feature<Polygon, ForestProperties>;
type ForestFeatureCollection = FeatureCollection<Polygon, ForestProperties>;

// India boundary GeoJSON data (approximate shape of India)
const INDIA_BOUNDARY = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "India",
        "forest_cover": 713789,
        "tree_cover": 95382,
        "total_cover": 809171
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [68.186, 7.96],    // Bottom-left
            [68.18, 23.6],     // West coast up
            [69.5, 23.8],
            [70.0, 22.0],
            [72.0, 20.0],
            [72.4, 21.5],
            [73.0, 23.0],
            [74.0, 25.0],
            [77.0, 28.5],      // Northern border
            [80.0, 30.0],
            [82.0, 30.0],
            [88.0, 26.0],      // Eastern border
            [89.0, 26.0],
            [89.5, 21.0],
            [88.0, 10.0],      // Bottom-right
            [79.0, 6.0],
            [77.0, 8.0],
            [73.0, 8.0],
            [68.186, 7.96]     // Back to start
          ]
        ]
      }
    }
  ]
};

// Tribal region data with different colors and forest statistics
const TRIBAL_REGIONS = {
  type: 'FeatureCollection',
  features: [
    // Central India Tribal Belt
    {
      type: 'Feature',
      properties: {
        name: 'Gondwana Region',
        tribe: 'Gond',
        population: '15 million',
        forest_cover: 120000,
        tree_cover: 18000,
        total_cover: 138000,
        color: [34, 139, 34],  // Forest Green
        health: 'healthy'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.5, 18.5],
            [78.0, 20.0],
            [80.0, 21.0],
            [82.0, 20.5],
            [82.5, 19.0],
            [81.0, 18.0],
            [79.0, 17.5],
            [76.5, 18.5]
          ]
        ]
      }
    },
    // North East Tribal Region
    {
      type: 'Feature',
      properties: {
        name: 'Seven Sisters',
        tribe: 'Multiple',
        population: '45 million',
        forest_cover: 168000,
        tree_cover: 22000,
        total_cover: 190000,
        color: [0, 100, 0],  // Dark Green
        health: 'healthy'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [89.7, 21.9],
            [90.5, 24.0],
            [92.0, 25.5],
            [94.0, 27.0],
            [95.5, 28.0],
            [97.0, 27.0],
            [95.0, 24.0],
            [93.0, 22.0],
            [89.7, 21.9]
          ]
        ]
      }
    },
    // Western Ghats Tribal Region
    {
      type: 'Feature',
      properties: {
        name: 'Western Ghats',
        tribe: 'Scheduled Tribes',
        population: '8 million',
        forest_cover: 158000,
        tree_cover: 25000,
        total_cover: 183000,
        color: [34, 139, 34],  // Lime Green
        health: 'moderate'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.0, 8.0],
            [74.0, 10.0],
            [75.0, 12.0],
            [76.0, 14.0],
            [77.0, 16.0],
            [77.0, 18.0],
            [76.0, 19.0],
            [74.0, 18.0],
            [73.0, 16.0],
            [72.0, 14.0],
            [72.0, 10.0],
            [73.0, 8.0]
          ]
        ]
      }
    },
    // Eastern Ghats Tribal Region
    {
      type: 'Feature',
      properties: {
        name: 'Eastern Ghats',
        tribe: 'Scheduled Tribes',
        population: '12 million',
        forest_cover: 85000,
        tree_cover: 15000,
        total_cover: 100000,
        color: [0, 180, 0],  // Green
        health: 'moderate'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.0, 12.0],
            [79.0, 14.0],
            [81.0, 16.0],
            [83.0, 18.0],
            [84.0, 20.0],
            [85.0, 22.0],
            [84.0, 23.0],
            [82.0, 22.0],
            [80.0, 20.0],
            [78.0, 18.0],
            [77.0, 15.0],
            [77.0, 12.0]
          ]
        ]
      }
    },
    // Central Indian Tribal Belt - Bhil Region
    {
      type: 'Feature',
      properties: {
        name: 'Bhil Region',
        tribe: 'Bhil',
        population: '17 million',
        forest_cover: 95000,
        tree_cover: 12000,
        total_cover: 107000,
        color: [50, 205, 50],  // Lime Green
        health: 'degraded'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [72.5, 21.0],
            [73.5, 22.0],
            [74.5, 23.0],
            [75.0, 24.0],
            [75.5, 23.0],
            [76.0, 22.0],
            [76.5, 21.0],
            [76.0, 20.0],
            [75.0, 20.0],
            [74.0, 20.0],
            [73.0, 20.5],
            [72.5, 21.0]
          ]
        ]
      }
    },
    // Andaman & Nicobar Islands
    {
      type: 'Feature',
      properties: {
        name: 'Andaman & Nicobar',
        tribe: 'Scheduled Tribes',
        population: '380,000',
        forest_cover: 6500,
        tree_cover: 1500,
        total_cover: 8000,
        color: [0, 128, 0],  // Green
        health: 'healthy'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [92.5, 6.8],
            [92.7, 7.0],
            [93.0, 7.5],
            [93.5, 8.0],
            [93.8, 8.5],
            [93.5, 9.0],
            [93.0, 9.5],
            [92.5, 10.0],
            [92.0, 10.5],
            [91.5, 10.0],
            [91.0, 9.5],
            [90.5, 9.0],
            [90.0, 8.5],
            [89.5, 8.0],
            [90.0, 7.5],
            [90.5, 7.0],
            [91.0, 6.8],
            [91.5, 7.0],
            [92.0, 7.5],
            [92.5, 6.8]
          ]
        ]
      }
    }
  ]
};

const INITIAL_VIEW_STATE: Partial<MapViewState> = {
  longitude: 80.0,
  latitude: 22.0,
  zoom: 4,
  minZoom: 4,  // Prevent zooming out too far
  maxZoom: 10,  // Limit maximum zoom
  pitch: 0,
  bearing: 0,
  maxPitch: 0,  // Disable 3D view
  minPitch: 0
};

const Forest3DMap: React.FC<Forest3DMapProps> = ({ height = 600, interactive = false }) => {
  const [layers, setLayers] = useState<Array<GeoJsonLayer | ScatterplotLayer>>([]);
  const [baseStyle, setBaseStyle] = useState<'forest' | 'satellite' | 'terrain'>('forest');
  const [selectedTribes, setSelectedTribes] = useState<string[]>([]);
  const mapRef = useRef<MapRef>(null);

  const tribes = Array.from(new Set((TRIBAL_REGIONS.features as any[]).map(f => (f.properties?.tribe ?? 'Unknown') as string))).sort();

  useEffect(() => {
    buildLayers();
  }, [selectedTribes]);

  const buildLayers = async () => {
    try {
      // Add India boundary layer
      const boundaryLayer = new GeoJsonLayer({
        id: 'india-boundary',
        data: INDIA_BOUNDARY,
        pickable: true,
        stroked: true,
        filled: true,
        wireframe: false,
        extruded: false,
        getFillColor: [0, 0, 0, 0],
        getLineColor: [0, 180, 40],
        getLineWidth: 2,
      });

      // Create layers for tribal regions with different colors
      const tribalFeatures = (TRIBAL_REGIONS.features as any[]).filter((f) => {
        if (!selectedTribes.length) return true; // no filter -> show all
        const tribe = (f.properties?.tribe || '').toString();
        return selectedTribes.map(t => t.toLowerCase()).includes(tribe.toLowerCase());
      });

      const tribalRegionLayers = tribalFeatures.map((feature, index) => {
        return new GeoJsonLayer({
          id: `tribal-region-${index}`,
          data: {
            type: 'FeatureCollection',
            features: [feature]
          },
          pickable: true,
          stroked: true,
          filled: true,
          extruded: false,
          wireframe: false,
          getFillColor: (f) => {
            const c = (f as any)?.properties?.color as number[] | undefined;
            if (Array.isArray(c) && c.length >= 3) {
              return [c[0], c[1], c[2], 200];
            }
            return [34, 139, 34, 200];
          },
          getLineColor: [255, 255, 255, 200],
          getLineWidth: 1,
          opacity: 0.7,
        });
      });

      // Add major cities with population data (removed for cleaner view)
      const citiesLayer = new ScatterplotLayer({
        id: 'cities',
        data: [],
        getPosition: d => d.position,
        getRadius: d => Math.sqrt(d.population) * 1000,
        getFillColor: [255, 200, 0, 200],
        getLineColor: [0, 0, 0],
        getLineWidth: 1,
        opacity: 0.8,
        pickable: true,
        radiusMinPixels: 5,
        radiusMaxPixels: 30,
      });

      setLayers([boundaryLayer, ...tribalRegionLayers]);
    } catch (error) {
      console.error('Error loading map data:', error);
    }
  };

  // Filtered features for stats and legend
  const filteredFeatures = (TRIBAL_REGIONS.features as any[]).filter((f) => {
    if (!selectedTribes.length) return true;
    const tribe = (f.properties?.tribe || '').toString();
    return selectedTribes.map(t => t.toLowerCase()).includes(tribe.toLowerCase());
  });

  // Compute health counts for legend (based on filtered set)
  const healthCounts = (() => {
    const counts = { healthy: 0, moderate: 0, degraded: 0 } as Record<string, number>;
    for (const f of filteredFeatures) {
      const h = (f.properties?.health || '').toLowerCase();
      if (counts[h] !== undefined) counts[h]++;
    }
    return counts;
  })();

  // Aggregate totals (based on filtered set)
  const aggregateTotals = filteredFeatures.reduce(
    (acc, f: any) => {
      acc.forest += Number(f.properties?.forest_cover || 0);
      acc.tree += Number(f.properties?.tree_cover || 0);
      acc.total += Number(f.properties?.total_cover || 0);
      return acc;
    },
    { forest: 0, tree: 0, total: 0 }
  );

  // Map style URLs for basemap toggles
  const mapStyleUrl = baseStyle === 'forest'
    ? 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json'
    : baseStyle === 'satellite'
      ? 'https://demotiles.maplibre.org/style.json'
      : 'https://tiles.stadiamaps.com/styles/outdoors.json';

  return (
    <div style={{ position: 'relative', width: '100%', height: typeof height === 'number' ? `${height}px` : height }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={{
          scrollZoom: interactive,
          dragPan: interactive,
          dragRotate: interactive,
          keyboard: interactive,
          doubleClickZoom: interactive,
          touchZoom: interactive,
          touchRotate: interactive
        }}
        layers={layers}
        getTooltip={({ object }) => {
          if (object?.properties) {
            const props = object.properties;
            return {
              html: `
                <div class="p-2 bg-gray-900 text-white text-sm">
                  <div class="font-bold">${props.name || 'Tribal Region'}</div>
                  <div class="mt-1">Tribe: ${props.tribe || 'Multiple'}</div>
                  <div>Population: ${props.population || 'Data not available'}</div>
                  <div class="mt-2">Forest Cover: ${props.forest_cover?.toLocaleString() || 'N/A'} km²</div>
                  <div>Tree Cover: ${props.tree_cover?.toLocaleString() || 'N/A'} km²</div>
                </div>
              `,
              style: {
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                boxShadow: 'none'
              }
            } as const;
          }
          return null;
        }}
      >
        {/* Controls moved outside <Map> to ensure visibility above canvases */}
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10000, pointerEvents: 'auto' }} aria-label="Map Controls">
            <div style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', padding: 8, borderRadius: 6, marginBottom: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Map View</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setBaseStyle('forest')} style={{ padding: '4px 8px', borderRadius: 4, background: baseStyle==='forest'?'#10b981':'transparent', color: baseStyle==='forest'?'#000':'#fff', border: '1px solid #10b981' }}>Forest</button>
                <button onClick={() => setBaseStyle('satellite')} style={{ padding: '4px 8px', borderRadius: 4, background: baseStyle==='satellite'?'#10b981':'transparent', color: baseStyle==='satellite'?'#000':'#fff', border: '1px solid #10b981' }}>Satellite</button>
                <button onClick={() => setBaseStyle('terrain')} style={{ padding: '4px 8px', borderRadius: 4, background: baseStyle==='terrain'?'#10b981':'transparent', color: baseStyle==='terrain'?'#000':'#fff', border: '1px solid #10b981' }}>Terrain</button>
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', padding: 8, borderRadius: 6, marginBottom: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Tribe Filter</div>
              {/* Quick Select Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {['Gond', 'Bhil', 'Scheduled Tribes', 'Multiple'].map((t) => {
                  const active = selectedTribes.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedTribes((prev) =>
                          active ? prev.filter((x) => x !== t) : Array.from(new Set([...prev, t]))
                        );
                      }}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 16,
                        border: `1px solid ${active ? '#10b981' : '#334155'}`,
                        background: active ? '#10b981' : '#0f172a',
                        color: active ? '#000' : '#fff',
                        fontSize: 12
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <button
                  onClick={() => setSelectedTribes([])}
                  style={{ padding: '4px 8px', borderRadius: 4, background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                >
                  Clear
                </button>
                <button
                  onClick={() => setSelectedTribes(tribes)}
                  style={{ padding: '4px 8px', borderRadius: 4, background: '#10b981', color: '#000', border: '1px solid #10b981' }}
                >
                  Select All
                </button>
              </div>
              <div style={{ maxHeight: 140, overflowY: 'auto', border: '1px solid #334155', borderRadius: 6, padding: 8 }}>
                {tribes.map((t) => {
                  const checked = selectedTribes.includes(t);
                  return (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedTribes((prev) => Array.from(new Set([...prev, t])));
                          else setSelectedTribes((prev) => prev.filter((x) => x !== t));
                        }}
                      />
                      <span>{t}</span>
                    </label>
                  );
                })}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: '#cbd5e1' }}>
                <div>Regions: {filteredFeatures.length}</div>
                <div>Forest Cover: {aggregateTotals.forest.toLocaleString()} km²</div>
                <div>Tree Cover: {aggregateTotals.tree.toLocaleString()} km²</div>
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', padding: 8, borderRadius: 6 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Forest Health Legend</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ display: 'inline-block', width: 12, height: 12, background: '#22c55e', borderRadius: 2 }}></span>
                <span>Healthy (&gt;75%) — {healthCounts.healthy}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ display: 'inline-block', width: 12, height: 12, background: '#facc15', borderRadius: 2 }}></span>
                <span>Moderate (50-75%) — {healthCounts.moderate}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ display: 'inline-block', width: 12, height: 12, background: '#ef4444', borderRadius: 2 }}></span>
                <span>Degraded (&lt;50%) — {healthCounts.degraded}</span>
              </div>
            </div>
        </div>

        <Map
          ref={mapRef}
          mapStyle={mapStyleUrl}
          style={{ width: '100%', height: '100%' }}
          reuseMaps
          attributionControl={false}
          maxBounds={[68, 6, 98, 36]} // Tighter bounds around India
        >
          {/* Add custom attribution */}
          <div className="maplibregl-ctrl maplibregl-ctrl-attrib" style={{ 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            padding: '2px 5px', 
            fontSize: '10px',
            position: 'absolute',
            bottom: '0',
            right: '0',
            margin: '0',
            zIndex: 1
          }}>
            © <a href="https://stadiamaps.com/" target="_blank" rel="noopener noreferrer">Stadia Maps</a> © <a href="https://openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
          </div>
        </Map>
      </DeckGL>
    </div>
  );
};

export default Forest3DMap;
