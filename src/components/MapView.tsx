import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Navigation, MapPin, Map, Compass } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

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
  const [locationName, setLocationName] = useState<string>("");
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const fetchLocationName = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      const data = await response.json();
      const place = data.display_name.split(',').slice(0, 2).join(',');
      setLocationName(place);
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocationName("Unknown Location");
    }
  };

  useEffect(() => {
    const initGeolocation = () => {
      if (!navigator.geolocation) {
        toast({
          variant: "destructive",
          title: "Geolocation Error",
          description: "Your browser doesn't support geolocation",
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          fetchLocationName(latitude, longitude);
          generateTreasures(latitude, longitude);
          setIsLoading(false);
          
          const id = navigator.geolocation.watchPosition(
            (position) => {
              const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              setCurrentLocation(newLocation);
              fetchLocationName(newLocation.latitude, newLocation.longitude);
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

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [toast, setCurrentLocation]);

  const generateTreasures = (latitude: number, longitude: number) => {
    const newTreasures: Treasure[] = [];
    
    for (let i = 0; i < 5; i++) {
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

  const checkNearbyTreasures = (location: { latitude: number, longitude: number }) => {
    const threshold = 0.0005;
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

  const renderMap = () => {
    if (!currentLocation) return null;

    const calculatePosition = (lat: number, lng: number) => {
      if (!mapRef.current) return { top: '50%', left: '50%' };
      
      const mapWidth = mapRef.current.clientWidth;
      const mapHeight = mapRef.current.clientHeight;
      
      const latDiff = lat - currentLocation.latitude;
      const lngDiff = lng - currentLocation.longitude;
      
      const scale = 50000;
      const x = mapWidth / 2 + lngDiff * scale;
      const y = mapHeight / 2 - latDiff * scale;
      
      return {
        top: `${y}px`, 
        left: `${x}px`
      };
    };

    return (
      <div ref={mapRef} className="relative w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-treasure-dark/95 to-treasure-dark">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-treasure-accent/10"></div>
            ))}
          </div>
        </div>

        <div className="absolute top-20 left-4 right-4 z-10">
          <Badge variant="treasure" className="text-sm px-4 py-2 mb-2">
            Current Location
          </Badge>
          <h2 className="text-white text-xl font-semibold mb-1 truncate">
            {locationName || "Locating..."}
          </h2>
          {currentLocation && (
            <p className="text-white/70 text-sm">
              {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </p>
          )}
        </div>
        
        <div 
          className="absolute w-6 h-6 rounded-full bg-treasure-accent z-10"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute inset-0 bg-treasure-accent rounded-full animate-pulse-ring"></div>
          <div className="absolute inset-1 bg-white rounded-full"></div>
        </div>
        
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

        <div className="absolute top-16 left-16 w-24 h-24 rounded-full border-2 border-treasure-accent/20 animate-spin-slow"></div>
        <div className="absolute bottom-24 right-32 w-16 h-16 rounded-full border border-treasure-secondary/30 animate-spin-slow"></div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
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

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full bg-white/10 backdrop-blur-sm shadow-lg"
          onClick={() => {
            if (currentLocation) {
              setCurrentLocation({...currentLocation});
              fetchLocationName(currentLocation.latitude, currentLocation.longitude);
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

      <div className="absolute top-4 left-4">
        <div className="bg-black/30 p-2 rounded-full backdrop-blur-md">
          <Compass className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default MapView;
