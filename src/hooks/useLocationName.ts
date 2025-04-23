
import { useState, useEffect } from 'react';

export const useLocationName = (latitude: number | undefined, longitude: number | undefined) => {
  const [locationName, setLocationName] = useState<string>("");

  useEffect(() => {
    const fetchLocationName = async () => {
      if (!latitude || !longitude) {
        setLocationName("");
        return;
      }

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

    fetchLocationName();
  }, [latitude, longitude]);

  return locationName;
};
