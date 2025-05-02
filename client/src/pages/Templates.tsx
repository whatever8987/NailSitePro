import { TopNavigation } from "@/components/layout/TopNavigation";
import { useQuery } from "@tanstack/react-query";
import { User, Template } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, CheckCircle, EyeIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Templates() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const { data: user, isLoading: isLoadingUser } = useQuery<User | null>({
    queryKey: ["/api/user/me"],
    retry: false,
  });

  const { data: templates, isLoading: isLoadingTemplates } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    retry: false,
  });

  const isLoggedIn = !!user;

  const handleTemplateSelect = (templateId: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please log in to select a template",
        variant: "destructive"
      });
      navigate("/login?redirect=/templates");
      return;
    }
    
    setSelectedTemplate(templateId);
    toast({
      title: "Template selected",
      description: "This template will be used for your new website",
    });
  };

  const handleTemplatePreview = async (templateId: number) => {
    try {
      // Fetch the template preview data
      const response = await fetch(`/api/templates/${templateId}/preview`);
      if (!response.ok) {
        throw new Error('Failed to load template preview');
      }
      
      const salonPreview = await response.json();
      
      // Navigate to the sample site page with the preview data
      window.open(`/demo/${salonPreview.sampleUrl}`, '_blank');
    } catch (error) {
      toast({
        title: "Preview error",
        description: "Could not load the template preview. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      navigate(`/portal?template=${selectedTemplate}`);
    } else {
      toast({
        title: "No template selected",
        description: "Please select a template to continue",
        variant: "destructive"
      });
    }
  };

  if (isLoadingUser || isLoadingTemplates) {
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Website Template</h1>
          <p className="mt-2 text-xl text-gray-600">
            Select from our professionally designed templates optimized for nail salons
          </p>
        </div>

        {templates && templates.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`overflow-hidden transition-all ${selectedTemplate === template.id ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img 
                      src={template.previewImageUrl} 
                      alt={template.name} 
                      className="object-cover w-full h-[200px]"
                    />
                    {template.isMobileOptimized && (
                      <Badge className="absolute top-2 right-2 bg-primary">
                        Mobile-optimized
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {template.features && template.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTemplatePreview(template.id)}
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleTemplateSelect(template.id)}
                      variant={selectedTemplate === template.id ? "default" : "secondary"}
                    >
                      {selectedTemplate === template.id ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Selected
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Select
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {selectedTemplate && (
              <div className="mt-10 flex justify-center">
                <Button size="lg" onClick={handleContinue}>
                  Continue with Selected Template
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}