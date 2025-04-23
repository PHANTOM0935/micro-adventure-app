
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface LocationInfoProps {
  locationName: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

export const LocationInfo: React.FC<LocationInfoProps> = ({ 
  locationName, 
  currentLocation 
}) => {
  return (
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
  );
};
