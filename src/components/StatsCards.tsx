import { TrendingUp, TreePine, AlertTriangle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardStats } from "@/data/sampleData";

const StatsCards = () => {
  const stats = [
    {
      title: "Total FRA Claims",
      value: dashboardStats.totalClaims.toLocaleString(),
      change: `+${dashboardStats.claimsGrowth}%`,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Forest Cover",
      value: `${dashboardStats.forestCover}%`,
      change: "Current Coverage",
      icon: TreePine,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Active Alerts",
      value: dashboardStats.activeAlerts.toString(),
      change: "Environmental Alerts",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      title: "Beneficiaries",
      value: dashboardStats.beneficiaries.toLocaleString(),
      change: "Scheme Beneficiaries",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-government">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className={`text-sm ${stat.color} font-medium`}>
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;