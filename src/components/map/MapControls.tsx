
import React from 'react';
import { Button } from "@/components/ui/button";
import { Navigation, Map, Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MapControlsProps {
  onCenter: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ onCenter }) => {
  const { toast } = useToast();

  return (
    <>
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white/10 backdrop-blur-sm shadow-lg"
          onClick={() => {
            onCenter();
            toast({
              title: "Location Updated",
              description: "Map has been centered to your current location",
            });
          }}
        >
          <Navigation className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white/10 backdrop-blur-sm shadow-lg"
        >
          <Map className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute top-4 left-4">
        <div className="bg-black/30 p-2 rounded-full backdrop-blur-md">
          <Compass className="h-6 w-6 text-white" />
        </div>
      </div>
    </>
  );
};
