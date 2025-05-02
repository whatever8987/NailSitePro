import { TopNavigation } from "@/components/layout/TopNavigation";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { TemplateGallery } from "@/components/dashboard/TemplateGallery";
import { SubscriptionPlans } from "@/components/dashboard/SubscriptionPlans";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Salon } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, 
  Edit, 
  Eye, 
  CreditCard, 
  Settings, 
  Sparkles, 
  Globe, 
  LineChart, 
  Palette, 
  BarChart4, 
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [, navigate] = useLocation();
  
  const { data: user, isLoading: isLoadingUser } = useQuery<User | null>({
    queryKey: ["/api/user/me"],
    retry: false,
  });

  const { data: userSalon, isLoading: isLoadingSalon } = useQuery<Salon | null>({
    queryKey: ["/api/user/salon"],
    enabled: !!user,
  });

  const isLoggedIn = !!user;
  const isSalonOwner = user?.role === "salonOwner";

  // If user is admin, redirect to admin dashboard
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const userTabs = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Website", href: "/portal" },
    { name: "Billing", href: "/subscribe" },
    { name: "Account", href: "/account" },
  ];

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation user={user} isLoggedIn={isLoggedIn} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Header */}
        <div className="py-4 md:py-10 mb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary mb-2">
                <Sparkles className="h-4 w-4 mr-2" /> Salon Dashboard
              </div>
              <h1 className="text-3xl font-bold">Welcome{user ? `, ${user.username}` : ''}!</h1>
              <p className="text-muted-foreground">Manage your salon website and subscription here.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigate('/account')}>
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
              <Button className="gradient-bg border-0" onClick={() => navigate('/portal')}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Website
              </Button>
            </div>
          </div>
          
          <TabNavigation tabs={userTabs} activeTab={activeTab} />
        </div>
        
        {/* Website Status */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-primary" /> Website Status
          </h2>
          <div className="glass-card overflow-hidden border border-slate-200 dark:border-slate-800">
            {isLoadingSalon ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : userSalon ? (
              <>
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{userSalon.name}</h3>
                      <p className="text-muted-foreground">{userSalon.location}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" /> Active
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Template</p>
                      <p className="text-foreground font-medium">Modern Design</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">URL</p>
                      <a 
                        href={`/demo/${userSalon.sampleUrl}`} 
                        target="_blank" 
                        className="text-primary hover:underline font-medium flex items-center"
                      >
                        {window.location.origin}/demo/{userSalon.sampleUrl}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
                      <p className="text-foreground font-medium">
                        {userSalon.claimedAt ? new Date(userSalon.claimedAt).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 p-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/demo/${userSalon.sampleUrl}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Site
                  </Button>
                  <Button className="gradient-bg border-0" size="sm" onClick={() => navigate('/portal')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Get Started with Your Website</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">You don't have a salon website set up yet. Create your salon website in just a few minutes.</p>
                <div className="flex justify-center">
                  <Button onClick={() => navigate('/portal')} className="gradient-bg border-0 px-8">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Set Up Your Website
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Palette className="h-5 w-5 mr-2 text-secondary" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card transition-all hover:shadow-lg hover:-translate-y-1 duration-300 overflow-hidden">
              <div className="p-6 flex flex-col h-full">
                <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Manage Content</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-grow">
                  Update your salon services, photos, and business information
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-primary/20 hover:border-primary/60" 
                  onClick={() => navigate('/portal')}
                >
                  Edit Website
                </Button>
              </div>
            </div>
            
            <div className="glass-card transition-all hover:shadow-lg hover:-translate-y-1 duration-300 overflow-hidden">
              <div className="p-6 flex flex-col h-full">
                <div className="h-12 w-12 rounded-lg bg-secondary/90 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Billing & Subscription</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-grow">
                  Update your payment method or change your subscription plan
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-secondary/20 hover:border-secondary/60" 
                  onClick={() => navigate('/subscribe')}
                >
                  Manage Subscription
                </Button>
              </div>
            </div>
            
            <div className="glass-card transition-all hover:shadow-lg hover:-translate-y-1 duration-300 overflow-hidden">
              <div className="p-6 flex flex-col h-full">
                <div className="h-12 w-12 rounded-lg bg-amber-500 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">One-time Services</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-grow">
                  Pay for custom services or additional premium features
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-amber-200 hover:border-amber-300" 
                  onClick={() => navigate('/checkout')}
                >
                  Make a Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Data Overview */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <BarChart4 className="h-5 w-5 mr-2 text-purple-500" /> Analytics Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Total Visits</h3>
                <LineChart className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold mb-1">128</p>
              <p className="text-sm text-green-500">+12% this month</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Appointment Requests</h3>
                <LineChart className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold mb-1">24</p>
              <p className="text-sm text-green-500">+8% this month</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Page Views</h3>
                <LineChart className="h-5 w-5 text-cyan-500" />
              </div>
              <p className="text-3xl font-bold mb-1">349</p>
              <p className="text-sm text-green-500">+15% this month</p>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Average Time on Site</h3>
                <LineChart className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-3xl font-bold mb-1">2:34</p>
              <p className="text-sm text-green-500">+5% this month</p>
            </div>
          </div>
        </div>
        
        {/* Template gallery (for users who haven't chosen a template) */}
        {(!userSalon || !userSalon.templateId) && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Palette className="h-5 w-5 mr-2 text-indigo-500" /> Choose a Template
            </h2>
            <TemplateGallery />
          </div>
        )}
        
        {/* Subscription plans (for users who haven't subscribed) */}
        {(!user?.stripeSubscriptionId) && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-emerald-500" /> Subscription Plans
            </h2>
            <SubscriptionPlans />
          </div>
        )}
      </main>
    </div>
  );
}
