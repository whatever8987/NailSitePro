import { TopNavigation } from "@/components/layout/TopNavigation";
import { useQuery } from "@tanstack/react-query";
import { User, Salon } from "@shared/schema";
import { useLocation } from "wouter";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Globe, Settings, CreditCard, Image, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientPortal() {
  const [, navigate] = useLocation();

  const { data: user, isLoading: isLoadingUser } = useQuery<User | null>({
    queryKey: ["/api/user/me"],
  });

  const { data: salonData, isLoading: isLoadingSalon } = useQuery<Salon>({
    queryKey: ["/api/user/salon"],
    enabled: !!user,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoadingUser && !user) {
      navigate("/login");
    }
  }, [user, isLoadingUser, navigate]);

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, don't render the page
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation user={user} isLoggedIn={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Salon Portal</h1>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="content">Website Content</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Website Status</CardTitle>
                  <CardDescription>Your website's current status</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSalon ? (
                    <Skeleton className="h-20 w-full" />
                  ) : salonData ? (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="font-medium">Active</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Your website URL:</p>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 text-primary mr-2" />
                          <a 
                            href={`/demo/${salonData.sampleUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {salonData.sampleUrl}
                          </a>
                        </div>
                      </div>
                      <Button className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Website
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-4">You haven't claimed a website yet.</p>
                      <Button>Claim Your Website</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Your current plan</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSalon ? (
                    <Skeleton className="h-20 w-full" />
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">Basic Plan</h3>
                        <p className="text-2xl font-bold text-primary">$29<span className="text-sm text-gray-500 font-normal">/month</span></p>
                        <p className="text-sm text-gray-500 mt-1">Next billing: June 15, 2023</p>
                      </div>
                      <Button className="w-full" variant="outline">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your website</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Image className="h-4 w-4 mr-2" />
                      Update Images
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Edit Services
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Site Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Website Content</CardTitle>
                <CardDescription>Update your website content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Basic Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salon Name</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded-md" 
                          value={salonData?.name || ""}
                          readOnly={isLoadingSalon}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded-md" 
                          value={salonData?.location || ""}
                          readOnly={isLoadingSalon}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded-md" 
                          value={salonData?.address || ""}
                          readOnly={isLoadingSalon}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded-md" 
                          value={salonData?.phoneNumber || ""}
                          readOnly={isLoadingSalon}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          className="w-full p-2 border border-gray-300 rounded-md" 
                          value={salonData?.email || ""}
                          readOnly={isLoadingSalon}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded-md" 
                          placeholder="Mon-Sat: 9AM-7PM, Sun: 10AM-5PM"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Services</h3>
                  <div className="border border-gray-300 rounded-md p-4">
                    <div className="space-y-3">
                      {isLoadingSalon ? (
                        Array(3).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-10 w-full" />
                        ))
                      ) : (
                        (salonData?.services || ["Manicure", "Pedicure", "Gel Nails"]).map((service, idx) => (
                          <div key={idx} className="flex items-center">
                            <input 
                              type="text" 
                              className="flex-grow p-2 border border-gray-300 rounded-md mr-2" 
                              value={service} 
                            />
                            <Button variant="ghost" size="sm" className="text-red-500">
                              Remove
                            </Button>
                          </div>
                        ))
                      )}
                      <Button variant="outline" size="sm" className="mt-2">
                        Add Service
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Cancel
                  </Button>
                  <Button>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>Manage your subscription plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-primary rounded-lg p-6 bg-primary/5 relative">
                    <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-semibold">
                      Current Plan
                    </div>
                    <h3 className="text-xl font-bold">Basic</h3>
                    <p className="text-3xl font-bold mt-2">$29<span className="text-sm font-normal">/mo</span></p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Custom subdomain</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Mobile-friendly design</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Basic content management</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Email support</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold">Premium</h3>
                    <p className="text-3xl font-bold mt-2">$49<span className="text-sm font-normal">/mo</span></p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>All Basic features</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Custom domain connection</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Online booking integration</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Priority support</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-4" onClick={() => navigate("/subscribe?plan=premium")}>
                      Upgrade
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold">Luxury</h3>
                    <p className="text-3xl font-bold mt-2">$99<span className="text-sm font-normal">/mo</span></p>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>All Premium features</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Custom design modifications</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>SEO optimization</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>Dedicated support manager</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-4" onClick={() => navigate("/subscribe?plan=luxury")}>
                      Upgrade
                    </Button>
                  </div>
                </div>

                <div className="mt-8 border-t pt-6">
                  <h3 className="font-semibold mb-4">Billing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                      <div className="flex items-center border border-gray-200 rounded-md p-3">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/2025</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Update
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Billing Address</p>
                      <div className="border border-gray-200 rounded-md p-3">
                        <p className="font-medium">Jane Smith</p>
                        <p className="text-sm text-gray-500">123 Main St, Suite 101</p>
                        <p className="text-sm text-gray-500">Miami, FL 33101</p>
                        <Button variant="ghost" size="sm" className="mt-2">
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded-md" 
                          value={user?.username || ""}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          className="w-full p-2 border border-gray-300 rounded-md" 
                          value={user?.email || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                          type="tel" 
                          className="w-full p-2 border border-gray-300 rounded-md" 
                          value={user?.phoneNumber || ""}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input type="password" className="w-full p-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" className="w-full p-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input type="password" className="w-full p-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t pt-6">
                  <h3 className="font-semibold mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive emails about your account and website</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Communications</p>
                        <p className="text-sm text-gray-500">Receive tips, updates, and offers about SalonSite</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Cancel
                  </Button>
                  <Button>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
