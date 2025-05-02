import { useQuery } from "@tanstack/react-query";
import { Stats } from "@shared/schema";
import { ArrowUpIcon, ArrowDownIcon, Store, LayoutGrid, CreditCard, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardOverviewProps {
  stats?: Stats;
}

export function DashboardOverview() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const statItems = [
    {
      name: "Total Salons",
      value: stats?.totalSalons,
      change: 12,
      changeType: "increase" as const,
      icon: Store,
      bgColor: "bg-primary",
    },
    {
      name: "Sample Sites",
      value: stats?.sampleSites,
      change: 8,
      changeType: "increase" as const,
      icon: LayoutGrid,
      bgColor: "bg-accent",
    },
    {
      name: "Active Subscriptions",
      value: stats?.activeSubscriptions,
      change: 20,
      changeType: "increase" as const,
      icon: CreditCard,
      bgColor: "bg-secondary",
    },
    {
      name: "Pending Contacts",
      value: stats?.pendingContacts,
      change: 5,
      changeType: "decrease" as const,
      icon: HelpCircle,
      bgColor: "bg-warning",
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
      <p className="mt-1 text-sm text-gray-500">
        Monitor your salon website platform performance at a glance.
      </p>

      <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <Card key={item.name} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6">
                <dt>
                  <div className={`absolute ${item.bgColor} rounded-md p-3`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </p>
                </dt>
                <dd className="ml-16 pb-6 flex items-baseline">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-semibold text-gray-900">
                      {item.value !== undefined ? item.value : 0}
                    </p>
                  )}
                  
                  <p
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      item.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.changeType === "increase" ? (
                      <ArrowUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {item.changeType === "increase" ? "Increased" : "Decreased"} by
                    </span>
                    {item.change}%
                  </p>
                </dd>
              </div>
            </CardContent>
          </Card>
        ))}
      </dl>
    </div>
  );
}
