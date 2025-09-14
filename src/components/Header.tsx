import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, User, Settings, LogOut, Globe, Sun, Moon, Monitor } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [alertCount, setAlertCount] = useState(0);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      // Load profile
      const loadProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setProfile(data);
      };

      // Load alert count
      const loadAlertCount = async () => {
        const { count } = await supabase
          .from('alerts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_dismissed', false);
        setAlertCount(count || 0);
      };

      loadProfile();
      loadAlertCount();

      // Subscribe to real-time alert updates
      const subscription = supabase
        .channel('alerts')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'alerts',
          filter: `user_id=eq.${user.id}`
        }, () => {
          loadAlertCount();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">JeevanDhara</h1>
          <p className="text-sm text-muted-foreground">MRL & AMU Monitoring System</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {theme === 'light' && <Sun className="h-4 w-4" />}
                {theme === 'dark' && <Moon className="h-4 w-4" />}
                {theme === 'system' && <Monitor className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="h-4 w-4 mr-2" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="h-4 w-4 mr-2" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">EN</SelectItem>
                <SelectItem value="hindi">हि</SelectItem>
                <SelectItem value="bengali">বা</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                {profile?.full_name || user?.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};