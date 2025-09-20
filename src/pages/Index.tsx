import Dashboard from "@/components/Dashboard";
import DashboardHeader from "@/components/DashboardHeader";

const Index = () => {
  return (
    <div className="space-y-8">
      {/* Header above the homepage map */}
      <DashboardHeader />

      {/* Keep the existing dashboard below */}
      <Dashboard />
    </div>
  );
};

export default Index;
