import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import EnhancedStatsCards from './EnhancedStatsCards';
import ForestMapContainer from './ForestMapContainer';
import RightSidebar from './RightSidebar';
import DetailedAnalytics from './DetailedAnalytics';
import VillageDetailsPanel from './VillageDetailsPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const [selectedVillage, setSelectedVillage] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader />
      
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
            
            {/* Quick Map Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ForestMapContainer onVillageSelect={setSelectedVillage} />
              </div>
              <div>
                <RightSidebar selectedVillage={selectedVillage} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <DetailedAnalytics />
          </TabsContent>

          <TabsContent value="mapping" className="space-y-6">
            <div className="flex">
              <div className="flex-1">
                <ForestMapContainer onVillageSelect={setSelectedVillage} />
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