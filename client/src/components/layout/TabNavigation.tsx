import { Link, useLocation } from "wouter";

interface Tab {
  name: string;
  href: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab?: string;
}

export function TabNavigation({ tabs, activeTab }: TabNavigationProps) {
  const [location] = useLocation();

  const isActive = (href: string) => {
    return location === href || activeTab === href;
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`${
              isActive(tab.href)
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } px-1 py-4 border-b-2 font-medium text-sm`}
            aria-current={isActive(tab.href) ? "page" : undefined}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
