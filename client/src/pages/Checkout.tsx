import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useLocation } from "wouter";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.



const CheckoutForm = () => {
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
        return_url: window.location.origin + "/portal?payment=success",
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
        description: "Thank you for your purchase!",
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
        {isSubmitting ? "Processing..." : "Complete Payment"}
      </Button>
    </form>
  );
};
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(100);
  const [description, setDescription] = useState("Website development services");
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: user } = useQuery<User | null>({
    queryKey: ["/api/user/me"],
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      navigate("/login?redirect=/checkout");
    }
  }, [user, navigate]);

  // Parse amount from URL if provided
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amountParam = params.get("amount");
    const descParam = params.get("description");
    
    if (amountParam) {
      setAmount(parseFloat(amountParam));
    }
    
    if (descParam) {
      setDescription(descParam);
    }
  }, []);

  const handleCreatePayment = async () => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount,
        description
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          <h1 className="text-3xl font-bold">Secure Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your one-time payment</p>
        </div>

        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Safe and secure payment processing with Stripe
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!clientSecret ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount (USD)</Label>
                  <Input 
                    id="amount"
                    type="number" 
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    className="text-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Payment Description</Label>
                  <Input 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleCreatePayment}
                >
                  Continue to Payment
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Amount:</span>
                    <span>${amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Description:</span>
                    <span className="text-gray-600">{description}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm />
                </Elements>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}