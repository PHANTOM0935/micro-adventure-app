
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, User, Eye } from "lucide-react";
import MapView from "@/components/MapView";
import ARView from "@/components/ARView";
import Tutorial from "@/components/Tutorial";
import ProfileSection from "@/components/ProfileSection";
import Loading from "@/components/Loading";

const Index = () => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [showAR, setShowAR] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [treasuresFound, setTreasuresFound] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const { toast } = useToast();
  
  // Simulate app loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle AR view
  const handleOpenAR = () => {
    if (currentLocation) {
      setShowAR(true);
    } else {
      toast({
        variant: "destructive",
        title: "Location Required",
        description: "Please enable location services to use AR features",
      });
    }
  };

  const handleCloseAR = () => {
    setShowAR(false);
    // Simulate finding a treasure
    setTreasuresFound(prev => prev + 1);
  };

  // Handle tutorial completion
  const handleTutorialComplete = () => {
    setShowTutorial(false);
    toast({
      title: "Tutorial Completed",
      description: "Start exploring to find treasures!",
    });
  };

  // Reset progress
  const handleReset = () => {
    setTreasuresFound(0);
    setShowProfile(false);
    toast({
      title: "Progress Reset",
      description: "All progress has been reset",
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-treasure-dark">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="h-full relative">
          {/* Map View */}
          <MapView 
            onOpenAR={handleOpenAR} 
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
          />

          {/* Header UI */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
            <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-treasure-DEFAULT" />
              <span className="text-sm">GeoTreasure Hunt</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white flex items-center">
                <span className="text-sm">🗝️ {treasuresFound}</span>
              </div>
              <Button 
                variant="secondary"
                size="icon"
                className="rounded-full bg-black/30 backdrop-blur-sm text-white"
                onClick={() => setShowProfile(true)}
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Tutorial button */}
          <div className="absolute bottom-24 right-4">
            <Button 
              variant="secondary"
              size="icon"
              className="rounded-full bg-black/30 backdrop-blur-sm text-white"
              onClick={() => setShowTutorial(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Overlays */}
          {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
          {showAR && <ARView onClose={handleCloseAR} currentLocation={currentLocation} />}
          {showProfile && (
            <ProfileSection 
              onClose={() => setShowProfile(false)}
              treasuresFound={treasuresFound}
              onReset={handleReset}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
