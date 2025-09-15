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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 md:h-16 items-center justify-between px-2 md:px-4">
        <div className="flex flex-col">
          <h1 className="text-lg md:text-2xl font-bold text-foreground">JeevanDhara</h1>
          <p className="text-xs md:text-sm text-muted-foreground">MRL & AMU Monitoring System</p>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 md:h-8 md:w-8 p-0">
                {theme === 'light' && <Sun className="h-3.5 w-3.5 md:h-4 md:w-4" />}
                {theme === 'dark' && <Moon className="h-3.5 w-3.5 md:h-4 md:w-4" />}
                {theme === 'system' && <Monitor className="h-3.5 w-3.5 md:h-4 md:w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                <span className="text-xs md:text-sm">Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                <span className="text-xs md:text-sm">Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                <span className="text-xs md:text-sm">System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 md:space-x-2">
            <Globe className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground hidden sm:block" />
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger className="w-16 md:w-24 h-7 md:h-8 text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">EN</SelectItem>
                <SelectItem value="hindi">हि</SelectItem>
                <SelectItem value="bengali">বা</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="ghost" size="sm" className="relative h-7 w-7 md:h-8 md:w-8 p-0">
            <Bell className="h-3.5 w-3.5 md:h-4 md:w-4" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[8px] md:text-xs flex items-center justify-center text-destructive-foreground">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 md:h-8">
                <User className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="text-xs md:text-sm hidden sm:inline">{profile?.full_name || user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 md:w-56">
              <DropdownMenuItem>
                <Settings className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                <span className="text-xs md:text-sm">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                <span className="text-xs md:text-sm">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};