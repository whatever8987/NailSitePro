import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SampleSite from "@/pages/SampleSite";
import ClientPortal from "@/pages/ClientPortal";
import Subscribe from "@/pages/Subscribe";
import { useEffect } from "react";

function Router() {
  const [location] = useLocation();

  // Log current route for debugging
  useEffect(() => {
    console.log("Current route:", location);
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/demo/:salonName-:city" component={SampleSite} />
      <Route path="/portal" component={ClientPortal} />
      <Route path="/subscribe" component={Subscribe} />
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
