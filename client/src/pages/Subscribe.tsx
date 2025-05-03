import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';

import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { User, SubscriptionPlan } from "@shared/schema";
import { useLocation } from "wouter";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from '@/components/ui/button';

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);



const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!stripe || !elements) {
      setIsSubmitting(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/portal?subscription=success",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    } else {
      toast({
        title: "Payment Successful",
        description: "You are subscribed!",
      });
      navigate("/portal");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || !elements || isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Subscribe Now"}
      </Button>
      <p className="text-sm text-gray-500 text-center">
        You'll be charged after your 14-day free trial ends. You can cancel anytime.
      </p>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [, navigate] = useLocation();

  const { data: user } = useQuery<User | null>({
    queryKey: ["/api/user/me"],
  });

  const { data: plans } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription-plans"],
  });

  // Get the plan from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planId = params.get("planId");
    if (planId) {
      setSelectedPlanId(parseInt(planId));
    }
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      navigate("/login?redirect=/subscribe");
    }
  }, [user, navigate]);

  // Find the selected plan
  const selectedPlan = plans?.find(plan => plan.id === selectedPlanId);

  useEffect(() => {
    // Create subscription when plan is selected
    if (selectedPlanId && user) {
      apiRequest("POST", "/api/create-subscription", { planId: selectedPlanId })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch(error => {
          console.error("Failed to create subscription:", error);
        });
    }
  }, [selectedPlanId, user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation user={user} isLoggedIn={true} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Choose Your Subscription Plan</h1>
          <p className="text-gray-600 mt-2">Select a plan that works best for your salon</p>
        </div>

        {!selectedPlan && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {plans?.map((plan) => (
              <Card key={plan.id} className={`overflow-hidden ${plan.isPopular ? 'border-primary' : ''}`}>
                {plan.isPopular && (
                  <div className="bg-primary text-white text-center py-1 font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <CardDescription>{plan.price === 29 ? "Everything needed for a standard salon website" : 
                    plan.price === 49 ? "Enhanced features for growing salons" : 
                    "Full-service solution for high-end salons"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.isPopular ? "default" : "outline"}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    Select Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {selectedPlan && !clientSecret && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {selectedPlan && clientSecret && (
          <Card className="mx-auto max-w-xl">
            <CardHeader>
              <CardTitle>Complete Your Subscription</CardTitle>
              <CardDescription>
                You're subscribing to the {selectedPlan.name} plan at ${selectedPlan.price}/month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Your 14-day free trial starts today. You won't be charged until the trial ends.
                    </p>
                  </div>
                </div>
              </div>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm />
              </Elements>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
