import { useQuery } from "@tanstack/react-query";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Star, Users } from "lucide-react";

export default function LandingPage() {
  const { data: user } = useQuery<User | null>({
    queryKey: ["/api/user/me"],
    retry: false,
  });

  const isLoggedIn = !!user;
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation user={user} isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Beautiful websites for</span>{" "}
                  <span className="block text-primary xl:inline">nail salons</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Attract more clients with a professional website designed specifically for nail salons. 
                  No upfront costs — just a simple monthly subscription.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/register">
                      <Button size="lg" className="w-full">
                        Get started
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="/demo/glamnails-miami">
                      <Button size="lg" variant="outline" className="w-full">
                        View demo
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Nail salon"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything your salon needs
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our websites are designed specifically for nail salons with all the features you need to grow your business.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Responsive Design</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our websites look great on all devices - from mobile phones to large desktop screens.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <Star className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Service Showcase</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Beautifully display your services with prices to attract more clients.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Online Booking</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Allow clients to book appointments online and manage your schedule easily.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Fast Performance</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Lightning-fast websites that load quickly and keep clients engaged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Choose the plan that works for your salon - all with no setup fees.
            </p>
          </div>

          <div className="mt-10 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6">
            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-medium text-gray-900">Basic</h3>
                <p className="mt-4 text-5xl font-extrabold text-gray-900">$29</p>
                <p className="mt-1 text-xl text-gray-500">/month</p>
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500">Custom subdomain</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500">Mobile-friendly design</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500">Basic content management</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500">Email support</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link href="/subscribe?planId=1">
                    <Button variant="outline" className="w-full py-2 px-4">
                      Choose Basic
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-primary relative">
              <div className="absolute top-0 inset-x-0 bg-primary text-white text-center py-1 text-sm font-medium">
                Most Popular
              </div>
              <div className="px-6 py-8 pt-10">
                <h3 className="text-2xl font-medium text-gray-900">Premium</h3>
                <p className="mt-4 text-5xl font-extrabold text-gray-900">$49</p>
                <p className="mt-1 text-xl text-gray-500">/month</p>
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500">All Basic features</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500">Custom domain connection</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500">Online booking integration</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500">Priority support</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link href="/subscribe?planId=2">
                    <Button className="w-full py-2 px-4">
                      Choose Premium
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Luxury Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-medium text-gray-900">Luxury</h3>
                <p className="mt-4 text-5xl font-extrabold text-gray-900">$99</p>
                <p className="mt-1 text-xl text-gray-500">/month</p>
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500">All Premium features</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500">Custom design modifications</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500">SEO optimization</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500">Dedicated support manager</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link href="/subscribe?planId=3">
                    <Button variant="outline" className="w-full py-2 px-4">
                      Choose Luxury
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to grow your salon business?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-100">
            Start your 14-day free trial today. No credit card required.
          </p>
          <Link href="/register">
            <Button 
              size="lg" 
              className="mt-8 w-full sm:w-auto bg-white text-primary hover:bg-gray-50"
            >
              Get started for free
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-400">
              &copy; {new Date().getFullYear()} Salon Site Builder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}