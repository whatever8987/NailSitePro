import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Menu, ChevronDown, Settings, LogOut, User as UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface TopNavigationProps {
  user?: User;
  isLoggedIn: boolean;
}

export function TopNavigation({ user, isLoggedIn }: TopNavigationProps) {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      // Clear any client-side cache or state
      window.location.href = "/login"; // Hard redirect to ensure complete reset
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    { name: t("navigation.dashboard"), href: "/" },
    { name: t("navigation.templates"), href: "/templates" },
    { name: t("navigation.pricing"), href: "/pricing" },
    { name: t("navigation.blog"), href: "/blog" },
    { name: t("navigation.contact"), href: "/contact" },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <svg
                  className="h-9 w-9 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12c0 1.2-4 6-9 6s-9-4.8-9-6c0-1.2 4-6 9-6s9 4.8 9 6z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="ml-2 font-bold text-xl gradient-text">Pussco</span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center h-full mx-1`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
            <LanguageSwitcher />
            
            {isLoggedIn && user?.role === "admin" && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1 flex"
                asChild
              >
                <Link href="/salon/new">
                  <PlusCircle className="h-4 w-4" />
                  {t("common.create")} Salon
                </Link>
              </Button>
            )}
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="" alt={user?.username || "User"} />
                      <AvatarFallback className="text-xs bg-primary text-white">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-normal hidden md:block">
                      {user?.username || "Account"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <UserIcon className="h-4 w-4 mr-2" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/portal" className="flex items-center cursor-pointer">
                      <PlusCircle className="h-4 w-4 mr-2" /> My Website
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button className="gradient-bg border-0" size="sm" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="px-7 py-4 border-b">
                    <Link 
                      href="/" 
                      className="flex items-center" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg
                        className="h-8 w-8 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12c0 1.2-4 6-9 6s-9-4.8-9-6c0-1.2 4-6 9-6s9 4.8 9 6z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span className="ml-2 font-bold text-xl gradient-text">Pussco</span>
                    </Link>
                  </div>
                  
                  <nav className="flex flex-col space-y-4 px-4 py-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${
                          isActive(item.href)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/50"
                        } px-3 py-2 rounded-md text-sm`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  
                  <div className="mt-auto px-4 pb-8">
                    {!isLoggedIn ? (
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start" 
                          onClick={() => {
                            navigate("/login");
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign in
                        </Button>
                        <Button 
                          className="w-full justify-start gradient-bg border-0" 
                          onClick={() => {
                            navigate("/register");
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign up
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {user?.role === "admin" && (
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              navigate("/salon/new");
                              setMobileMenuOpen(false);
                            }}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            New Salon
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            navigate("/account");
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full justify-start"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Log out
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
