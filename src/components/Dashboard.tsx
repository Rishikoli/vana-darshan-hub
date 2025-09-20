import React from 'react';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import ForestMapContainer from './ForestMapContainer';
import RightSidebar from './RightSidebar';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader />
      
      {/* Main Content */}
      <div className="flex">
        {/* Main Map Area */}
        <div className="flex-1 p-6">
          {/* Statistics Cards */}
          <StatsCards />
          
          {/* Map Container */}
          <ForestMapContainer />
        </div>
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;