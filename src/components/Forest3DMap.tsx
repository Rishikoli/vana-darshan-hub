import React, { useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { PathOptions } from 'leaflet';
import type { Feature, Polygon, FeatureCollection } from 'geojson';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
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

const Forest3DMap: React.FC<Forest3DMapProps> = ({ height = 600, interactive = false }) => {
  const [baseStyle, setBaseStyle] = useState<'forest' | 'satellite' | 'terrain'>('forest');
  const [selectedTribes, setSelectedTribes] = useState<string[]>([]);
  const [selectedHealths, setSelectedHealths] = useState<string[]>([]);
  const [isInteractive] = useState<boolean>(interactive);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [selectedInfo, setSelectedInfo] = useState<any | null>(null);
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
  const healthCounts = (() => {
    const counts = { healthy: 0, moderate: 0, degraded: 0 } as Record<string, number>;
    for (const f of filteredFeatures as any[]) {
      const p: any = f.properties || {};
      const h = (p.health ?? p.Health?.overall_status ?? '').toString().toLowerCase();
      if (counts[h] !== undefined) counts[h]++;
    }
    return counts;
  })();

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
  const tileUrl = baseStyle === 'forest'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : baseStyle === 'satellite'
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
    <div style={{ position: 'relative', width: '100%', height: typeof height === 'number' ? `${height}px` : height, overflow: 'auto' }}>
      <MapContainer {...mapProps}>
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
                  setDetailsOpen(true);
                }
              });
            },
          };
          return <GeoJSON {...geojsonProps} />;
        })()}
      </MapContainer>
      {/* Inline Details Panel (scoped to map container) */}
      {detailsOpen && (
        <div
          role="dialog"
          aria-label="Tribal Details"
          aria-modal="false"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: 360,
            maxWidth: '85vw',
            background: 'rgba(17,24,39,0.98)',
            color: '#e5e7eb',
            borderLeft: '1px solid #334155',
            zIndex: 60,
            padding: 16,
            overflowY: 'auto',
            boxShadow: '-4px 0 12px rgba(0,0,0,0.4)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Tribal Details</div>
            <button
              onClick={() => { setDetailsOpen(false); setSelectedInfo(null); }}
              style={{ background: 'transparent', color: '#cbd5e1', border: '1px solid #334155', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}
            >
              Close
            </button>
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
            <div style={{ fontSize: 12, color: '#cbd5e1' }}>Tap a tribal region to view population and forest details.</div>
          )}
        </div>
      )}
      {/* Controls Sheet via shadcn/ui */}
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
                left: 12,
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
          <SheetContent side="left" className="w-[320px]">
            <SheetHeader>
              <SheetTitle>Controls</SheetTitle>
            </SheetHeader>
            {/* Navigate to Tribe page toggle */}
            <div style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', padding: 8, borderRadius: 6, marginBottom: 8 }}>
              <div id="tribe-toggle-label" style={{ fontWeight: 700, marginBottom: 6 }}>Tribe Page</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#cbd5e1' }}>Go to Tribe</span>
                <Switch
                  checked={isOnTribePage}
                  onCheckedChange={(val) => {
                    if (val && !isOnTribePage) navigate('/tribe');
                    if (!val && isOnTribePage) navigate('/');
                  }}
                  aria-labelledby="tribe-toggle-label"
                />
                <span style={{ fontSize: 12, color: '#cbd5e1', minWidth: 28 }}>{isOnTribePage ? 'On' : 'Off'}</span>
              </div>
            </div>
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
                    <div key={t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 12 }}>{t}</span>
                      <Switch
                        checked={checked}
                        onCheckedChange={(val) => {
                          if (val) setSelectedTribes((prev) => Array.from(new Set([...prev, t])));
                          else setSelectedTribes((prev) => prev.filter((x) => x !== t));
                        }}
                        aria-label={`Toggle ${t}`}
                      />
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: '#cbd5e1' }}>
                <div>Regions: {filteredFeatures.length}</div>
                <div>Forest Cover: {aggregateTotals.forest.toLocaleString()} km²</div>
                <div>Tree Cover: {aggregateTotals.tree.toLocaleString()} km²</div>
              </div>
            </div>
            {/* Health Filter */}
            <div style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', padding: 8, borderRadius: 6, marginBottom: 8 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Health Filter</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                {[
                  { label: 'Healthy', value: 'healthy', color: '#22c55e' },
                  { label: 'Moderate', value: 'moderate', color: '#facc15' },
                  { label: 'Degraded', value: 'degraded', color: '#ef4444' },
                ].map(({ label, value, color }) => {
                  const active = selectedHealths.includes(value);
                  return (
                    <button
                      key={value}
                      onClick={() => {
                        setSelectedHealths((prev) =>
                          active ? prev.filter((x) => x !== value) : Array.from(new Set([...prev, value]))
                        );
                      }}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 16,
                        border: `1px solid ${active ? color : '#334155'}`,
                        background: active ? color : '#0f172a',
                        color: active ? '#000' : '#fff',
                        fontSize: 12
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <button
                  onClick={() => setSelectedHealths([])}
                  style={{ padding: '4px 8px', borderRadius: 4, background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                >
                  Clear
                </button>
                <button
                  onClick={() => setSelectedHealths(['healthy','moderate','degraded'])}
                  style={{ padding: '4px 8px', borderRadius: 4, background: '#10b981', color: '#000', border: '1px solid #10b981' }}
                >
                  Select All
                </button>
              </div>
              <div style={{ fontSize: 12, color: '#cbd5e1' }}>
                <div>Active: {selectedHealths.length ? selectedHealths.join(', ') : 'All'}</div>
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
              {/* Compact summary to ensure visibility */}
              <div style={{ height: 1, background: '#334155', margin: '8px 0' }} />
              <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 12 }}>Selected Tribes</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {selectedTribes.length === 0 ? (
                  <span style={{ fontSize: 12, color: '#cbd5e1' }}>All</span>
                ) : (
                  selectedTribes.slice(0, 4).map((t) => (
                    <span key={t} style={{ fontSize: 11, padding: '2px 6px', borderRadius: 12, background: '#0f172a', border: '1px solid #334155' }}>{t}</span>
                  ))
                )}
                {selectedTribes.length > 4 && (
                  <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 12, background: '#0f172a', border: '1px solid #334155' }}>+{selectedTribes.length - 4} more</span>
                )}
              </div>
              <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 12 }}>Aggregated Totals</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: 6, fontSize: 12, color: '#cbd5e1' }}>
                <span>Regions:</span>
                <span>{filteredFeatures.length}</span>
                <span>Forest Cover:</span>
                <span>{aggregateTotals.forest.toLocaleString()} km²</span>
                <span>Tree Cover:</span>
                <span>{aggregateTotals.tree.toLocaleString()} km²</span>
              </div>
            </div>
          </SheetContent>
        </Sheet>
    </div>
  );
};

export default Forest3DMap;
