import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SampleSite from "@/pages/SampleSite";
import ClientPortal from "@/pages/ClientPortal";
import Subscribe from "@/pages/Subscribe";
import Checkout from "@/pages/Checkout";
import LandingPage from "@/pages/LandingPage";
import { useEffect } from "react";

function Router() {
  const [location] = useLocation();

  // Log current route for debugging
  useEffect(() => {
    console.log("Current route:", location);
  }, [location]);

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/demo/:salonName-:city" component={SampleSite} />
      
      {/* Protected User Routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/portal" component={ClientPortal} />
      <ProtectedRoute path="/subscribe" component={Subscribe} />
      <ProtectedRoute path="/checkout" component={Checkout} />
      
      {/* Protected Admin Routes */}
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} adminOnly />
      <ProtectedRoute path="/admin/leads" component={AdminDashboard} adminOnly />
      <ProtectedRoute path="/admin/samples" component={AdminDashboard} adminOnly />
      <ProtectedRoute path="/admin/subscriptions" component={AdminDashboard} adminOnly />
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
