import { Upload, FileText, BarChart3, Clock, AlertCircle, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { recentActivities, environmentalAlerts } from "@/data/sampleData";

interface RightSidebarProps {
  selectedVillage?: any;
  variant?: 'sidebar' | 'flex';
}

const RightSidebar: React.FC<RightSidebarProps> = ({ selectedVillage, variant = 'sidebar' }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4" />;
      case 'approval': return <FileText className="w-4 h-4" />;
      case 'alert': return <AlertCircle className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const isFlex = variant === 'flex';

  return (
    <div
      className={
        isFlex
          ? "w-full p-6 bg-background flex flex-wrap gap-6"
          : "w-80 space-y-6 p-6 bg-background border-l"
      }
    >
      {/* Quick Actions */}
      <Card className={isFlex ? "shadow-government flex-1 min-w-[260px]" : "shadow-government"}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <MapPin className="w-4 h-4 mr-2" />
            Add Village
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className={isFlex ? "shadow-government flex-1 min-w-[260px]" : "shadow-government"}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1 text-muted-foreground">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.activity}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Alerts */}
      <Card className={isFlex ? "shadow-government flex-1 min-w-[260px]" : "shadow-government"}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-destructive" />
            Environmental Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {environmentalAlerts.map((alert) => (
              <div key={alert.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{alert.village}</p>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{alert.alert}</p>
                <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Village Info */}
      <Card className={isFlex ? "shadow-government flex-1 min-w-[260px]" : "shadow-government"}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            Village Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedVillage ? (
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">{selectedVillage.village_name}</h3>
                <p className="text-sm text-muted-foreground">{selectedVillage.district}, {selectedVillage.state}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Population</p>
                  <p className="font-semibold">{selectedVillage.population?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Forest Cover</p>
                  <p className="font-semibold">{selectedVillage.forest_cover_percentage}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Claims</p>
                  <p className="font-semibold">{selectedVillage.claims_count}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant="outline" className="text-xs">
                    {selectedVillage.processing_stage?.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Full Details
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Click on a village marker to view details
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;