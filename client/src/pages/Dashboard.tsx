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
      </main>
    </div>
  );
}
