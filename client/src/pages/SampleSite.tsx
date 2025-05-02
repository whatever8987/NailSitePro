import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Salon, Template } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Mail, Phone, MapPin, ArrowLeft, ExternalLink } from "lucide-react";

export default function SampleSite() {
  const { salonName, city } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isPreview, setIsPreview] = useState(false);

  const sampleUrl = `${salonName}-${city}`;

  // Get salon data from the API
  const { data: salon, isLoading: isLoadingSalon } = useQuery<Salon>({
    queryKey: [`/api/salons/sample/${sampleUrl}`],
  });

  // Get template data
  const { data: template, isLoading: isLoadingTemplate } = useQuery<Template>({
    queryKey: [`/api/templates/${salon?.templateId}`],
    enabled: !!salon?.templateId,
  });

  useEffect(() => {
    // Check if this is a preview mode from URL params
    const urlParams = new URLSearchParams(window.location.search);
    setIsPreview(urlParams.get("preview") === "true");
    
    // Validate salon exists
    if (!isLoadingSalon && !salon) {
      toast({
        title: "Sample site not found",
        description: "The requested sample site does not exist.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [salon, isLoadingSalon, toast, navigate]);

  if (isLoadingSalon || isLoadingTemplate) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!salon) {
    return null; // Will redirect in useEffect
  }

  // Mock services if none provided
  const services = salon.services?.length 
    ? salon.services 
    : ["Manicure", "Pedicure", "Gel Nails", "Nail Art", "Acrylics", "Waxing"];

  return (
    <div className="bg-white min-h-screen">
      {/* Preview Controls - only shown in preview mode */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-3 z-50 flex justify-between items-center">
          <div className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Sample Website Preview</span>
          </div>
          <div>
            <Button size="sm" variant="outline" className="text-white border-white hover:bg-gray-800">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in new tab
            </Button>
          </div>
        </div>
      )}

      {/* Header/Nav */}
      <header className={`bg-primary text-white ${isPreview ? 'pt-16' : 'pt-0'}`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{salon.name}</h1>
              <p className="text-sm md:text-base mt-1">{salon.location}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="secondary" className="text-primary font-semibold">
                Book Appointment
              </Button>
            </div>
          </div>
          <nav className="mt-6">
            <ul className="flex space-x-6 justify-center md:justify-start">
              <li><a href="#home" className="hover:underline">Home</a></li>
              <li><a href="#services" className="hover:underline">Services</a></li>
              <li><a href="#gallery" className="hover:underline">Gallery</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1600975324106-9076e4e7a08f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80')`,
            filter: 'brightness(0.8)'
          }}
        ></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-lg text-white">
            <h2 className="text-4xl font-bold mb-4">Welcome to {salon.name}</h2>
            <p className="text-xl mb-6">Exceptional nail care and beauty services in {salon.location}</p>
            <Button size="lg">
              Book Your Appointment
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                At {salon.name}, we are dedicated to providing exceptional nail care and beauty services in a relaxing, upscale environment. 
                Our highly trained technicians use only premium products to ensure quality results that exceed your expectations.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We prioritize hygiene and sanitation with hospital-grade sterilization procedures for all tools and equipment. 
                Your safety and satisfaction are our top priorities.
              </p>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <div>
                  <h4 className="font-semibold">Business Hours</h4>
                  <p className="text-sm text-gray-600">Mon-Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Interior of nail salon" 
                className="object-cover h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1607779097040-28d40d9b088a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80`} 
                    alt={service} 
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service}</h3>
                  <p className="text-gray-600 mb-4">
                    Premium {service.toLowerCase()} services customized to your preferences and needs.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-semibold">From $35</span>
                    <Button variant="outline" size="sm">Book Now</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Work</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="relative h-48 overflow-hidden rounded-lg">
                <img 
                  src={`https://images.unsplash.com/photo-1601051822935-69c1d7bb2746?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80`} 
                  alt={`Nail design sample ${item}`} 
                  className="object-cover h-full w-full transition-transform duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline">View Full Gallery</Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-gray-600">{salon.phoneNumber || "(305) 555-1234"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-gray-600">{salon.email || "contact@example.com"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <p className="text-gray-600">{salon.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium">Hours</h4>
                    <p className="text-gray-600">Mon-Sat: 9:00 AM - 7:00 PM</p>
                    <p className="text-gray-600">Sun: 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" id="name" className="w-full p-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" className="w-full p-2 border border-gray-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" id="phone" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea id="message" rows={4} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
                </div>
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{salon.name}</h3>
              <p className="mb-4">Premium nail salon in {salon.location} providing exceptional services in a relaxing environment.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-primary">Home</a></li>
                <li><a href="#services" className="hover:text-primary">Services</a></li>
                <li><a href="#gallery" className="hover:text-primary">Gallery</a></li>
                <li><a href="#contact" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
              <p className="mb-4">Call us at {salon.phoneNumber || "(305) 555-1234"} or book online.</p>
              <Button>Book Now</Button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} {salon.name}. All rights reserved.</p>
            <p className="text-sm mt-2">
              This is a sample website created by SalonSite. 
              <a href="#" className="text-primary hover:underline ml-1">Claim this website</a> if you are the owner.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
