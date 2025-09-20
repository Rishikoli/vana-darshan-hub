import { User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardHeader = () => {
  return (
    <header className="bg-card border-b shadow-government">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Government Emblem and Title */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">भारत</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              VanaDarshan - Forest Vision
            </h1>
            <p className="text-sm text-muted-foreground text-hindi">
              वनदर्शन - वन अधिकार डैशबोर्ड
            </p>
          </div>
        </div>

        {/* Ministry Branding */}
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Government of India</p>
          <p className="text-xs text-muted-foreground">Ministry of Tribal Affairs</p>
          <p className="text-xs text-primary font-medium">Forest Rights Act Portal</p>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Forest Officer</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Switch Role</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;