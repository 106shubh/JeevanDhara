import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import { Auth } from "./pages/Auth";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Routes>
          <Route 
            path="/landing" 
            element={<Landing />} 
          />
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/" replace /> : <Auth />} 
          />
          <Route 
            path="/" 
            element={user ? <Index /> : <Navigate to="/landing" replace />}
          />
          <Route 
            path="*" 
            element={<Navigate to={user ? "/" : "/landing"} replace />} 
          />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
