import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, FileText, AlertTriangle, TreePine } from "lucide-react";

const DetailedAnalytics = () => {
  const claimsProcessingData = [
    { stage: "Application Received", count: 12456, percentage: 100, color: "bg-muted" },
    { stage: "Document Verification", count: 8943, percentage: 72, color: "bg-accent" },
    { stage: "Field Survey", count: 6234, percentage: 50, color: "bg-warning" },
    { stage: "Committee Review", count: 4567, percentage: 37, color: "bg-primary" },
    { stage: "Final Approval", count: 2891, percentage: 23, color: "bg-success" },
  ];

  const stateWiseData = [
    { state: "Odisha", claims: 8945, approved: 6234, coverage: 78.5, alerts: 12 },
    { state: "Chhattisgarh", claims: 7456, approved: 5123, coverage: 82.1, alerts: 8 },
    { state: "Jharkhand", claims: 6789, approved: 4567, coverage: 65.3, alerts: 15 },
    { state: "Maharashtra", claims: 5432, approved: 3891, coverage: 71.8, alerts: 9 },
    { state: "Andhra Pradesh", claims: 4321, approved: 2987, coverage: 59.4, alerts: 18 },
  ];

  const monthlyTrends = [
    { month: "Jan", claims: 1234, approvals: 987, coverage: 68.2 },
    { month: "Feb", claims: 1456, approvals: 1123, coverage: 68.5 },
    { month: "Mar", claims: 1789, approvals: 1345, coverage: 68.8 },
    { month: "Apr", claims: 1567, approvals: 1234, coverage: 69.1 },
    { month: "May", claims: 1678, approvals: 1456, coverage: 69.3 },
    { month: "Jun", claims: 1890, approvals: 1567, coverage: 69.6 },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="processing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="processing">Claims Processing</TabsTrigger>
          <TabsTrigger value="states">State Analysis</TabsTrigger>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
        </TabsList>

        <TabsContent value="processing" className="space-y-4">
          <Card className="shadow-government">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                FRA Claims Processing Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {claimsProcessingData.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{stage.count.toLocaleString()}</span>
                      <Badge variant="outline">{stage.percentage}%</Badge>
                    </div>
                  </div>
                  <Progress value={stage.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-government">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-8 h-8 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Approval Rate</p>
                    <p className="text-2xl font-bold">78.3%</p>
                    <p className="text-sm text-success">+5.2% this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-government">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                    <p className="text-2xl font-bold">45 days</p>
                    <p className="text-sm text-warning">-8 days improvement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-government">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-8 h-8 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Officers</p>
                    <p className="text-2xl font-bold">147</p>
                    <p className="text-sm text-muted-foreground">Across 12 states</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="states" className="space-y-4">
          <Card className="shadow-government">
            <CardHeader>
              <CardTitle>State-wise Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stateWiseData.map((state, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">{state.state}</h3>
                      <div className="flex space-x-2">
                        <Badge className={state.coverage > 75 ? "bg-success text-success-foreground" : 
                                        state.coverage > 60 ? "bg-warning text-warning-foreground" : 
                                        "bg-destructive text-destructive-foreground"}>
                          {state.coverage}% Forest Cover
                        </Badge>
                        <Badge variant="outline" className={state.alerts > 15 ? "text-destructive" : 
                                                          state.alerts > 10 ? "text-warning" : "text-success"}>
                          {state.alerts} Alerts
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Claims</p>
                        <p className="font-semibold">{state.claims.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Approved</p>
                        <p className="font-semibold">{state.approved.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Success Rate</p>
                        <p className="font-semibold">{((state.approved / state.claims) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    <Progress value={(state.approved / state.claims) * 100} className="mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="shadow-government">
            <CardHeader>
              <CardTitle>Monthly Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyTrends.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 text-center">
                        <p className="font-semibold">{month.month}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Claims: {month.claims}</p>
                        <p className="text-sm text-muted-foreground">Approvals: {month.approvals}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Forest Coverage</p>
                      <p className="text-lg font-semibold text-success">{month.coverage}%</p>
                      <div className="w-32">
                        <Progress value={month.coverage} className="h-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-government">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TreePine className="w-5 h-5 mr-2 text-success" />
                  Forest Health Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Healthy Forest (&gt;75%)</span>
                      <span className="text-sm font-semibold">67%</span>
                    </div>
                    <Progress value={67} className="h-2 bg-muted" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Moderate Risk (50-75%)</span>
                      <span className="text-sm font-semibold">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">High Risk (&lt;50%)</span>
                      <span className="text-sm font-semibold">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-government">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-destructive" />
                  Environmental Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Deforestation Alerts</span>
                    <Badge className="bg-destructive text-destructive-foreground">23 Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mining Activity Detected</span>
                    <Badge className="bg-warning text-warning-foreground">8 Locations</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Biodiversity Hotspots</span>
                    <Badge className="bg-success text-success-foreground">45 Protected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Carbon Sequestration</span>
                    <Badge variant="outline">2.3M tonnes/year</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedAnalytics;