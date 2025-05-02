import { TopNavigation } from "@/components/layout/TopNavigation";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { TemplateGallery } from "@/components/dashboard/TemplateGallery";
import { SubscriptionPlans } from "@/components/dashboard/SubscriptionPlans";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Salon } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Edit, Eye, CreditCard, Settings } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      <TopNavigation user={user} isLoggedIn={isLoggedIn} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome{user ? `, ${user.username}` : ''}!</h1>
          <p className="mt-2 text-gray-600">Manage your salon website and subscription from your dashboard.</p>
        </div>
        
        <TabNavigation tabs={userTabs} activeTab={activeTab} />
        
        {/* Website Status */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Website Status</h2>
          <Card className="overflow-hidden">
            {isLoadingSalon ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : userSalon ? (
              <>
                <CardHeader>
                  <CardTitle>{userSalon.name}</CardTitle>
                  <CardDescription>{userSalon.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Template</p>
                      <p className="mt-1 text-gray-900">Modern Design</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">URL</p>
                      <p className="mt-1 text-gray-900">
                        <a href={`/demo/${userSalon.sampleUrl}`} target="_blank" className="text-primary hover:underline">
                          {window.location.origin}/demo/{userSalon.sampleUrl}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p className="mt-1 text-gray-900">
                        {userSalon.claimedAt ? new Date(userSalon.claimedAt).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/demo/${userSalon.sampleUrl}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Site
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/portal')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                </CardFooter>
              </>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500 mb-4">You don't have a salon website set up yet.</p>
                <div className="flex justify-center">
                  <Button onClick={() => navigate('/portal')}>Set Up Your Website</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Manage Content</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-sm text-gray-500">Update your salon services, photos, and information</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/portal')}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Website
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Billing & Subscription</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-sm text-gray-500">Update your payment method or change your subscription plan</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/subscribe')}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">One-time Payments</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-sm text-gray-500">Pay for custom services or additional features</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/checkout')}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Make a Payment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Template gallery (for users who haven't chosen a template) */}
        {(!userSalon || !userSalon.templateId) && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
            <TemplateGallery />
          </div>
        )}
        
        {/* Subscription plans (for users who haven't subscribed) */}
        {(!user?.stripeSubscriptionId) && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>
            <SubscriptionPlans />
          </div>
        )}
      </main>
    </div>
  );
}
