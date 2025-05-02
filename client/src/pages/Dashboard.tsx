import { TopNavigation } from "@/components/layout/TopNavigation";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { NewSampleSiteCreator } from "@/components/dashboard/NewSampleSiteCreator";
import { RecentLeads } from "@/components/dashboard/RecentLeads";
import { TemplateGallery } from "@/components/dashboard/TemplateGallery";
import { SubscriptionPlans } from "@/components/dashboard/SubscriptionPlans";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const { data: user, isLoading: isLoadingUser } = useQuery<User | null>({
    queryKey: ["/api/user/me"],
    retry: false,
  });

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const tabs = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Lead Management", href: "/leads" },
    { name: "Sample Websites", href: "/samples" },
    { name: "Subscriptions", href: "/subscriptions" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation user={user} isLoggedIn={isLoggedIn} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation tabs={tabs} activeTab={activeTab} />
        
        {/* Dashboard content */}
        {isAdmin && <DashboardOverview />}
        
        {/* Create new sample site section */}
        {isAdmin && <NewSampleSiteCreator />}
        
        {/* Recent leads section */}
        {isAdmin && <RecentLeads />}
        
        {/* Template gallery */}
        <TemplateGallery />
        
        {/* Subscription plans */}
        <SubscriptionPlans />
        
        {/* One-time payment section */}
        {isLoggedIn && (
          <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">One-time Payment</h3>
              <p className="mt-1 text-sm text-gray-500">Need to make a custom payment? Use our secure checkout process.</p>
            </div>
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Custom Website Services</h4>
                  <p className="text-sm text-gray-500">Pay for design changes, additional features, or custom development</p>
                </div>
                <a href="/checkout" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Proceed to Checkout
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
