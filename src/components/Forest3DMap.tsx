import React, { useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { PathOptions } from 'leaflet';
import type { Feature, Polygon, FeatureCollection } from 'geojson';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// No external GIS deps to keep bundle light

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

// Key Tribal Districts for FRA Monitoring
const TRIBAL_REGIONS = {
  "type": "FeatureCollection",
  "name": "Key Tribal Districts for FRA Monitoring - Master v4",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "state": "Madhya Pradesh",
        "district": "Dindori",
        "state_code_2011": 23,
        "district_code_2011": 460,
        "dominant_tribe": "Gond",
        "other_tribes": ["Baiga", "Korku", "Kol"],
        "TribeMultiplePopulation": [
          {"tribe": "Gond", "population_estimate": 350000},
          {"tribe": "Baiga", "population_estimate": 45000},
          {"tribe": "Kol", "population_estimate": 30000},
          {"tribe": "Korku", "population_estimate": 15000}
        ],
        "pvgt_present": ["Baiga"],
        "population_total_2011": 704524,
        "population_st_2011": 455694,
        "percentage_st_2011": 64.69,
        "ForestCover_km2": 3954,
        "TreeCover_km2": 185,
        "Health": {
          "overall_status": "moderate",
          "key_issues": ["Malnutrition (Stunting)", "Anemia in women", "Limited access to PHCs in remote areas"],
          "infant_mortality_rate_estimate": "High"
        },
        "claims_ifr_potential": "Very High",
        "claims_cfr_potential": "Very High",
        "implementation_challenge": "Ensuring habitat rights for Baiga (PVTG); mapping of overlapping community boundaries.",
        "key_forest_type": "Tropical Dry Deciduous (Sal dominant)",
        "key_topography": "Plateau with hilly terrain, part of the Maikal Hills.",
        "major_rivers_and_waterbodies": ["Narmada River"]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[80.835, 23.295], [80.999, 23.279], [81.166, 23.321], [81.332, 23.284], [81.428, 23.181], [81.564, 23.178], [81.652, 23.045], [81.691, 22.925], [81.597, 22.784], [81.522, 22.639], [81.378, 22.569], [81.246, 22.518], [81.109, 22.529], [81.011, 22.469], [80.892, 22.521], [80.735, 22.526], [80.603, 22.607], [80.491, 22.768], [80.528, 22.941], [80.686, 23.084], [80.791, 23.219], [80.835, 23.295]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Madhya Pradesh",
        "district": "Alirajpur",
        "state_code_2011": 23,
        "district_code_2011": 466,
        "dominant_tribe": "Bhil",
        "other_tribes": ["Bhilala", "Patelia"],
        "TribeMultiplePopulation": [
          {"tribe": "Bhil", "population_estimate": 550000},
          {"tribe": "Bhilala", "population_estimate": 80000},
          {"tribe": "Patelia", "population_estimate": 17000}
        ],
        "pvgt_present": [],
        "population_total_2011": 728999,
        "population_st_2011": 647271,
        "percentage_st_2011": 88.79,
        "ForestCover_km2": 428,
        "TreeCover_km2": 85,
        "Health": {
          "overall_status": "poor",
          "key_issues": ["High seasonal migration impacting child health", "Sickle Cell Anemia prevalence", "Low institutional delivery rates"],
          "infant_mortality_rate_estimate": "Very High"
        },
        "claims_ifr_potential": "Extremely High",
        "claims_cfr_potential": "Moderate",
        "implementation_challenge": "High levels of poverty and migration; ensuring land titles are properly recorded.",
        "key_forest_type": "Teak Forest and Dry Scrubland",
        "key_topography": "Undulating hills of the Vindhya Range."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[74.03, 22.56], [74.3, 22.54], [74.5, 22.4], [74.55, 22.1], [74.3, 21.9], [74.1, 22.05], [74.0, 22.3], [74.03, 22.56]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Madhya Pradesh",
        "district": "Sheopur",
        "state_code_2011": 23,
        "district_code_2011": 420,
        "dominant_tribe": "Sahariya",
        "other_tribes": ["Gond"],
        "TribeMultiplePopulation": [
          {"tribe": "Sahariya", "population_estimate": 135000},
          {"tribe": "Gond", "population_estimate": 15000}
        ],
        "pvgt_present": ["Sahariya"],
        "population_total_2011": 687861,
        "population_st_2011": 154181,
        "percentage_st_2011": 22.41,
        "ForestCover_km2": 3467,
        "TreeCover_km2": 72,
        "Health": {
          "overall_status": "critical",
          "key_issues": ["Extreme acute malnutrition (SAM/MAM)", "Tuberculosis (TB)", "Food insecurity"],
          "infant_mortality_rate_estimate": "Extremely High"
        },
        "claims_ifr_potential": "High",
        "claims_cfr_potential": "High",
        "implementation_challenge": "Extreme malnutrition among Sahariya PVTG; conflict with forest department around Kuno National Park.",
        "key_forest_type": "Dry Deciduous, Kardhai and Salai forests",
        "key_topography": "Plains with some hilly tracts.",
        "major_rivers_and_waterbodies": ["Chambal River", "Kuno River"]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[76.4, 26.0], [76.8, 26.1], [77.2, 25.8], [77.3, 25.5], [76.9, 25.3], [76.5, 25.4], [76.3, 25.7], [76.4, 26.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Odisha",
        "district": "Malkangiri",
        "state_code_2011": 21,
        "district_code_2011": 392,
        "dominant_tribe": "Koya",
        "other_tribes": ["Bonda", "Didayi", "Gadaba"],
        "TribeMultiplePopulation": [
          {"tribe": "Koya", "population_estimate": 150000},
          {"tribe": "Bonda", "population_estimate": 12000},
          {"tribe": "Gadaba", "population_estimate": 40000},
          {"tribe": "Didayi", "population_estimate": 8000}
        ],
        "pvgt_present": ["Bonda", "Didayi"],
        "population_total_2011": 613192,
        "population_st_2011": 351972,
        "percentage_st_2011": 57.40,
        "ForestCover_km2": 2145,
        "TreeCover_km2": 150,
        "Health": {
          "overall_status": "poor",
          "key_issues": ["Malaria prevalence", "Water-borne diseases (Diarrhea, Cholera)", "Limited healthcare access in cut-off areas"],
          "infant_mortality_rate_estimate": "Very High"
        },
        "claims_ifr_potential": "Very High",
        "claims_cfr_potential": "Critical",
        "implementation_challenge": "Protecting Bonda habitat rights; historical left-wing extremism; remoteness of villages.",
        "key_forest_type": "Tropical Moist Deciduous",
        "key_topography": "Hilly terrain with dense forests, part of the Eastern Ghats.",
        "major_rivers_and_waterbodies": ["Machkund River", "Sileru River"]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[81.56, 18.66], [81.89, 18.61], [82.25, 18.42], [82.4, 18.2], [82.35, 17.95], [82.1, 17.77], [81.88, 17.89], [81.65, 18.15], [81.54, 18.41], [81.56, 18.66]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Odisha",
        "district": "Mayurbhanj",
        "state_code_2011": 21,
        "district_code_2011": 376,
        "dominant_tribe": "Santal",
        "other_tribes": ["Kolha", "Bhumij", "Ho", "Mankidia"],
        "TribeMultiplePopulation": [
          {"tribe": "Santal", "population_estimate": 700000},
          {"tribe": "Kolha", "population_estimate": 250000},
          {"tribe": "Bhumij", "population_estimate": 150000},
          {"tribe": "Ho", "population_estimate": 100000},
          {"tribe": "Mankidia", "population_estimate": 2220}
        ],
        "pvgt_present": ["Mankidia"],
        "population_total_2011": 2519738,
        "population_st_2011": 1478586,
        "percentage_st_2011": 58.72,
        "ForestCover_km2": 4443,
        "TreeCover_km2": 439,
        "Health": {
          "overall_status": "moderate",
          "key_issues": ["Leprosy and Tuberculosis (TB) pockets", "Anemia", "Dependence on traditional healers"],
          "infant_mortality_rate_estimate": "High"
        },
        "claims_ifr_potential": "Very High",
        "claims_cfr_potential": "Very High",
        "implementation_challenge": "Balancing conservation efforts of Simlipal National Park with tribal rights; addressing Mankidia rights to collect Siali fibre.",
        "key_forest_type": "Semi-evergreen and Sal forests",
        "key_topography": "Hilly, with the Simlipal hill range at its center.",
        "major_rivers_and_waterbodies": ["Budhabalanga River", "Subarnarekha River"]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[85.8, 22.4], [86.2, 22.5], [86.7, 22.2], [87.1, 21.8], [86.8, 21.5], [86.3, 21.4], [85.9, 21.7], [85.8, 22.4]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Tripura",
        "district": "Dhalai",
        "state_code_2011": 16,
        "district_code_2011": 272,
        "dominant_tribe": "Tripuri",
        "other_tribes": ["Reang (Bru)", "Chakma", "Halam"],
        "TribeMultiplePopulation": [
          {"tribe": "Tripuri", "population_estimate": 80000},
          {"tribe": "Reang (Bru)", "population_estimate": 95000},
          {"tribe": "Chakma", "population_estimate": 20000}
        ],
        "pvgt_present": ["Reang (Bru)"],
        "population_total_2011": 378230,
        "population_st_2011": 204561,
        "percentage_st_2011": 54.08,
        "ForestCover_km2": 1785,
        "TreeCover_km2": 58,
        "Health": {
          "overall_status": "poor",
          "key_issues": ["Health challenges related to displacement (Reang-Bru)", "Malaria and vector-borne diseases", "Inadequate nutrition"],
          "infant_mortality_rate_estimate": "High"
        },
        "claims_ifr_potential": "High",
        "claims_cfr_potential": "High",
        "implementation_challenge": "Rehabilitation and land rights for internally displaced Reang (Bru) population; conversion of 'jhum' (shifting cultivation) lands.",
        "key_forest_type": "Semi-evergreen and Bamboo Forests",
        "key_topography": "Longitudinal hill ranges (Longtharai range)."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[91.75, 24.3], [91.9, 24.35], [92.05, 24.2], [92.1, 23.8], [91.95, 23.6], [91.7, 23.7], [91.6, 24.0], [91.75, 24.3]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Telangana",
        "district": "Adilabad",
        "state_code_2011": 28,
        "district_code_2011": 532,
        "dominant_tribe": "Gond",
        "other_tribes": ["Kolam", "Pardhan", "Thoti", "Lambadi"],
        "TribeMultiplePopulation": [
          {"tribe": "Gond", "population_estimate": 120000},
          {"tribe": "Kolam", "population_estimate": 50000},
          {"tribe": "Lambadi", "population_estimate": 45000},
          {"tribe": "Pardhan", "population_estimate": 20000}
        ],
        "pvgt_present": ["Kolam"],
        "population_total_2011": 708972,
        "population_st_2011": 249646,
        "percentage_st_2011": 35.21,
        "ForestCover_km2": 1645,
        "TreeCover_km2": 95,
        "Health": {
          "overall_status": "moderate",
          "key_issues": ["Fluorosis in drinking water", "Anemia", "Gastrointestinal infections"],
          "infant_mortality_rate_estimate": "Moderate-High"
        },
        "claims_ifr_potential": "Very High",
        "claims_cfr_potential": "Very High",
        "implementation_challenge": "Human-wildlife conflict from Kawal Tiger Reserve; ensuring titles for 'podu' cultivation.",
        "key_forest_type": "Dry Teak and Mixed Deciduous Forest",
        "key_topography": "Plateau region with dense forests."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[78.2, 19.8], [78.6, 19.9], [79.0, 19.7], [79.2, 19.4], [78.8, 19.2], [78.4, 19.3], [78.1, 19.6], [78.2, 19.8]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Chhattisgarh",
        "district": "Bastar",
        "state_code_2011": 22,
        "district_code_2011": 412,
        "dominant_tribe": "Gond",
        "other_tribes": ["Maria", "Muria", "Dhurwa", "Halba"],
        "TribeMultiplePopulation": [
          {"tribe": "Gond (including Muria, Maria)", "population_estimate": 500000},
          {"tribe": "Halba", "population_estimate": 80000},
          {"tribe": "Dhurwa", "population_estimate": 40000}
        ],
        "pvgt_present": ["Abujh Maria"],
        "population_total_2011": 834375,
        "population_st_2011": 628906,
        "percentage_st_2011": 75.38,
        "ForestCover_km2": 2860,
        "TreeCover_km2": 190,
        "Health": {
          "overall_status": "poor",
          "key_issues": ["Impact of conflict on health services", "Malaria endemicity", "Severe malnutrition"],
          "infant_mortality_rate_estimate": "Very High"
        },
        "claims_ifr_potential": "Extremely High",
        "claims_cfr_potential": "Extremely High",
        "implementation_challenge": "Long history of left-wing extremism severely impacting administration and rights recognition; protecting the unique culture of Abujh Maria.",
        "key_forest_type": "Moist Peninsular Sal Forest",
        "key_topography": "Forested plateau, home to the Kanger Valley National Park."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[81.3, 19.5], [81.7, 19.6], [82.1, 19.3], [82.2, 19.0], [81.8, 18.8], [81.4, 18.9], [81.2, 19.2], [81.3, 19.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Odisha",
        "district": "Malkangiri",
        "state_code_2011": 21,
        "district_code_2011": 392,
        "dominant_tribe": "Koya",
        "other_tribes": ["Bonda", "Didayi", "Gadaba"],
        "pvgt_present": ["Bonda", "Didayi"],
        "pvgt_population_estimate": 12000,
        "population_total_2011": 613192,
        "population_st_2011": 351972,
        "percentage_st_2011": 57.40,
        "claims_ifr_potential": "Very High",
        "claims_cfr_potential": "Critical",
        "implementation_challenge": "Protecting Bonda habitat rights; historical left-wing extremism; remoteness of villages; proper documentation of claims.",
        "key_forest_type": "Tropical Moist Deciduous",
        "key_topography": "Hilly terrain with dense forests, part of the Eastern Ghats.",
        "major_rivers_and_waterbodies": ["Sabari River", "Sileru River", "Balimela Reservoir"],
        "health": "moderate"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[81.56, 18.66], [81.89, 18.61], [82.25, 18.42], [82.4, 18.2], [82.35, 17.95], [82.1, 17.77], [81.88, 17.89], [81.65, 18.15], [81.54, 18.41], [81.56, 18.66]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Odisha",
        "district": "Kandhamal",
        "state_code_2011": 21,
        "district_code_2011": 386,
        "dominant_tribe": "Kondh",
        "other_tribes": ["Gond"],
        "pvgt_present": ["Dongria Kondh"],
        "pvgt_population_estimate": 8000,
        "population_total_2011": 733110,
        "population_st_2011": 393977,
        "percentage_st_2011": 53.74,
        "claims_ifr_potential": "Very High",
        "claims_cfr_potential": "Very High",
        "implementation_challenge": "History of social conflict; recognizing rights over shifting cultivation (podu) lands; protecting sacred groves and sites.",
        "key_forest_type": "Moist Deciduous, Sal forests",
        "key_topography": "High plateau and hilly region of the Eastern Ghats.",
        "major_rivers_and_waterbodies": ["Buda River"],
        "health": "moderate"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[83.9, 20.9], [84.3, 20.8], [84.6, 20.5], [84.4, 20.2], [84.0, 20.1], [83.6, 20.4], [83.5, 20.7], [83.9, 20.9]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Odisha",
        "district": "Sundargarh",
        "state_code_2011": 21,
        "district_code_2011": 374,
        "dominant_tribe": "Munda",
        "other_tribes": ["Oraon", "Kisan", "Gond"],
        "pvgt_present": ["Paudi Bhuyan"],
        "pvgt_population_estimate": 35000,
        "population_total_2011": 2093437,
        "population_st_2011": 1058444,
        "percentage_st_2011": 50.56,
        "claims_ifr_potential": "High",
        "claims_cfr_potential": "High",
        "implementation_challenge": "Intense industrial and mining pressure (coal, iron ore); diversion of forest land for projects; ensuring community consent is properly obtained.",
        "key_forest_type": "Dry Deciduous Forest",
        "key_topography": "Plateau region, part of the Chota Nagpur Plateau.",
        "major_rivers_and_waterbodies": ["Brahmani River", "Ib River"],
        "health": "moderate"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[83.6, 22.4], [84.0, 22.5], [84.5, 22.3], [85.0, 22.0], [85.2, 21.7], [84.8, 21.6], [84.2, 21.8], [83.7, 22.0], [83.6, 22.4]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Odisha",
        "district": "Mayurbhanj",
        "state_code_2011": 21,
        "district_code_2011": 376,
        "dominant_tribe": "Santal",
        "other_tribes": ["Kolha", "Bhumij", "Ho"],
        "pvgt_present": ["Mankidia"],
        "pvgt_population_estimate": 2220,
        "population_total_2011": 2519738,
        "population_st_2011": 1478586,
        "percentage_st_2011": 58.72,
        "claims_ifr_potential": "Very High",
        "claims_cfr_potential": "Very High",
        "implementation_challenge": "Balancing conservation efforts of Simlipal National Park with tribal rights; formalizing community-led forest protection; addressing Mankidia rights to collect Siali fibre.",
        "key_forest_type": "Semi-evergreen and Sal forests",
        "key_topography": "Hilly, with the Simlipal hill range at its center.",
        "major_rivers_and_waterbodies": ["Budhabalanga River"],
        "health": "moderate"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[85.8, 22.4], [86.2, 22.5], [86.7, 22.2], [87.1, 21.8], [86.8, 21.5], [86.3, 21.4], [85.9, 21.7], [85.8, 22.4]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Tripura",
        "district": "Dhalai",
        "state_code_2011": 16,
        "district_code_2011": 272,
        "dominant_tribe": "Tripuri",
        "other_tribes": ["Reang (Bru)", "Chakma", "Halam"],
        "pvgt_present": ["Reang (Bru)"],
        "pvgt_population_estimate": 180000,
        "population_total_2011": 378230,
        "population_st_2011": 204561,
        "percentage_st_2011": 54.08,
        "claims_ifr_potential": "High",
        "claims_cfr_potential": "High",
        "implementation_challenge": "Rehabilitation and land rights for internally displaced Reang (Bru); conversion of 'jhum' (shifting cultivation) lands; lack of administrative capacity.",
        "key_forest_type": "Semi-evergreen and Bamboo Forests",
        "key_topography": "Longitudinal hill ranges (Longtharai range).",
        "major_rivers_and_waterbodies": ["Manu River", "Dhalai River"],
        "health": "moderate"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[91.75, 24.3], [91.9, 24.35], [92.05, 24.2], [92.1, 23.8], [91.95, 23.6], [91.7, 23.7], [91.6, 24.0], [91.75, 24.3]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Tripura",
        "district": "Gomati",
        "state_code_2011": 16,
        "district_code_2011": 274,
        "dominant_tribe": "Tripuri",
        "other_tribes": ["Jamatia", "Reang", "Noatia"],
        "pvgt_present": ["Reang (Bru)"],
        "pvgt_population_estimate": 15000,
        "population_total_2011": 441538,
        "population_st_2011": 153285,
        "percentage_st_2011": 34.72,
        "claims_ifr_potential": "Moderate",
        "claims_cfr_potential": "Moderate",
        "implementation_challenge": "Pressure on land due to higher population density; recognition of rights around religious sites; influence of Joint Forest Management Committees (JFMCs).",
        "key_forest_type": "Moist Deciduous and Bamboo brakes",
        "key_topography": "Mix of plains and low-lying hills.",
        "major_rivers_and_waterbodies": ["Gomati River"],
        "health": "moderate"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[91.3, 23.6], [91.5, 23.7], [91.65, 23.5], [91.6, 23.3], [91.4, 23.2], [91.25, 23.4], [91.3, 23.6]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Tripura",
        "district": "North Tripura",
        "state_code_2011": 16,
        "district_code_2011": 271,
        "dominant_tribe": "Tripuri",
        "other_tribes": ["Chakma", "Halam"],
        "pvgt_present": [],
        "pvgt_population_estimate": 0,
        "population_total_2011": 417441,
        "population_st_2011": 113391,
        "percentage_st_2011": 27.16,
        "claims_ifr_potential": "Moderate",
        "claims_cfr_potential": "Moderate",
        "implementation_challenge": "Inter-community land disputes; encroachment on forest land; ensuring claims are processed for communities living near the border areas.",
        "key_forest_type": "Bamboo and mixed moist deciduous forests",
        "key_topography": "Hilly terrain with several valleys (Jampui Hills).",
        "major_rivers_and_waterbodies": ["Longai River"],
        "health": "moderate"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[91.8, 24.5], [92.1, 24.6], [92.3, 24.4], [92.4, 24.1], [92.2, 24.0], [91.9, 24.2], [91.8, 24.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Telangana",
        "district": "Adilabad",
        "state_code_2011": 28,
        "district_code_2011": 532,
        "dominant_tribe": "Gond",
        "other_tribes": ["Kolam", "Pardhan", "Thoti", "Lambadi"],
        "pvgt_present": ["Kolam"],
        "pvgt_population_estimate": 50000,
        "population_total_2011": 708972,
        "population_st_2011": 249646,
        "percentage_st_2011": 35.21,
        "claims_ifr_potential": "Very High",
        "claims_cfr_potential": "Very High",
        "implementation_challenge": "Protecting cultural identity of Gonds; human-wildlife conflict from Kawal Tiger Reserve; ensuring titles for 'podu' cultivation.",
        "key_forest_type": "Dry Teak and Mixed Deciduous Forest",
        "key_topography": "Plateau region with dense forests.",
        "major_rivers_and_waterbodies": ["Godavari River", "Penganga River"],
        "health": "moderate"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[78.2, 19.8], [78.6, 19.9], [79.0, 19.7], [79.2, 19.4], [78.8, 19.2], [78.4, 19.3], [78.1, 19.6], [78.2, 19.8]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Telangana",
        "district": "Bhadradri Kothagudem",
        "state_code_2011": 28,
        "district_code_2011": 541,
        "dominant_tribe": "Koya",
        "other_tribes": ["Konda Reddi", "Lambadi"],
        "pvgt_present": ["Konda Reddi"],
        "pvgt_population_estimate": 25000,
        "population_total_2011": 1069261,
        "population_st_2011": 354992,
        "percentage_st_2011": 33.20,
        "claims_ifr_potential": "Very High",
        "claims_cfr_potential": "High",
        "implementation_challenge": "Land submergence from Polavaram project; industrial pollution from mining and thermal plants; verification of long-standing claims.",
        "key_forest_type": "Dry Teak and Mixed Deciduous Forest",
        "key_topography": "Riverine plains and forested hills.",
        "major_rivers_and_waterbodies": ["Godavari River"],
        "health": "moderate"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[80.3, 18.1], [80.6, 18.25], [80.9, 18.1], [81.2, 17.9], [81.3, 17.5], [80.9, 17.3], [80.5, 17.4], [80.35, 17.7], [80.3, 18.1]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Telangana",
        "district": "Mahabubabad",
        "state_code_2011": 28,
        "district_code_2011": 540,
        "dominant_tribe": "Lambadi",
        "other_tribes": ["Koya"],
        "pvgt_present": [],
        "pvgt_population_estimate": 0,
        "population_total_2011": 774549,
        "population_st_2011": 293393,
        "percentage_st_2011": 37.88,
        "claims_ifr_potential": "Moderate",
        "claims_cfr_potential": "Low",
        "implementation_challenge": "Resolving claims of Lambadi communities in less forested areas; conflict between traditional forest dwellers and other communities.",
        "key_forest_type": "Tropical Dry Deciduous and Scrub Forest",
        "key_topography": "Undulating plains with scattered hillocks.",
        "major_rivers_and_waterbodies": ["Munneru River"],
        "health": "moderate"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[79.8, 18.0], [80.1, 18.1], [80.3, 17.8], [80.0, 17.6], [79.7, 17.7], [79.8, 18.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Chhattisgarh",
        "district": "Bastar",
        "state_code_2011": 22,
        "district_code_2011": 412,
        "dominant_tribe": "Gond",
        "other_tribes": ["Maria", "Muria", "Dhurwa", "Halba"],
        "pvgt_present": ["Abujh Maria"],
        "pvgt_population_estimate": 20000,
        "population_total_2011": 834375,
        "population_st_2011": 628906,
        "percentage_st_2011": 75.38,
        "claims_ifr_potential": "Extremely High",
        "claims_cfr_potential": "Extremely High",
        "implementation_challenge": "Long history of left-wing extremism severely impacting administration and rights recognition; protecting the unique culture of Abujh Maria.",
        "key_forest_type": "Moist Peninsular Sal Forest",
        "key_topography": "Forested plateau, home to the Kanger Valley National Park.",
        "major_rivers_and_waterbodies": ["Indravati River"],
        "health": "moderate"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[81.3, 19.5], [81.7, 19.6], [82.1, 19.3], [82.2, 19.0], [81.8, 18.8], [81.4, 18.9], [81.2, 19.2], [81.3, 19.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "state": "Chhattisgarh",
        "district": "Dantewada (South Bastar)",
        "state_code_2011": 22,
        "district_code_2011": 414,
        "dominant_tribe": "Maria",
        "other_tribes": ["Muria", "Gond", "Halba"],
        "pvgt_present": [],
        "pvgt_population_estimate": 0,
        "population_total_2011": 247029,
        "population_st_2011": 194783,
        "percentage_st_2011": 78.85,
        "claims_ifr_potential": "Extremely High",
        "claims_cfr_potential": "Extremely High",
        "implementation_challenge": "Severe impact of mining (especially iron ore at Bailadila mines); security force presence and conflict; displacement of communities.",
        "key_forest_type": "Moist and Dry Deciduous forests",
        "key_topography": "Rugged, hilly terrain with rich mineral deposits.",
        "major_rivers_and_waterbodies": ["Indravati River", "Shankini River"],
        "health": "degraded"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[80.9, 19.1], [81.2, 19.2], [81.5, 19.0], [81.4, 18.7], [81.1, 18.6], [80.8, 18.8], [80.9, 19.1]]]
      }
    }
  ]
};

// Leaflet initial view
const INITIAL_CENTER: [number, number] = [22.0, 80.0]; // [lat, lng]
const INITIAL_ZOOM = 4;

const buttonStyle = {
  padding: '6px 12px',
  borderRadius: '6px',
  background: '#1e293b',
  border: '1px solid #334155',
  color: '#e2e8f0',
  cursor: 'pointer',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.2s'
};

const Forest3DMap: React.FC<Forest3DMapProps> = ({ height = 600, interactive = false }) => {
  const [baseStyle, setBaseStyle] = useState<'forest' | 'satellite' | 'terrain'>('forest');
  const [selectedTribes, setSelectedTribes] = useState<string[]>([]);
  const [selectedHealths, setSelectedHealths] = useState<string[]>([]);
  const [isInteractive] = useState<boolean>(interactive);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [selectedInfo, setSelectedInfo] = useState<any | null>(null);
  const [mapStyle, setMapStyle] = useState<'forest' | 'satellite' | 'terrain'>('forest');
  const [tribePage, setTribePage] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const selectedLayerRef = useRef<any | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnTribePage = location.pathname === '/tribe';

  const tribes = useMemo(() => {
    const list = new Set<string>();
    for (const f of (TRIBAL_REGIONS.features as any[])) {
      const p = (f as any).properties || {};
      const t = (p.tribe ?? p.dominant_tribe ?? 'Unknown').toString();
      list.add(t);
    }
    return Array.from(list).sort();
  }, []);

  const healthOptions = [
    { value: 'healthy', label: 'Healthy (>75%)' },
    { value: 'moderate', label: 'Moderate (50-75%)' },
    { value: 'degraded', label: 'Degraded (<50%)' }
  ];

  const toggleTribe = (tribe: string) => {
    setSelectedTribes(prev => 
      prev.includes(tribe) 
        ? prev.filter(t => t !== tribe)
        : [...prev, tribe]
    );
  };

  const toggleHealth = (health: string) => {
    setSelectedHealths(prev => 
      prev.includes(health)
        ? prev.filter(h => h !== health)
        : [...prev, health]
    );
  };

  const toggleAllTribes = () => {
    setSelectedTribes(prev => prev.length === tribes.length ? [] : [...tribes]);
  };

  const toggleAllHealths = () => {
    setSelectedHealths(prev => 
      prev.length === healthOptions.length 
        ? [] 
        : healthOptions.map(h => h.value)
    );
  };

  const healthCounts = useMemo(() => {
    const counts = { healthy: 0, moderate: 0, degraded: 0 };
    (TRIBAL_REGIONS.features as any[]).forEach(f => {
      const health = (f.properties?.Health?.overall_status || '').toLowerCase();
      if (health in counts) counts[health]++;
    });
    return counts;
  }, []);

  // Filtered features for stats and legend
  const filteredFeatures = (TRIBAL_REGIONS.features as any[]).filter((f) => {
    const p: any = f.properties || {};
    const tribe = (p.tribe ?? p.dominant_tribe ?? '').toString();
    const health = (p.health ?? p.Health?.overall_status ?? '').toString().toLowerCase();
    const tribeOk = !selectedTribes.length || selectedTribes.map(t => t.toLowerCase()).includes(tribe.toLowerCase());
    const healthOk = !selectedHealths.length || selectedHealths.map(h => h.toLowerCase()).includes(health);
    return tribeOk && healthOk;
  });

  // Use filtered features directly (no clipping) to avoid heavy GIS deps
  const clippedFeatures = filteredFeatures as any[];

  // Compute health counts for legend (based on filtered set)
  const filteredHealthCounts = useMemo(() => {
    const counts = { healthy: 0, moderate: 0, degraded: 0 } as Record<string, number>;
    for (const f of filteredFeatures as any[]) {
      const p: any = f.properties || {};
      const h = (p.health ?? p.Health?.overall_status ?? '').toString().toLowerCase();
      if (counts[h] !== undefined) counts[h]++;
    }
    return counts;
  }, [filteredFeatures]);

  // Aggregate totals (based on filtered set)
  const aggregateTotals = (filteredFeatures as any[]).reduce(
    (acc, f: any) => {
      const p: any = f.properties || {};
      acc.forest += Number(p.forest_cover ?? p.ForestCover_km2 ?? 0);
      acc.tree += Number(p.tree_cover ?? p.TreeCover_km2 ?? 0);
      const total = (p.total_cover ?? (Number(p.ForestCover_km2 ?? 0) + Number(p.TreeCover_km2 ?? 0)));
      acc.total += Number(total ?? 0);
      return acc;
    },
    { forest: 0, tree: 0, total: 0 }
  );

  // Basemap URLs for Leaflet
  const tileUrl = mapStyle === 'forest'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : mapStyle === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';

  const mapProps: any = {
    center: INITIAL_CENTER,
    zoom: INITIAL_ZOOM,
    minZoom: 4,
    maxZoom: 10,
    style: { position: 'absolute', inset: 0 },
    scrollWheelZoom: isInteractive,
    doubleClickZoom: isInteractive,
    dragging: isInteractive,
  };

  return (
    <>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
        gap: '16px' 
      }}>
        {/* Controls Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%',
          maxWidth: '1200px',
          background: '#0f172a',
          padding: '12px 20px',
          borderRadius: '8px',
          border: '1px solid #334155',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setMenuOpen(true)}
              style={buttonStyle}
            >
              Controls
            </button>
            <button 
              onClick={() => setTribePage(!tribePage)}
              style={{ ...buttonStyle, background: tribePage ? '#3b82f6' : undefined }}
            >
              {tribePage ? 'On' : 'Off'} Tribe Page
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['forest', 'satellite', 'terrain'].map(style => (
              <button
                key={style}
                onClick={() => setMapStyle(style as any)}
                style={{
                  ...buttonStyle,
                  background: mapStyle === style ? '#3b82f6' : undefined,
                  textTransform: 'capitalize'
                }}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="vdh-map-wrap" style={{ 
          position: 'relative', 
          width: '100%',
          maxWidth: '1200px',
          height: typeof height === 'number' ? `${height}px` : height, 
          overflow: 'hidden',
          margin: '0 auto',
          borderRadius: '8px',
          border: '1px solid #334155',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          zIndex: 1
        }}>
      {/* Keep Leaflet controls inside the map box and away from the details panel */}
      <style>{`
        .vdh-map-wrap .leaflet-control-container { position: absolute; z-index: 1000; pointer-events: auto; }
        .vdh-map-wrap .leaflet-control-container .leaflet-top.leaflet-left {
          margin-top: 12px;
          margin-left: 12px;
        }
        .vdh-map-wrap .leaflet-control-container .leaflet-bottom.leaflet-right { margin-right: 12px; margin-bottom: 12px; }
        .vdh-map-wrap .leaflet-control-container .leaflet-bottom.leaflet-left {
          margin-left: 12px;
          margin-bottom: 12px;
        }
      `}</style>
      <MapContainer 
        {...mapProps}
        style={{ ...mapProps.style, position: 'relative', zIndex: 1 }}
      >
        <TileLayer url={tileUrl} />
        {(() => {
          // Base styles per health
          const getBaseStyle = (feature: any): PathOptions => {
            const health = (feature?.properties?.health || '').toLowerCase();
            const fill = health === 'healthy' ? '#16a34a' : health === 'moderate' ? '#eab308' : '#ef4444';
            const stroke = health === 'healthy' ? '#14532d' : health === 'moderate' ? '#854d0e' : '#7f1d1d';
            return {
              color: stroke,
              weight: 1.5,
              fillColor: fill,
              fillOpacity: 0.55,
            } as PathOptions;
          };

          const hoverStyle: PathOptions = {
            color: '#ffffff',
            weight: 2.5,
            fillOpacity: 0.75,
          };

          const selectedStyle: PathOptions = {
            color: '#0ea5e9',
            weight: 3,
            fillOpacity: 0.8,
          };

          const geojsonProps: any = {
            data: { type: 'FeatureCollection', features: clippedFeatures as any },
            style: (feature: any): PathOptions => getBaseStyle(feature),
            onEachFeature: (feature: any, layer: any) => {
              // Hover effects
              layer.on('mouseover', () => {
                layer.setStyle(hoverStyle);
                if (layer.bringToFront) layer.bringToFront();
                try { (layer as any)._path && ((layer as any)._path.style.cursor = 'pointer'); } catch {}
              });
              layer.on('mouseout', () => {
                // Reset to base style when mouse leaves (unless it's the selected one)
                if (selectedLayerRef.current !== layer) {
                  layer.setStyle(getBaseStyle(feature));
                }
              });
              layer.on('click', () => {
                if (feature?.properties) {
                  // Reset previous selection style
                  if (selectedLayerRef.current && selectedLayerRef.current.setStyle) {
                    const prev = selectedLayerRef.current;
                    try { prev.setStyle(getBaseStyle(prev.feature)); } catch {}
                  }
                  // Mark current as selected
                  selectedLayerRef.current = layer;
                  layer.setStyle(selectedStyle);
                  setSelectedInfo(feature.properties);
                  setSelectedFeature(feature);
                  setIsDetailOpen(true);
                  setDetailsOpen(true);
                }
              });
            },
          };
          return <GeoJSON {...geojsonProps} />;
        })()}
      </MapContainer>
      {/* Controls Sheet via shadcn/ui */}
        {/* Filter Controls Panel */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Open map controls"
              aria-controls="map-controls-panel"
              aria-expanded={menuOpen}
              onMouseDown={(e) => { e.stopPropagation(); }}
              onPointerDown={(e) => { e.stopPropagation(); }}
              onTouchStart={(e) => { e.stopPropagation(); }}
              draggable={false}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 1100,
                width: 40,
                height: 36,
                borderRadius: 6,
                background: 'rgba(0,0,0,0.7)',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#e2e8f0',
                touchAction: 'none'
              }}
            >
              <span aria-hidden="true" style={{ display: 'inline-block', width: 18 }}>
                <span style={{ display: 'block', height: 2, background: '#e2e8f0', marginBottom: 4 }} />
                <span style={{ display: 'block', height: 2, background: '#e2e8f0', marginBottom: 4 }} />
                <span style={{ display: 'block', height: 2, background: '#e2e8f0' }} />
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[380px] bg-slate-900 text-slate-100 p-0 overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 z-10 p-4 border-b border-slate-800">
              <SheetHeader>
                <SheetTitle className="text-slate-100 text-xl">Map Controls</SheetTitle>
              </SheetHeader>
              
              {/* Map Style Toggle */}
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-300">Map Style</span>
                  <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                    {['forest', 'satellite', 'terrain'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setMapStyle(style as any)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          mapStyle === style 
                            ? 'bg-blue-600 text-white' 
                            : 'text-slate-300 hover:bg-slate-700'
                        }`}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Tribe Filter Section */}
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-slate-200">Tribe Filter</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedTribes([])}
                      className="text-xs px-2 py-1 rounded border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={toggleAllTribes}
                      className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      {selectedTribes.length === tribes.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </div>
                
                {/* Tribe Search */}
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search tribes..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => {
                      // Implement search functionality if needed
                    }}
                  />
                  <svg
                    className="absolute right-3 top-2.5 h-4 w-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                
                {/* Tribe List */}
                <div className="max-h-48 overflow-y-auto pr-2 -mr-2">
                  <div className="space-y-2">
                    {tribes.map(tribe => {
                      const count = filteredFeatures.filter(f => {
                        const p = f.properties || {};
                        const t = (p.tribe ?? p.dominant_tribe ?? '').toString();
                        return t.toLowerCase() === tribe.toLowerCase();
                      }).length;
                      
                      return (
                        <div key={tribe} className="flex items-center justify-between group">
                          <div className="flex items-center flex-1 min-w-0">
                            <input
                              type="checkbox"
                              id={`tribe-${tribe}`}
                              checked={selectedTribes.includes(tribe)}
                              onChange={() => toggleTribe(tribe)}
                              className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 flex-shrink-0"
                            />
                            <label 
                              htmlFor={`tribe-${tribe}`} 
                              className="ml-2 text-sm text-slate-200 truncate"
                              title={tribe}
                            >
                              {tribe}
                            </label>
                          </div>
                          {count > 0 && (
                            <span className="ml-2 text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                              {count}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Health Filter Section */}
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-slate-200">Health Status</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedHealths([])}
                      className="text-xs px-2 py-1 rounded border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={toggleAllHealths}
                      className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      {selectedHealths.length === healthOptions.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {healthOptions.map(option => {
                    const count = filteredHealthCounts[option.value] || 0;
                    const isActive = selectedHealths.includes(option.value);
                    const colorMap: Record<string, string> = {
                      healthy: 'bg-green-500',
                      moderate: 'bg-yellow-500',
                      degraded: 'bg-red-500'
                    };
                    
                    return (
                      <div 
                        key={option.value}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                          isActive ? 'bg-slate-700/50' : 'hover:bg-slate-700/30'
                        }`}
                        onClick={() => toggleHealth(option.value)}
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${colorMap[option.value] || 'bg-slate-500'} mr-2`}></div>
                          <span className="text-sm text-slate-200">{option.label}</span>
                        </div>
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="font-medium text-slate-200 mb-3">Summary</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {filteredFeatures.length}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Regions</div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {healthCounts.healthy || 0}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Healthy</div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">
                      {healthCounts.moderate || 0}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Moderate</div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-red-400">
                      {healthCounts.degraded || 0}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Degraded</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-700">
                    <span className="text-slate-400">Total Forest Cover</span>
                    <span className="font-medium text-slate-200">
                      {aggregateTotals.forest.toLocaleString()} km²
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700">
                    <span className="text-slate-400">Total Tree Cover</span>
                    <span className="font-medium text-slate-200">
                      {aggregateTotals.tree.toLocaleString()} km²
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Combined Cover</span>
                    <span className="font-medium text-slate-200">
                      {aggregateTotals.total.toLocaleString()} km²
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Selected Tribes */}
              {selectedTribes.length > 0 && (
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-slate-300">Selected Tribes</h4>
                    <span className="text-xs text-slate-400">{selectedTribes.length} selected</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTribes.map(tribe => (
                      <span 
                        key={tribe}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-100 border border-blue-800"
                      >
                        {tribe}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTribe(tribe);
                          }}
                          className="ml-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-blue-800/50"
                        >
                          <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                            <path fillRule="evenodd" d="M4 3.293l2.146-2.147a.5.5 0 01.708.708L4.707 4l2.147 2.146a.5.5 0 01-.708.708L4 4.707l-2.146 2.147a.5.5 0 01-.708-.708L3.293 4 1.146 1.854a.5.5 0 01.708-.708L4 3.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-3 text-center">
              <div className="text-xs text-slate-400">
                Showing {filteredFeatures.length} of {(TRIBAL_REGIONS.features as any[]).length} regions
              </div>
              <button 
                onClick={() => setMenuOpen(false)}
                className="mt-2 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </SheetContent>
        </Sheet>
        </div>

        {/* Details section below the map */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '20px auto 0',
          position: 'relative',
          zIndex: 0 // Lower than map
        }}>
      <div style={{
        border: '1px solid #334155',
        background: 'rgba(11, 18, 32, 0.95)',
        borderRadius: 8,
        padding: 20,
        color: '#e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        pointerEvents: 'auto',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Tribal Details</div>
          {selectedInfo && (
            <button 
              onClick={() => { setDetailsOpen(false); setSelectedInfo(null); }}
              style={{ 
                background: 'transparent', 
                color: '#cbd5e1', 
                border: '1px solid #334155', 
                borderRadius: 6, 
                padding: '4px 8px', 
                cursor: 'pointer',
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 1001
              }}
            >
              Clear
            </button>
          )}
        </div>
        {selectedInfo ? (
          <div style={{ fontSize: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
              {selectedInfo.name ?? `${selectedInfo.district ?? 'District'}, ${selectedInfo.state ?? ''}`}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 6 }}>
              <span style={{ color: '#94a3b8' }}>State</span>
              <span>{selectedInfo.state ?? '—'}</span>
              <span style={{ color: '#94a3b8' }}>District</span>
              <span>{selectedInfo.district ?? '—'}</span>
              <span style={{ color: '#94a3b8' }}>Dominant Tribe</span>
              <span>{selectedInfo.tribe ?? selectedInfo.dominant_tribe ?? '—'}</span>
              <span style={{ color: '#94a3b8' }}>Forest Cover</span>
              <span>{(selectedInfo.forest_cover ?? selectedInfo.ForestCover_km2 ?? 'N/A').toString()} km²</span>
              <span style={{ color: '#94a3b8' }}>Tree Cover</span>
              <span>{(selectedInfo.tree_cover ?? selectedInfo.TreeCover_km2 ?? 'N/A').toString()} km²</span>
              <span style={{ color: '#94a3b8' }}>Health</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  display: 'inline-block', width: 10, height: 10, borderRadius: 3,
                  background: (() => { const h = (selectedInfo.health ?? selectedInfo.Health?.overall_status ?? 'unknown').toString().toLowerCase(); return h==='healthy'?'#22c55e':h==='moderate'?'#facc15':'#ef4444'; })()
                }} />
                {(selectedInfo.health ?? selectedInfo.Health?.overall_status ?? 'Unknown').toString()}
              </span>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: '#cbd5e1' }}>Click a district/region on the map to view details here.</div>
        )}
      </div>
        </div>
      </div>

      {/* Tribal Region Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-slate-100">
          {selectedFeature?.properties && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-100">
                  {selectedFeature.properties.district || 'Tribal Region'}
                </DialogTitle>
                <div className="text-sm text-slate-400">
                  {selectedFeature.properties.state || ''}
                </div>
              </DialogHeader>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">Region Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1.5 border-b border-slate-700">
                        <span className="text-slate-400">Dominant Tribe</span>
                        <span className="font-medium text-slate-200">
                          {selectedFeature.properties.dominant_tribe || 'N/A'}
                        </span>
                      </div>
                      {selectedFeature.properties.other_tribes?.length > 0 && (
                        <div className="flex justify-between py-1.5 border-b border-slate-700">
                          <span className="text-slate-400">Other Tribes</span>
                          <span className="font-medium text-slate-200 text-right">
                            {selectedFeature.properties.other_tribes.join(', ')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-1.5 border-b border-slate-700">
                        <span className="text-slate-400">Total Population</span>
                        <span className="font-medium text-slate-200">
                          {selectedFeature.properties.population_total_2011?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-700">
                        <span className="text-slate-400">ST Population</span>
                        <span className="font-medium text-slate-200">
                          {selectedFeature.properties.population_st_2011?.toLocaleString() || 'N/A'}
                          {selectedFeature.properties.percentage_st_2011 && (
                            <span className="text-slate-400 ml-1">
                              ({selectedFeature.properties.percentage_st_2011}%)
                            </span>
                          )}
                        </span>
                      </div>
                      {selectedFeature.properties.pvgt_present?.length > 0 && (
                        <div className="flex justify-between py-1.5">
                          <span className="text-slate-400">PVTG Communities</span>
                          <span className="font-medium text-slate-200">
                            {selectedFeature.properties.pvgt_present.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Forest Cover */}
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">Forest Cover</h3>
                    <div className="space-y-3">
                      <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-400">Forest Cover</span>
                              <span className="font-medium text-slate-200">
                                {selectedFeature.properties.ForestCover_km2?.toLocaleString() || 'N/A'} km²
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(100, (selectedFeature.properties.ForestCover_km2 || 0) / 1000)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-400">Tree Cover</span>
                              <span className="font-medium text-slate-200">
                                {selectedFeature.properties.TreeCover_km2?.toLocaleString() || 'N/A'} km²
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-green-400 h-2 rounded-full" 
                                style={{ width: `${Math.min(100, (selectedFeature.properties.TreeCover_km2 || 0) / 500)}%` }}
                              ></div>
                            </div>
                          </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Health Status */}
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">Health Status</h3>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-4 h-4 rounded-full ${
                        selectedFeature.properties.Health?.overall_status === 'healthy' ? 'bg-green-500' :
                        selectedFeature.properties.Health?.overall_status === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-lg font-medium capitalize">
                        {selectedFeature.properties.Health?.overall_status || 'Unknown'}
                      </span>
                    </div>
                    
                    {selectedFeature.properties.Health?.key_issues?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-300">Key Issues</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
                          {selectedFeature.properties.Health.key_issues.map((issue: string, i: number) => (
                            <li key={i} className="ml-2">{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedFeature.properties.Health?.infant_mortality_rate_estimate && (
                      <div className="mt-3 text-sm">
                        <span className="text-slate-400">Infant Mortality: </span>
                        <span className="font-medium text-slate-200">
                          {selectedFeature.properties.Health.infant_mortality_rate_estimate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">Additional Information</h3>
                    
                    {selectedFeature.properties.key_forest_type && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-slate-300 mb-1">Forest Type</h4>
                        <p className="text-sm text-slate-300">{selectedFeature.properties.key_forest_type}</p>
                      </div>
                    )}
                    
                    {selectedFeature.properties.major_rivers_and_waterbodies?.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-slate-300 mb-1">Major Water Bodies</h4>
                        <p className="text-sm text-slate-300">
                          {selectedFeature.properties.major_rivers_and_waterbodies.join(', ')}
                        </p>
                      </div>
                    )}
                    
                    {selectedFeature.properties.implementation_challenge && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-300 mb-1">Implementation Challenges</h4>
                        <p className="text-sm text-slate-300">{selectedFeature.properties.implementation_challenge}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Forest3DMap;
