import { useQuery } from "@tanstack/react-query";
import { Salon, Template } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import { Loader2, Phone, Mail, MapPin, Clock, ArrowLeft, User, Calendar, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

export default function SampleSite() {
  const { salonName, city } = useParams();
  const sampleUrl = `${salonName}-${city}`;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showAdminBar, setShowAdminBar] = useState(true);

  // Fetch the salon data based on the URL
  const { data: salon, isLoading: isLoadingSalon } = useQuery<Salon>({
    queryKey: ["/api/salons/sample", sampleUrl],
    queryFn: async () => {
      const response = await fetch(`/api/salons/sample/${sampleUrl}`);
      if (!response.ok) {
        throw new Error("Salon not found");
      }
      return response.json();
    },
    retry: false,
    onError: () => {
      toast({
        title: "Salon not found",
        description: "The salon you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate("/");
    },
  });

  // Fetch the template data for the salon
  const { data: template, isLoading: isLoadingTemplate } = useQuery<Template>({
    queryKey: ["/api/templates", salon?.templateId],
    queryFn: async () => {
      if (!salon?.templateId) return null;
      const response = await fetch(`/api/templates/${salon.templateId}`);
      if (!response.ok) {
        throw new Error("Template not found");
      }
      return response.json();
    },
    enabled: !!salon?.templateId,
  });

  // Load Google Maps API
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (isLoadingSalon || isLoadingTemplate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-red-500">Salon Not Found</h1>
        <p className="mt-2 text-gray-600">The salon you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Return Home
        </Button>
      </div>
    );
  }

  // Template style - would be based on the actual template selected
  const getTemplateStyles = () => {
    const defaultStyles = {
      primaryColor: '#f43f5e',
      secondaryColor: '#f9a8d4',
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: '#ffffff',
      textColor: '#333333',
    };

    if (!template) return defaultStyles;

    // In a real implementation, templates would have their own styles
    // This is just a basic example
    if (template.name === 'Elegant') {
      return {
        primaryColor: '#6366f1',
        secondaryColor: '#a5b4fc',
        fontFamily: "'Playfair Display', serif",
        backgroundColor: '#f8fafc',
        textColor: '#1e293b',
      };
    } else if (template.name === 'Modern') {
      return {
        primaryColor: '#14b8a6',
        secondaryColor: '#5eead4',
        fontFamily: "'Montserrat', sans-serif",
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
      };
    } else if (template.name === 'Bold') {
      return {
        primaryColor: '#f97316',
        secondaryColor: '#fdba74',
        fontFamily: "'Oswald', sans-serif",
        backgroundColor: '#f8fafc',
        textColor: '#1e293b',
      };
    }

    return defaultStyles;
  };

  const styles = getTemplateStyles();

  return (
    <div 
      style={{ 
        fontFamily: styles.fontFamily,
        backgroundColor: styles.backgroundColor,
        color: styles.textColor,
        minHeight: '100vh'
      }}
    >
      {/* Admin Bar */}
      {showAdminBar && (
        <div className="bg-gray-800 text-white p-3 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Button 
                variant="link" 
                className="text-white p-0 mr-4" 
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <span className="text-sm">
                Viewing demo site: <strong>{salon.name}</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                onClick={() => navigate(`/portal?salonId=${salon.id}`)}
              >
                Edit Site
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                onClick={() => setShowAdminBar(false)}
              >
                Hide Admin Bar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header/Navigation */}
      <header 
        className="py-4 shadow-sm"
        style={{ backgroundColor: styles.primaryColor }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">{salon.name}</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-white hover:text-gray-200 font-medium">About</a>
              <a href="#services" className="text-white hover:text-gray-200 font-medium">Services</a>
              <a href="#gallery" className="text-white hover:text-gray-200 font-medium">Gallery</a>
              <a href="#contact" className="text-white hover:text-gray-200 font-medium">Contact</a>
            </nav>
            <div>
              <Button 
                className="bg-white text-gray-900 hover:bg-gray-100"
                style={{ color: styles.primaryColor }}
              >
                <Phone className="h-4 w-4 mr-2" />
                {salon.phoneNumber || "Book Now"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[60vh]" style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1610991149688-c1321006bcc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
        backgroundColor: styles.secondaryColor
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome to {salon.name}</h2>
            <p className="text-xl md:text-2xl mb-8 max-w-xl mx-auto">
              {salon.description || `Professional nail care services in ${salon.location}`}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg"
                style={{ backgroundColor: styles.primaryColor }}
                className="text-white"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Appointment
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-white border-white hover:bg-white hover:text-gray-900"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: styles.primaryColor }}>About Us</h2>
            <div className="w-20 h-1 mx-auto" style={{ backgroundColor: styles.primaryColor }}></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Salon Interior" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
              <p className="text-gray-600 mb-6">
                {salon.description || `Welcome to ${salon.name}, where we're dedicated to providing exceptional nail care and beauty services in ${salon.location}. Our skilled technicians use only the highest quality products to ensure your satisfaction.`}
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center" style={{ backgroundColor: styles.secondaryColor }}>
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <p className="ml-3 text-gray-600">Skilled, experienced nail technicians</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center" style={{ backgroundColor: styles.secondaryColor }}>
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Premium quality products and materials</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center" style={{ backgroundColor: styles.secondaryColor }}>
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">Clean, hygienic environment for your safety</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: styles.primaryColor }}>Our Services</h2>
            <div className="w-20 h-1 mx-auto" style={{ backgroundColor: styles.primaryColor }}></div>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
              We offer a wide range of nail care services to keep your hands and feet looking beautiful.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {salon.services && salon.services.length > 0 ? (
              salon.services.map((service, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{service.split('-')[0].trim()}</h3>
                    <p className="text-gray-600 mb-4">
                      Professional nail care service tailored to your preferences.
                    </p>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-bold" style={{ color: styles.primaryColor }}>
                        {service.includes('-') ? service.split('-')[1].trim() : '$35'}
                      </span>
                      <Button
                        variant="outline"
                        style={{ borderColor: styles.primaryColor, color: styles.primaryColor }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Default services if none are provided
              <>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Classic Manicure</h3>
                    <p className="text-gray-600 mb-4">
                      Nail shaping, cuticle care, hand massage, and polish application.
                    </p>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-bold" style={{ color: styles.primaryColor }}>$35</span>
                      <Button
                        variant="outline"
                        style={{ borderColor: styles.primaryColor, color: styles.primaryColor }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Gel Pedicure</h3>
                    <p className="text-gray-600 mb-4">
                      Foot soak, exfoliation, nail care, massage, and long-lasting gel polish.
                    </p>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-bold" style={{ color: styles.primaryColor }}>$45</span>
                      <Button
                        variant="outline"
                        style={{ borderColor: styles.primaryColor, color: styles.primaryColor }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Nail Extensions</h3>
                    <p className="text-gray-600 mb-4">
                      Acrylic or gel nail extensions with custom design options.
                    </p>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-bold" style={{ color: styles.primaryColor }}>$60</span>
                      <Button
                        variant="outline"
                        style={{ borderColor: styles.primaryColor, color: styles.primaryColor }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" style={{ backgroundColor: styles.primaryColor }} className="text-white">
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: styles.primaryColor }}>Our Work</h2>
            <div className="w-20 h-1 mx-auto" style={{ backgroundColor: styles.primaryColor }}></div>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
              Take a look at some of our recent nail designs and client work.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-w-1 aspect-h-1">
              <img src="https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Nail Design" className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity" />
            </div>
            <div className="aspect-w-1 aspect-h-1">
              <img src="https://images.unsplash.com/photo-1610992008551-9c33df9f1d4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Nail Design" className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity" />
            </div>
            <div className="aspect-w-1 aspect-h-1">
              <img src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Nail Design" className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity" />
            </div>
            <div className="aspect-w-1 aspect-h-1">
              <img src="https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Nail Design" className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity" />
            </div>
            <div className="aspect-w-1 aspect-h-1">
              <img src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Nail Design" className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity" />
            </div>
            <div className="aspect-w-1 aspect-h-1">
              <img src="https://images.unsplash.com/photo-1607779097148-d3a11dcd5717?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Nail Design" className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity" />
            </div>
            <div className="aspect-w-1 aspect-h-1">
              <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Nail Design" className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity" />
            </div>
            <div className="aspect-w-1 aspect-h-1">
              <img src="https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Nail Design" className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity" />
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              style={{ borderColor: styles.primaryColor, color: styles.primaryColor }}
            >
              View More
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: styles.primaryColor }}>Contact Us</h2>
            <div className="w-20 h-1 mx-auto" style={{ backgroundColor: styles.primaryColor }}></div>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
              We'd love to hear from you! Book an appointment or visit us at our location.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <MapPin className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 font-medium">Address</p>
                      <p className="text-gray-600">{salon.address}, {salon.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Phone className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 font-medium">Phone</p>
                      <p className="text-gray-600">{salon.phoneNumber || "(555) 123-4567"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 font-medium">Email</p>
                      <p className="text-gray-600">{salon.email || "info@" + salon.name.toLowerCase().replace(/\s+/g, '') + ".com"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 font-medium">Opening Hours</p>
                      <div className="text-gray-600 whitespace-pre-line">
                        {salon.openingHours || 
                          `Monday - Friday: 9:00 AM - 7:00 PM
                          Saturday: 9:00 AM - 6:00 PM
                          Sunday: Closed`}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button size="lg" className="w-full" style={{ backgroundColor: styles.primaryColor }}>
                    Book an Appointment
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                <div className="h-full min-h-[300px] bg-gray-200">
                  {/* Map would be here - using a placeholder */}
                  <div className="h-full w-full flex items-center justify-center bg-gray-200">
                    <div className="text-center p-4">
                      <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Map loading...</p>
                      <p className="text-sm text-gray-500 mt-2">{salon.address}, {salon.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white" style={{ backgroundColor: styles.primaryColor }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{salon.name}</h3>
              <p className="text-white text-opacity-80 mb-4">
                Professional nail salon providing exceptional services in {salon.location}.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-white text-opacity-80 hover:text-opacity-100">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-white text-opacity-80 hover:text-opacity-100">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-white text-opacity-80 hover:text-opacity-100">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white text-opacity-80 hover:text-opacity-100">Home</a></li>
                <li><a href="#about" className="text-white text-opacity-80 hover:text-opacity-100">About Us</a></li>
                <li><a href="#services" className="text-white text-opacity-80 hover:text-opacity-100">Services</a></li>
                <li><a href="#gallery" className="text-white text-opacity-80 hover:text-opacity-100">Gallery</a></li>
                <li><a href="#contact" className="text-white text-opacity-80 hover:text-opacity-100">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Subscribe</h3>
              <p className="text-white text-opacity-80 mb-4">
                Subscribe to our newsletter to receive updates and special offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-2 rounded-l-md focus:outline-none"
                />
                <Button className="rounded-l-none" style={{ backgroundColor: styles.secondaryColor }}>
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center">
            <p className="text-white text-opacity-80">
              © {new Date().getFullYear()} {salon.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Action Button (mobile) */}
      <div className="fixed bottom-4 left-0 right-0 z-10 flex justify-center md:hidden">
        <Button 
          size="lg" 
          className="shadow-lg"
          style={{ backgroundColor: styles.primaryColor }}
        >
          <Phone className="mr-2 h-4 w-4" />
          Book Now
        </Button>
      </div>

      {/* Show Admin Bar Button */}
      {!showAdminBar && (
        <div className="fixed bottom-4 right-4 z-10">
          <Button 
            size="sm" 
            variant="secondary"
            className="shadow-lg"
            onClick={() => setShowAdminBar(true)}
          >
            Show Admin Bar
          </Button>
        </div>
      )}
    </div>
  );
}