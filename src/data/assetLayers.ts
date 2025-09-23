// Mock GeoJSON layers for AI-based Asset Mapping restricted to selected states
// States: Madhya Pradesh, Tripura, Odisha, Telangana
// In real implementation, replace with model outputs (CV/ML) and official datasets.

import type { FeatureCollection, Geometry } from "geojson";

export type SupportedState = "Madhya Pradesh" | "Tripura" | "Odisha" | "Telangana";

export const ALLOWED_STATES: SupportedState[] = [
  "Madhya Pradesh",
  "Tripura",
  "Odisha",
  "Telangana",
];

// Minimal sample polygons/points to visualize layers
export const agricultureFC: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { state: "Madhya Pradesh", label: "Agri block" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.3, 23.2],
            [77.5, 23.2],
            [77.5, 23.4],
            [77.3, 23.4],
            [77.3, 23.2],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { state: "Telangana", label: "Agri block" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.4, 17.2],
            [78.6, 17.2],
            [78.6, 17.4],
            [78.4, 17.4],
            [78.4, 17.2],
          ],
        ],
      },
    },
  ],
};

export const forestFC: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { state: "Odisha", label: "Forest" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [84.8, 20.1],
            [85.1, 20.1],
            [85.1, 20.4],
            [84.8, 20.4],
            [84.8, 20.1],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { state: "Tripura", label: "Forest" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [91.2, 23.6],
            [91.4, 23.6],
            [91.4, 23.8],
            [91.2, 23.8],
            [91.2, 23.6],
          ],
        ],
      },
    },
  ],
};

export const waterFC: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { state: "Madhya Pradesh", label: "Pond" },
      geometry: { type: "Point", coordinates: [77.42, 23.25] },
    },
    {
      type: "Feature",
      properties: { state: "Odisha", label: "Stream" },
      geometry: { type: "LineString", coordinates: [[85.05, 20.2], [85.07, 20.25], [85.09, 20.27]] },
    },
  ],
};

export const homesteadsFC: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { state: "Telangana", label: "Homestead" },
      geometry: { type: "Point", coordinates: [78.5, 17.33] },
    },
    {
      type: "Feature",
      properties: { state: "Tripura", label: "Homestead" },
      geometry: { type: "Point", coordinates: [91.35, 23.72] },
    },
  ],
};

export function filterByAllowedStates(fc: FeatureCollection): FeatureCollection<Geometry, any> {
  return {
    type: "FeatureCollection",
    features: (fc.features || []).filter((f: any) => ALLOWED_STATES.includes((f.properties?.state ?? "") as SupportedState)),
  } as FeatureCollection;
}
