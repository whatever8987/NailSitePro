import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Template } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Phone, Copy } from "lucide-react";

interface WebsitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template;
  siteData?: {
    id: number;
    name: string;
    location: string;
    sampleUrl: string;
  };
}

export function WebsitePreviewModal({ 
  isOpen, 
  onClose, 
  template, 
  siteData 
}: WebsitePreviewModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    if (siteData) {
      // Would redirect to edit page
      toast({
        title: "Redirecting to editor",
        description: `Preparing to edit ${siteData.name}`,
      });
    } else {
      toast({
        title: "Template Preview",
        description: "This is just a template preview. Generate a site to edit.",
      });
    }
  };

  const handleContact = () => {
    if (siteData) {
      // Would open contact form/modal
      toast({
        title: "Contact Form",
        description: "Opening contact form for this salon.",
      });
    } else {
      toast({
        title: "Template Preview",
        description: "This is just a template preview.",
      });
    }
  };

  const handleCopyUrl = () => {
    if (siteData) {
      navigator.clipboard.writeText(`https://salonsite.com/demo/${siteData.sampleUrl}`);
      toast({
        title: "URL Copied",
        description: "Sample site URL has been copied to clipboard.",
      });
    } else {
      toast({
        title: "Template Preview",
        description: "This is just a template preview. No URL to copy.",
      });
    }
  };

  const titleText = siteData 
    ? `Sample Website: ${siteData.name} - ${siteData.location}`
    : `Template Preview: ${template.name}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 h-[600px] border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <iframe
              src={siteData ? `/demo/${siteData.sampleUrl}?preview=true` : "/templates/preview"}
              className="w-full h-full"
              title={titleText}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <div className="flex space-x-2">
            <Button variant="default" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Sample
            </Button>
            <Button variant="outline" onClick={handleContact}>
              <Phone className="mr-2 h-4 w-4" />
              Contact Salon
            </Button>
          </div>
          <Button variant="outline" onClick={handleCopyUrl}>
            <Copy className="mr-2 h-4 w-4" />
            Copy URL
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
