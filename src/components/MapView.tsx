import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLocationName } from '@/hooks/useLocationName';
import { MapControls } from './map/MapControls';
import { LocationInfo } from './map/LocationInfo';
import { generateTreasures, checkNearbyTreasures, type Treasure } from '@/services/treasureService';

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
  const [nearbyTreasure, setNearbyTreasure] = useState(false);
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { isLoading } = useGeolocation((location) => {
    setCurrentLocation(location);
    if (!treasures.length && location) {
      setTreasures(generateTreasures(location.latitude, location.longitude));
    }
    if (location) {
      const nearby = checkNearbyTreasures(treasures, location);
      if (nearby && !nearbyTreasure) {
        toast({
          title: "Treasure Nearby!",
          description: "You're close to a treasure. Open AR view to find it!",
          variant: "default",
        });
      }
      setNearbyTreasure(nearby);
    }
  });

  const locationName = useLocationName(
    currentLocation?.latitude,
    currentLocation?.longitude
  );

  const calculatePosition = (lat: number, lng: number) => {
    if (!mapRef.current || !currentLocation) return { top: '50%', left: '50%' };
    
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

  const calculatePath = (treasure: Treasure) => {
    if (!currentLocation) return [];
    
    const points = 5;
    const path = [];
    
    for (let i = 0; i <= points; i++) {
      const fraction = i / points;
      const lat = currentLocation.latitude + (treasure.latitude - currentLocation.latitude) * fraction;
      const lng = currentLocation.longitude + (treasure.longitude - currentLocation.longitude) * fraction;
      path.push({ lat, lng });
    }
    
    return path;
  };

  const renderMap = () => {
    if (!currentLocation) return null;

    return (
      <div ref={mapRef} className="relative w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-treasure-dark/95 to-treasure-dark">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-treasure-accent/10"></div>
            ))}
          </div>
        </div>

        <LocationInfo 
          locationName={locationName}
          currentLocation={currentLocation}
        />
        
        <div 
          className="absolute w-12 h-12 z-10"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute inset-0 bg-treasure-accent/20 rounded-full animate-pulse"></div>
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-treasure-accent">
              <span className="text-2xl">🧙‍♂️</span>
            </div>
          </div>
        </div>
        
        {treasures.map(treasure => {
          const position = calculatePosition(treasure.latitude, treasure.longitude);
          const isSelected = selectedTreasure?.id === treasure.id;
          
          return (
            <React.Fragment key={treasure.id}>
              {isSelected && (
                <>
                  {calculatePath(treasure).map((point, index) => {
                    const pointPos = calculatePosition(point.lat, point.lng);
                    return (
                      <div
                        key={`path-${index}`}
                        className="absolute w-2 h-2 bg-treasure-accent rounded-full animate-pulse"
                        style={{
                          ...pointPos,
                          transform: 'translate(-50%, -50%)',
                          opacity: 0.6,
                        }}
                      />
                    );
                  })}
                </>
              )}
              
              <div 
                onClick={() => setSelectedTreasure(isSelected ? null : treasure)}
                className={`absolute w-10 h-10 rounded-full flex items-center justify-center
                  ${treasure.type === 'treasure' ? 'bg-treasure-DEFAULT hover:bg-treasure-secondary' : 'bg-destructive hover:bg-destructive/80'} 
                  transform -translate-x-1/2 -translate-y-1/2 shadow-lg cursor-pointer
                  ${isSelected ? 'ring-4 ring-treasure-accent animate-bounce' : 'animate-float'}`}
                style={position}
              >
                {treasure.type === 'treasure' ? (
                  <div className="w-6 h-6 text-white flex items-center justify-center">
                    🗝️
                  </div>
                ) : (
                  <div className="w-6 h-6 text-white flex items-center justify-center">
                    ⚠️
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}

        <div className="absolute top-16 left-16 w-24 h-24 rounded-full border-2 border-treasure-accent/20 animate-spin-slow"></div>
        <div className="absolute bottom-24 right-32 w-16 h-16 rounded-full border border-treasure-secondary/30 animate-spin-slow"></div>

        <MapControls 
          onCenter={() => currentLocation && setCurrentLocation({...currentLocation})}
        />
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
    </div>
  );
};

export default MapView;
