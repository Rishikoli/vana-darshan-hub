import React from 'react';
import { TrendingUp, TreePine, AlertTriangle, Users, FileCheck, Clock, Building, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { dashboardStats } from "@/data/sampleData";

const EnhancedStatsCards = () => {
  const enhancedStats = [
    {
      title: "Total FRA Claims",
      value: dashboardStats.totalClaims.toLocaleString(),
      change: `+${dashboardStats.claimsGrowth}%`,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      subtitle: "This Month",
      progress: 78,
      details: [
        { label: "Approved", value: "34,567", color: "text-success" },
        { label: "Pending", value: "8,943", color: "text-warning" },
        { label: "Under Review", value: "2,168", color: "text-accent" }
      ]
    },
    {
      title: "Forest Coverage",
      value: `${dashboardStats.forestCover}%`,
      change: "-1.2% vs last year",
      icon: TreePine,
      color: "text-warning",
      bgColor: "bg-warning/10",
      subtitle: "National Average",
      progress: dashboardStats.forestCover,
      details: [
        { label: "Healthy", value: "67%", color: "text-success" },
        { label: "Moderate", value: "23%", color: "text-warning" },
        { label: "Degraded", value: "10%", color: "text-destructive" }
      ]
    },
    {
      title: "Active Alerts",
      value: dashboardStats.activeAlerts.toString(),
      change: "Requires Action",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      subtitle: "Critical Issues",
      progress: (dashboardStats.activeAlerts / 50) * 100,
      details: [
        { label: "High Priority", value: "8", color: "text-destructive" },
        { label: "Medium", value: "12", color: "text-warning" },
        { label: "Low", value: "3", color: "text-muted-foreground" }
      ]
    },
    {
      title: "Beneficiaries",
      value: dashboardStats.beneficiaries.toLocaleString(),
      change: "Enrolled Successfully",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      subtitle: "Total Registered",
      progress: 85,
      details: [
        { label: "Individual", value: "87,234", color: "text-primary" },
        { label: "Community", value: "37,333", color: "text-accent" },
        { label: "Active", value: "98,567", color: "text-success" }
      ]
    }
  ];

  const additionalMetrics = [
    {
      title: "Processing Efficiency",
      value: "78.3%",
      icon: FileCheck,
      color: "text-success",
      change: "+12% improvement",
      description: "Claims processed within 60 days"
    },
    {
      title: "Average Processing Time",
      value: "45 days",
      icon: Clock,
      color: "text-accent",
      change: "-8 days faster",
      description: "From application to approval"
    },
    {
      title: "Active Districts",
      value: "147",
      icon: Building,
      color: "text-primary",
      change: "Across 12 states",
      description: "Districts implementing FRA"
    },
    {
      title: "Economic Impact",
      value: "₹2.3Cr",
      icon: Coins,
      color: "text-warning",
      change: "Monthly benefits",
      description: "Direct economic benefit to tribes"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {enhancedStats.map((stat, index) => (
          <Card key={index} className="shadow-government hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Badge variant="outline" className={stat.color}>
                  {stat.change}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
                
                <div className="space-y-2">
                  <Progress value={stat.progress} className="h-2" />
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {stat.details.map((detail, idx) => (
                      <div key={idx} className="text-center">
                        <p className={`font-semibold ${detail.color}`}>{detail.value}</p>
                        <p className="text-muted-foreground">{detail.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {additionalMetrics.map((metric, index) => (
          <Card key={index} className="shadow-government">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{metric.value}</p>
                  <p className={`text-xs font-medium ${metric.color}`}>{metric.change}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Summary */}
      <Card className="shadow-government">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-success">This Month Achievements</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Claims Processed</span>
                  <span className="font-semibold">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span>New Registrations</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span>Areas Approved</span>
                  <span className="font-semibold">3,456 hectares</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-warning">Areas of Focus</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pending Surveys</span>
                  <span className="font-semibold">456</span>
                </div>
                <div className="flex justify-between">
                  <span>Document Pending</span>
                  <span className="font-semibold">234</span>
                </div>
                <div className="flex justify-between">
                  <span>Committee Reviews</span>
                  <span className="font-semibold">123</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Key Targets</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Monthly Target</span>
                    <span>89% achieved</span>
                  </div>
                  <Progress value={89} className="h-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quality Score</span>
                    <span>92% achieved</span>
                  </div>
                  <Progress value={92} className="h-1" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedStatsCards;