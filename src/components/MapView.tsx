
import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Navigation, MapPin, Map, Compass } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Treasure {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'treasure' | 'obstacle';
  discovered: boolean;
}

interface MapViewProps {
  onOpenAR: () => void;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  setCurrentLocation: (location: {
    latitude: number;
    longitude: number;
  } | null) => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  onOpenAR, 
  currentLocation,
  setCurrentLocation 
}) => {
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [nearbyTreasure, setNearbyTreasure] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize geolocation and generate nearby treasures
  useEffect(() => {
    // Request permission for geolocation
    const initGeolocation = () => {
      if (!navigator.geolocation) {
        toast({
          variant: "destructive",
          title: "Geolocation Error",
          description: "Your browser doesn't support geolocation",
        });
        return;
      }

      // Get current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          generateTreasures(latitude, longitude);
          setIsLoading(false);
          
          // Start watching position
          const id = navigator.geolocation.watchPosition(
            (position) => {
              const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              setCurrentLocation(newLocation);
              checkNearbyTreasures(newLocation);
            },
            (error) => {
              console.error("Error watching position:", error);
            }
          );
          
          setWatchId(id);
        },
        (error) => {
          console.error("Error getting position:", error);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: `${error.message}. Please enable location services.`,
          });
          setIsLoading(false);
        }
      );
    };

    initGeolocation();

    // Cleanup
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [toast, setCurrentLocation]);

  // Generate random treasures around the current location
  const generateTreasures = (latitude: number, longitude: number) => {
    const newTreasures: Treasure[] = [];
    
    // Generate 5 random treasures
    for (let i = 0; i < 5; i++) {
      // Random offset in degrees (roughly within 100-500m)
      const latOffset = (Math.random() * 0.008 - 0.004);
      const lngOffset = (Math.random() * 0.008 - 0.004);
      
      newTreasures.push({
        id: `treasure-${i}`,
        name: `Hidden Treasure ${i+1}`,
        latitude: latitude + latOffset,
        longitude: longitude + lngOffset,
        type: Math.random() > 0.3 ? 'treasure' : 'obstacle',
        discovered: false
      });
    }
    
    setTreasures(newTreasures);
  };

  // Check if there are treasures nearby (within ~50m)
  const checkNearbyTreasures = (location: { latitude: number, longitude: number }) => {
    const threshold = 0.0005; // Roughly 50m
    const nearby = treasures.some(treasure => {
      const latDiff = Math.abs(treasure.latitude - location.latitude);
      const lngDiff = Math.abs(treasure.longitude - location.longitude);
      return latDiff < threshold && lngDiff < threshold;
    });
    
    if (nearby && !nearbyTreasure) {
      toast({
        title: "Treasure Nearby!",
        description: "You're close to a treasure. Open AR view to find it!",
        variant: "default",
      });
    }
    
    setNearbyTreasure(nearby);
  };

  // Simulate a map using CSS and positions
  const renderMap = () => {
    if (!currentLocation) return null;

    // Calculate positions based on real coordinates
    const calculatePosition = (lat: number, lng: number) => {
      if (!mapRef.current) return { top: '50%', left: '50%' };
      
      const mapWidth = mapRef.current.clientWidth;
      const mapHeight = mapRef.current.clientHeight;
      
      // Simple offset calculation (this would use proper projection in a real app)
      const latDiff = lat - currentLocation.latitude;
      const lngDiff = lng - currentLocation.longitude;
      
      // Convert to pixels (scaled to fit the view)
      const scale = 50000; // Adjust based on zoom level
      const x = mapWidth / 2 + lngDiff * scale;
      const y = mapHeight / 2 - latDiff * scale; // Negative because lat increases northward
      
      return {
        top: `${y}px`, 
        left: `${x}px`
      };
    };

    return (
      <div ref={mapRef} className="relative bg-treasure-dark/80 w-full h-full overflow-hidden">
        {/* Map grid lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="border border-treasure-accent/10"></div>
          ))}
        </div>
        
        {/* Current location marker */}
        <div 
          className="absolute w-6 h-6 rounded-full bg-treasure-accent z-10"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute inset-0 bg-treasure-accent rounded-full animate-pulse-ring"></div>
          <div className="absolute inset-1 bg-white rounded-full"></div>
        </div>
        
        {/* Treasure markers */}
        {treasures.map(treasure => {
          const position = calculatePosition(treasure.latitude, treasure.longitude);
          return (
            <div 
              key={treasure.id}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center
                ${treasure.type === 'treasure' ? 'bg-treasure-DEFAULT' : 'bg-destructive'} 
                transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-float`}
              style={position}
            >
              {treasure.type === 'treasure' ? (
                <div className="w-5 h-5 text-white">🗝️</div>
              ) : (
                <div className="w-5 h-5 text-white">⚠️</div>
              )}
            </div>
          );
        })}

        {/* Decoration elements */}
        <div className="absolute top-16 left-16 w-24 h-24 rounded-full border-2 border-treasure-accent/20 animate-spin-slow"></div>
        <div className="absolute bottom-24 right-32 w-16 h-16 rounded-full border border-treasure-secondary/30 animate-spin-slow"></div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div className="absolute inset-0 bg-treasure-dark">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-t-treasure-DEFAULT rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading map...</p>
              <p className="text-white/70 text-sm">Please enable location services</p>
            </div>
          </div>
        ) : (
          renderMap()
        )}
      </div>

      {/* UI Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white/10 backdrop-blur-sm shadow-lg"
          onClick={() => {
            if (currentLocation) {
              setCurrentLocation({...currentLocation});
              toast({
                title: "Location Updated",
                description: "Map has been centered to your current location",
              });
            }
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

      {/* AR Button - Only show when treasure is nearby */}
      <div className="absolute bottom-8 left-0 right-0 px-4 flex justify-center">
        <Button 
          className={`${nearbyTreasure ? 'bg-treasure-DEFAULT hover:bg-treasure-secondary' : 'bg-gray-400'} text-white font-bold py-4 px-8 rounded-full shadow-lg flex items-center justify-center transition-all w-full max-w-md`}
          onClick={onOpenAR}
          disabled={!nearbyTreasure}
        >
          <Camera className="mr-2 h-5 w-5" />
          {nearbyTreasure ? 'Treasure Nearby! Open AR View' : 'No Treasures Nearby'}
        </Button>
      </div>

      {/* Compass */}
      <div className="absolute top-4 left-4">
        <div className="bg-black/30 p-2 rounded-full backdrop-blur-md">
          <Compass className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default MapView;
