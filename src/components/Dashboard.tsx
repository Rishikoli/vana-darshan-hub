import React, { useState } from 'react';
import EnhancedStatsCards from './EnhancedStatsCards';
import Forest3DMap from './Forest3DMap';
import RightSidebar from './RightSidebar';
import DetailedAnalytics from './DetailedAnalytics';
import VillageDetailsPanel from './VillageDetailsPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const [selectedVillage, setSelectedVillage] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
            <TabsTrigger value="analytics">Detailed Analytics</TabsTrigger>
            <TabsTrigger value="mapping">Interactive Mapping</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Statistics Cards */}
            <EnhancedStatsCards />

            {/* Actions & Alerts in flex layout */}
            <div className="bg-card p-4 rounded-lg shadow">
              <RightSidebar selectedVillage={selectedVillage} variant="flex" />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <DetailedAnalytics />
          </TabsContent>

          <TabsContent value="mapping" className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">3D Forest Coverage Visualization</h2>
              <p className="text-muted-foreground mb-4">
                Explore the forest coverage across India in 3D. Pan, zoom, and rotate to analyze forest density and distribution.
              </p>
              <div className="h-[600px] w-full rounded-md overflow-hidden border">
                <Forest3DMap interactive={true} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Forest Coverage Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Forest Cover</span>
                    <span className="font-medium">713,789 km²</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tree Cover</span>
                    <span className="font-medium">95,382 km²</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Green Cover</span>
                    <span className="font-medium">809,171 km²</span>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Map Controls</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <span className="font-medium">Left-click + drag</span> to rotate the view</li>
                  <li>• <span className="font-medium">Right-click + drag</span> to pan</li>
                  <li>• <span className="font-medium">Scroll</span> to zoom in/out</li>
                  <li>• <span className="font-medium">Ctrl + drag</span> to tilt the view</li>
                </ul>
              </div>
              <div className="w-80">
                <RightSidebar selectedVillage={selectedVillage} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Village Details Modal */}
      {selectedVillage && (
        <VillageDetailsPanel 
          village={selectedVillage} 
          onClose={() => setSelectedVillage(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;