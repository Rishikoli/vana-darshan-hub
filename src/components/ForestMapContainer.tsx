import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { villageData } from '@/data/sampleData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ForestMapContainerProps {
  onVillageSelect?: (village: any) => void;
}

// Enhanced 3D-styled map component with detailed interactions
const ForestMapContainer: React.FC<ForestMapContainerProps> = ({ onVillageSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedVillage, setSelectedVillage] = useState<any>(null);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'terrain' | 'forest'>('forest');
  const dispatch = useDispatch();

  // Calculate positions for villages on the map
  const getVillagePosition = (coordinates: number[]) => {
    const [lng, lat] = coordinates;
    // Simple projection for demonstration
    const x = ((lng - 75) / 15) * 100; // Rough India bounds
    const y = ((lat - 15) / 15) * 100;
    return { x: `${50 + x}%`, y: `${50 - y}%` };
  };

  const getVillageColor = (alertLevel: string) => {
    switch (alertLevel) {
      case 'healthy': return 'bg-forest-healthy';
      case 'moderate': return 'bg-forest-moderate';
      case 'degraded': return 'bg-forest-degraded';
      default: return 'bg-muted';
    }
  };

  const handleVillageClick = (village: any) => {
    setSelectedVillage(village);
    onVillageSelect?.(village);
    dispatch({ type: 'SET_SELECTED_VILLAGE', payload: village });
  };

  const getMapBackground = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-950 dark:to-blue-950';
      case 'terrain':
        return 'bg-gradient-to-br from-amber-50 to-green-100 dark:from-amber-950 dark:to-green-950';
      default:
        return 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900';
    }
  };

  return (
    <div className={`relative h-[600px] w-full rounded-lg overflow-hidden shadow-government ${getMapBackground()}`}>
      {/* Map Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="forestPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="2" fill="currentColor" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#forestPattern)" />
        </svg>
      </div>

      {/* Village Markers */}
      {villageData.features.map((feature, index) => {
        const position = getVillagePosition(feature.geometry.coordinates);
        const village = feature.properties;
        
        return (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: position.x, top: position.y }}
            onClick={() => handleVillageClick(village)}
          >
            {/* Village Marker */}
            <div className={`w-6 h-6 rounded-full ${getVillageColor(village.alert_level)} border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-125 group-hover:shadow-xl`}>
              <div className="w-full h-full rounded-full animate-pulse" />
            </div>
            
            {/* Village Label */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <div className="bg-card px-2 py-1 rounded shadow-lg border text-xs whitespace-nowrap">
                <p className="font-medium">{village.village_name}</p>
                <p className="text-muted-foreground">{village.district}, {village.state}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        {/* Map Style Selector */}
        <div className="bg-card rounded-lg p-3 shadow-lg">
          <h3 className="text-sm font-medium mb-2">Map View</h3>
          <div className="space-y-1">
            <button
              onClick={() => setMapStyle('forest')}
              className={`w-full text-xs px-2 py-1 rounded text-left ${mapStyle === 'forest' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            >
              Forest View
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`w-full text-xs px-2 py-1 rounded text-left ${mapStyle === 'satellite' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapStyle('terrain')}
              className={`w-full text-xs px-2 py-1 rounded text-left ${mapStyle === 'terrain' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            >
              Terrain
            </button>
          </div>
        </div>

        {/* Forest Health Legend */}
        <div className="bg-card rounded-lg p-3 shadow-lg">
          <h3 className="text-sm font-medium mb-2">Forest Health Legend</h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-forest-healthy"></div>
                <span className="text-xs">Healthy (&gt;75%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-forest-moderate"></div>
                <span className="text-xs">Moderate (50-75%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-forest-degraded"></div>
                <span className="text-xs">Degraded (&lt;50%)</span>
              </div>
            </div>
        </div>

        {/* Statistics Panel */}
        <div className="bg-card rounded-lg p-3 shadow-lg">
          <h3 className="text-sm font-medium mb-2">Quick Stats</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Total Villages:</span>
              <span className="font-semibold">{villageData.features.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Coverage:</span>
              <span className="font-semibold">
                {(villageData.features.reduce((acc, f) => acc + f.properties.forest_cover_percentage, 0) / villageData.features.length).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Population:</span>
              <span className="font-semibold">
                {villageData.features.reduce((acc, f) => acc + f.properties.population, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Village Details Panel */}
      {selectedVillage && (
        <div className="absolute bottom-4 left-4 w-80">
          <Card className="shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">{selectedVillage.village_name}</h3>
                <Badge className={getVillageColor(selectedVillage.alert_level)}>
                  {selectedVillage.alert_level}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">State/District</p>
                  <p className="font-medium">{selectedVillage.district}, {selectedVillage.state}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Population</p>
                  <p className="font-medium">{selectedVillage.population.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Forest Cover</p>
                  <p className="font-medium">{selectedVillage.forest_cover_percentage}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">FRA Claims</p>
                  <p className="font-medium">{selectedVillage.claims_count}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Beneficiaries</p>
                  <p className="font-medium">{selectedVillage.beneficiaries}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{selectedVillage.processing_stage.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Map Title */}
      <div className="absolute top-4 left-4">
        <div className="bg-card rounded-lg px-4 py-2 shadow-lg">
          <h2 className="font-bold text-lg">Forest Rights Villages</h2>
          <p className="text-sm text-muted-foreground">Interactive 3D Forest Coverage Map</p>
        </div>
      </div>
    </div>
  );
};

export default ForestMapContainer;