
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface Location {
  latitude: number;
  longitude: number;
}

export const useGeolocation = (
  onLocationChange?: (location: Location) => void
) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [watchId, setWatchId] = useState<number | null>(null);
  const { toast } = useToast();

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
          const newLocation = { latitude, longitude };
          setCurrentLocation(newLocation);
          onLocationChange?.(newLocation);
          setIsLoading(false);
          
          const id = navigator.geolocation.watchPosition(
            (position) => {
              const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              setCurrentLocation(newLocation);
              onLocationChange?.(newLocation);
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
  }, [toast, onLocationChange]);

  return { currentLocation, isLoading };
};
