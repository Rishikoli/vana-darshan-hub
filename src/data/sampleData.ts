// Sample Forest Rights Act data for Indian tribal villages
export const villageData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        village_name: "Bastar Gram",
        state: "Chhattisgarh",
        district: "Bastar",
        forest_cover_percentage: 85.2,
        population: 1245,
        claims_count: 23,
        alert_level: "healthy",
        beneficiaries: 456,
        processing_stage: "approved",
        coordinates: [81.2497, 19.0728]
      },
      geometry: {
        type: "Point",
        coordinates: [81.2497, 19.0728]
      }
    },
    {
      type: "Feature",
      properties: {
        village_name: "Kondagaon",
        state: "Chhattisgarh", 
        district: "Kondagaon",
        forest_cover_percentage: 72.5,
        population: 2134,
        claims_count: 45,
        alert_level: "moderate",
        beneficiaries: 789,
        processing_stage: "pending",
        coordinates: [81.3397, 19.5928]
      },
      geometry: {
        type: "Point",
        coordinates: [81.3397, 19.5928]
      }
    },
    {
      type: "Feature",
      properties: {
        village_name: "Mayurbhanj Tribal",
        state: "Odisha",
        district: "Mayurbhanj",
        forest_cover_percentage: 45.8,
        population: 3456,
        claims_count: 67,
        alert_level: "degraded",
        beneficiaries: 1234,
        processing_stage: "rejected",
        coordinates: [86.7349, 22.1000]
      },
      geometry: {
        type: "Point",
        coordinates: [86.7349, 22.1000]
      }
    },
    {
      type: "Feature",
      properties: {
        village_name: "Gadchiroli Forest",
        state: "Maharashtra",
        district: "Gadchiroli",
        forest_cover_percentage: 78.9,
        population: 1876,
        claims_count: 34,
        alert_level: "healthy",
        beneficiaries: 567,
        processing_stage: "approved",
        coordinates: [80.0022, 20.1809]
      },
      geometry: {
        type: "Point",
        coordinates: [80.0022, 20.1809]
      }
    },
    {
      type: "Feature",
      properties: {
        village_name: "Ranchi Hills",
        state: "Jharkhand",
        district: "Ranchi",
        forest_cover_percentage: 63.4,
        population: 2987,
        claims_count: 52,
        alert_level: "moderate",
        beneficiaries: 891,
        processing_stage: "under_review",
        coordinates: [85.3096, 23.3441]
      },
      geometry: {
        type: "Point",
        coordinates: [85.3096, 23.3441]
      }
    }
  ]
};

export const dashboardStats = {
  totalClaims: 45678,
  claimsGrowth: 12.5,
  forestCover: 68.4,
  activeAlerts: 23,
  beneficiaries: 124567
};

export const recentActivities = [
  {
    id: 1,
    activity: "Document uploaded for Bastar Gram",
    timestamp: "2 hours ago",
    type: "upload"
  },
  {
    id: 2,
    activity: "FRA claim approved for Gadchiroli Forest",
    timestamp: "4 hours ago", 
    type: "approval"
  },
  {
    id: 3,
    activity: "Environmental alert for Mayurbhanj Tribal",
    timestamp: "6 hours ago",
    type: "alert"
  },
  {
    id: 4,
    activity: "New village registered: Kondagaon",
    timestamp: "1 day ago",
    type: "registration"
  }
];

export const environmentalAlerts = [
  {
    id: 1,
    village: "Mayurbhanj Tribal",
    alert: "Forest cover decreased by 8% in last 6 months",
    severity: "high",
    timestamp: "6 hours ago"
  },
  {
    id: 2,
    village: "Ranchi Hills", 
    alert: "Illegal mining activity detected",
    severity: "medium",
    timestamp: "12 hours ago"
  },
  {
    id: 3,
    village: "Kondagaon",
    alert: "Unusual deforestation pattern observed",
    severity: "medium", 
    timestamp: "1 day ago"
  }
];