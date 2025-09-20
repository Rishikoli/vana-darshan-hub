import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, Users, TreePine, FileText, AlertTriangle, 
  Calendar, Phone, Building, Coins, TrendingDown, TrendingUp 
} from "lucide-react";

interface VillageDetailsPanelProps {
  village: any;
  onClose: () => void;
}

const VillageDetailsPanel: React.FC<VillageDetailsPanelProps> = ({ village, onClose }) => {
  if (!village) return null;

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'healthy': return 'bg-success text-success-foreground';
      case 'moderate': return 'bg-warning text-warning-foreground';
      case 'degraded': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'under_review': return 'bg-accent text-accent-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Mock detailed data
  const detailedInfo = {
    demographics: {
      totalHouseholds: Math.floor(village.population / 4.2),
      tribalPopulation: Math.floor(village.population * 0.78),
      averageAge: 34,
      literacyRate: 67.3,
      workersCount: Math.floor(village.population * 0.42)
    },
    forestRights: {
      individualClaims: Math.floor(village.claims_count * 0.7),
      communityClaims: Math.floor(village.claims_count * 0.3),
      totalArea: 1247.5,
      approvedArea: 892.3,
      pendingArea: 355.2
    },
    economicData: {
      averageIncome: 45600,
      forestProduce: 234000,
      employmentRate: 73.2,
      schemes: ['MGNREGA', 'PM-JANMAN', 'Tribal Sub Plan']
    },
    environmentalData: {
      forestCoverTrend: [68.5, 67.8, 68.2, 68.9, 69.1],
      carbonStock: 15672,
      biodiversityIndex: 0.74,
      waterBodies: 12,
      soilHealth: 'Good'
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-primary" />
              {village.village_name}
            </h2>
            <p className="text-muted-foreground">{village.district}, {village.state}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getAlertColor(village.alert_level)}>
              {village.alert_level} Forest Health
            </Badge>
            <Button variant="outline" onClick={onClose}>✕</Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="claims">FRA Claims</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="economic">Economic</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Population</p>
                        <p className="text-xl font-bold">{village.population.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TreePine className="w-8 h-8 text-success" />
                      <div>
                        <p className="text-sm text-muted-foreground">Forest Cover</p>
                        <p className="text-xl font-bold">{village.forest_cover_percentage}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-8 h-8 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">FRA Claims</p>
                        <p className="text-xl font-bold">{village.claims_count}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Processing Status</span>
                    <Badge className={getStatusColor(village.processing_stage)}>
                      {village.processing_stage.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Beneficiaries</span>
                    <span className="font-semibold">{village.beneficiaries.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Forest Health Status</span>
                    <Badge className={getAlertColor(village.alert_level)}>
                      {village.alert_level.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Coordinates</span>
                    <span className="text-sm font-mono">{village.coordinates[1].toFixed(4)}, {village.coordinates[0].toFixed(4)}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Population Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Households</span>
                      <span className="font-semibold">{detailedInfo.demographics.totalHouseholds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tribal Population</span>
                      <span className="font-semibold">{detailedInfo.demographics.tribalPopulation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Age</span>
                      <span className="font-semibold">{detailedInfo.demographics.averageAge} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Working Population</span>
                      <span className="font-semibold">{detailedInfo.demographics.workersCount}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Education & Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Literacy Rate</span>
                        <span className="font-semibold">{detailedInfo.demographics.literacyRate}%</span>
                      </div>
                      <Progress value={detailedInfo.demographics.literacyRate} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="outline">Traditional Crafts</Badge>
                      <Badge variant="outline">Agriculture</Badge>
                      <Badge variant="outline">Forest Produce</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="claims" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Claims Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Individual Claims</span>
                      <Badge variant="outline">{detailedInfo.forestRights.individualClaims}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Community Claims</span>
                      <Badge variant="outline">{detailedInfo.forestRights.communityClaims}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Area Claimed</span>
                      <span className="font-semibold">{detailedInfo.forestRights.totalArea} hectares</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Approved Area</span>
                      <span className="font-semibold text-success">{detailedInfo.forestRights.approvedArea} hectares</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Processing Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                        <span className="text-sm">Application Submitted (Jan 2024)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                        <span className="text-sm">Document Verification (Feb 2024)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-warning"></div>
                        <span className="text-sm">Field Survey (Mar 2024)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-muted"></div>
                        <span className="text-sm">Committee Review (Pending)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="environment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-success" />
                      Forest Cover Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {detailedInfo.environmentalData.forestCoverTrend.map((value, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">202{index} Coverage</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold">{value}%</span>
                            <div className="w-20">
                              <Progress value={value} className="h-1" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Environmental Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Carbon Stock</span>
                      <span className="font-semibold">{detailedInfo.environmentalData.carbonStock} tonnes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biodiversity Index</span>
                      <span className="font-semibold">{detailedInfo.environmentalData.biodiversityIndex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Water Bodies</span>
                      <span className="font-semibold">{detailedInfo.environmentalData.waterBodies}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Soil Health</span>
                      <Badge className="bg-success text-success-foreground">{detailedInfo.environmentalData.soilHealth}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="economic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Coins className="w-4 h-4 mr-2 text-accent" />
                      Economic Indicators
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Average Income</span>
                      <span className="font-semibold">₹{detailedInfo.economicData.averageIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Forest Produce Value</span>
                      <span className="font-semibold">₹{detailedInfo.economicData.forestProduce.toLocaleString()}</span>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Employment Rate</span>
                        <span className="font-semibold">{detailedInfo.economicData.employmentRate}%</span>
                      </div>
                      <Progress value={detailedInfo.economicData.employmentRate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Schemes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {detailedInfo.economicData.schemes.map((scheme, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">{scheme}</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VillageDetailsPanel;