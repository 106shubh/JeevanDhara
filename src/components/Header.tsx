import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Globe, 
  Settings,
  Wifi,
  WifiOff
} from "lucide-react";
import { AlertBadge } from "./AlertBadge";

interface HeaderProps {
  userRole?: "farmer" | "veterinarian" | "regulator";
  userName?: string;
  farmName?: string;
  isOnline?: boolean;
  alertCount?: number;
}

export const Header = ({ 
  userRole = "farmer", 
  userName = "John Doe",
  farmName = "Green Valley Farm",
  isOnline = true,
  alertCount = 0
}: HeaderProps) => {
  const roleLabels = {
    farmer: "Farmer",
    veterinarian: "Veterinarian", 
    regulator: "Regulator"
  };

  return (
    <header className="bg-gradient-hero text-primary-foreground shadow-elevated">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Logo and Farm Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-foreground/10 p-2 rounded-lg">
                <div className="w-8 h-8 bg-primary-foreground rounded text-primary flex items-center justify-center font-bold">
                  FM
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold">Farm Management Portal</h1>
                <p className="text-primary-foreground/80 text-sm">{farmName}</p>
              </div>
            </div>
          </div>

          {/* User Info and Controls */}
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-primary-foreground/80" />
              ) : (
                <WifiOff className="h-4 w-4 text-warning" />
              )}
              <span className="text-sm text-primary-foreground/80">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* Language Toggle */}
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Globe className="h-4 w-4 mr-2" />
              EN
            </Button>

            {/* Alerts */}
            <Button variant="ghost" size="sm" className="relative text-primary-foreground hover:bg-primary-foreground/10">
              <Bell className="h-4 w-4" />
              {alertCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground border-0">
                  {alertCount}
                </Badge>
              )}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Settings className="h-4 w-4" />
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-primary-foreground">{userName}</p>
                <AlertBadge 
                  type="compliant" 
                  className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                >
                  {roleLabels[userRole]}
                </AlertBadge>
              </div>
              <Avatar className="h-8 w-8 border-2 border-primary-foreground/20">
                <AvatarImage src="/placeholder-user.jpg" alt={userName} />
                <AvatarFallback className="bg-primary-foreground text-primary font-medium">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};