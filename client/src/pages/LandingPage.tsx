import { useQuery } from "@tanstack/react-query";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle2, 
  Star, 
  Users, 
  Sparkles, 
  Globe, 
  Palette, 
  Zap,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  const { data: user } = useQuery<User | null>({
    queryKey: ["/api/user/me"],
    retry: false,
  });

  const isLoggedIn = !!user;
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation user={user} isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4 mr-2" /> The easiest way to grow your salon online
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
                  Beautiful websites for <span className="gradient-text">nail salons</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Attract more clients with a professional website designed specifically for nail salons. 
                  No upfront costs — just a simple monthly subscription.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-primary/30 transition-all gradient-bg">
                    Get started <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/demo/glamnails-miami">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/20 hover:border-primary/40">
                    View demo
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="font-bold text-2xl gradient-text">50+</div>
                  <div className="text-sm text-muted-foreground">Salons</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl gradient-text">5+</div>
                  <div className="text-sm text-muted-foreground">Templates</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl gradient-text">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-glow">
                <img
                  className="w-full"
                  src="https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  alt="Nail salon showcase"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary mb-4">
              <Sparkles className="h-4 w-4 mr-2" /> Designed for nail salons
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Everything your salon <span className="gradient-text">needs</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our websites are designed specifically for nail salons with all the features you need to grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Responsive Design</h3>
              <p className="text-muted-foreground">
                Our websites look great on all devices - from mobile phones to large desktop screens.
              </p>
            </div>

            <div className="glass-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Service Showcase</h3>
              <p className="text-muted-foreground">
                Beautifully display your services with prices to attract more clients.
              </p>
            </div>

            <div className="glass-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Online Booking</h3>
              <p className="text-muted-foreground">
                Allow clients to book appointments online and manage your schedule easily.
              </p>
            </div>

            <div className="glass-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Performance</h3>
              <p className="text-muted-foreground">
                Lightning-fast websites that load quickly and keep clients engaged.
              </p>
            </div>
            
            <div className="glass-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">SEO Optimized</h3>
              <p className="text-muted-foreground">
                Get found by potential clients through search engines with our SEO-friendly designs.
              </p>
            </div>
            
            <div className="glass-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-6">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Management</h3>
              <p className="text-muted-foreground">
                Simple tools to update your content without any technical knowledge needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-background relative">
        <div className="absolute inset-0 bg-grid-slate-200/70 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary mb-4">
              <Sparkles className="h-4 w-4 mr-2" /> Start for free, upgrade anytime
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Simple, <span className="gradient-text">transparent</span> pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works for your salon - all with no setup fees and a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="glass-card relative overflow-hidden group transition-all hover:shadow-lg duration-300">
              <div className="absolute h-2 w-full top-0 left-0 bg-primary/30"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Basic</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  Perfect for starting your online presence
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Custom subdomain</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Mobile-friendly design</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Basic content management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Link href="/subscribe?planId=1">
                  <Button variant="outline" className="w-full rounded-full">
                    Choose Basic
                  </Button>
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="glass-card relative overflow-hidden border-primary/30 group transition-all hover:shadow-lg hover:border-primary hover:border-glow duration-300">
              <div className="absolute h-2 w-full top-0 left-0 gradient-bg"></div>
              <div className="absolute top-2 inset-x-0 text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-white">
                  Most Popular
                </div>
              </div>
              <div className="p-8 pt-12">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  Everything needed for a professional salon
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>All Basic features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Custom domain connection</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Online booking integration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link href="/subscribe?planId=2">
                  <Button className="w-full rounded-full gradient-bg border-0">
                    Choose Premium
                  </Button>
                </Link>
              </div>
            </div>

            {/* Luxury Plan */}
            <div className="glass-card relative overflow-hidden group transition-all hover:shadow-lg duration-300">
              <div className="absolute h-2 w-full top-0 left-0 bg-secondary/50"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Luxury</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  Complete solutions for high-end salons
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>All Premium features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Custom design modifications</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>SEO optimization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Dedicated support manager</span>
                  </li>
                </ul>
                <Link href="/subscribe?planId=3">
                  <Button variant="outline" className="w-full rounded-full">
                    Choose Luxury
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90"></div>
        <div className="absolute right-0 bottom-0 opacity-10">
          <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(300,300)">
              <path d="M151.5,-192.2C199.2,-152.3,242.1,-106.5,255.4,-52.5C268.8,1.6,252.6,63.7,220.7,111.1C188.8,158.5,141.3,191.2,88.1,214.5C34.9,237.8,-24,251.8,-81.3,241.8C-138.6,231.9,-194.4,198.2,-226.6,149C-258.7,99.7,-267.4,34.8,-248,-17.7C-228.7,-70.2,-181.3,-110.2,-135.8,-150.7C-90.2,-191.1,-45.1,-232,3.7,-236.7C52.5,-241.4,103.9,-232,151.5,-192.2Z" fill="white" />
            </g>
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to grow your salon business?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="px-8 rounded-full shadow-lg bg-white text-primary hover:bg-gray-50 hover:shadow-xl transition-all"
                >
                  Get started for free
                </Button>
              </Link>
              <Link to="/demo/glamnails-miami">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 rounded-full border-white text-white hover:bg-white/10"
                >
                  View demo site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-4 text-white">Salon Site Builder</h3>
              <p className="text-slate-400 mb-4 max-w-md">
                The easiest way to create a professional website for your nail salon. No technical knowledge required.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Features</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Design Tools</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">SEO Tools</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Mobile Friendly</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms & Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-slate-400 text-center">
            &copy; {new Date().getFullYear()} Salon Site Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}