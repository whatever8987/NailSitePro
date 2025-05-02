import { TopNavigation } from "@/components/layout/TopNavigation";
import { useQuery } from "@tanstack/react-query";
import { User, SubscriptionPlan } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Pricing() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading: isLoadingUser } = useQuery<User | null>({
    queryKey: ["/api/user/me"],
    retry: false,
  });

  const { data: plans, isLoading: isLoadingPlans } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription-plans"],
    retry: false,
  });

  const isLoggedIn = !!user;

  const handleSelectPlan = (planId: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please log in to select a subscription plan",
        variant: "destructive"
      });
      navigate("/login?redirect=/pricing");
      return;
    }
    
    navigate(`/subscribe?planId=${planId}`);
  };

  if (isLoadingUser || isLoadingPlans) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation user={user} isLoggedIn={isLoggedIn} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-5 text-xl text-gray-500 max-w-3xl mx-auto">
            Choose the plan that works best for your salon. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans && plans.map((plan) => (
            <Card key={plan.id} className={`overflow-hidden flex flex-col h-full ${plan.isPopular ? 'ring-2 ring-primary relative' : ''}`}>
              {plan.isPopular && (
                <div className="absolute top-0 inset-x-0 bg-primary text-center py-1 text-xs font-medium text-white">
                  MOST POPULAR
                </div>
              )}
              <CardHeader className={plan.isPopular ? 'pt-8' : ''}>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-5">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                
                {plan.trialDays && plan.trialDays > 0 && (
                  <Badge variant="outline" className="mb-4">
                    {plan.trialDays}-day free trial
                  </Badge>
                )}
                
                <ul className="space-y-3 mt-6">
                  {plan.features && plan.features.map((feature, idx) => (
                    <li key={idx} className="flex">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSelectPlan(plan.id)} 
                  className="w-full"
                  variant={plan.isPopular ? "default" : "outline"}
                >
                  {isLoggedIn ? "Select Plan" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What's included in all plans?</h3>
              <p className="text-gray-600">All plans include a professional website, mobile optimization, content updates, and basic SEO for your salon.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time without penalty. Your website will remain active until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Do I need technical knowledge?</h3>
              <p className="text-gray-600">No technical skills required. Our easy-to-use interface lets you update content, services, and hours without coding.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What happens after the free trial?</h3>
              <p className="text-gray-600">After your 14-day trial, your selected plan will automatically begin. You can cancel before the trial ends to avoid any charges.</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need a custom solution?</h2>
          <p className="text-lg text-gray-600 mb-6">Contact us for custom features, designs, or multi-location salon chains.</p>
          <Button size="lg" onClick={() => navigate("/contact")}>
            Contact Sales
          </Button>
        </div>
      </main>
    </div>
  );
}