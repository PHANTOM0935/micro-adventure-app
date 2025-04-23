export interface Treasure {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'treasure' | 'obstacle';
  discovered: boolean;
  distance: number;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const generateTreasures = (latitude: number, longitude: number): Treasure[] => {
  const treasures: Treasure[] = [];
  
  // Generate 3 nearby treasures (within 100m)
  for (let i = 0; i < 3; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 100; // Random distance up to 100m
    const latOffset = (distance / 111111) * Math.cos(angle);
    const lngOffset = (distance / (111111 * Math.cos(latitude * (Math.PI / 180)))) * Math.sin(angle);
    
    treasures.push({
      id: `nearby-treasure-${i}`,
      name: `Hidden Treasure ${i+1}`,
      latitude: latitude + latOffset,
      longitude: longitude + lngOffset,
      type: 'treasure',
      discovered: false,
      distance: distance
    });
  }
  
  // Generate 4 distant treasures (100-500m)
  for (let i = 0; i < 4; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = 100 + Math.random() * 400; // Random distance between 100m and 500m
    const latOffset = (distance / 111111) * Math.cos(angle);
    const lngOffset = (distance / (111111 * Math.cos(latitude * (Math.PI / 180)))) * Math.sin(angle);
    
    treasures.push({
      id: `distant-treasure-${i}`,
      name: `Distant Treasure ${i+1}`,
      latitude: latitude + latOffset,
      longitude: longitude + lngOffset,
      type: Math.random() > 0.3 ? 'treasure' : 'obstacle',
      discovered: false,
      distance: distance
    });
  }
  
  return treasures;
};

export const checkNearbyTreasures = (
  treasures: Treasure[],
  location: { latitude: number; longitude: number }
): boolean => {
  const threshold = 0.0005;
  return treasures.some(treasure => {
    const latDiff = Math.abs(treasure.latitude - location.latitude);
    const lngDiff = Math.abs(treasure.longitude - location.longitude);
    return latDiff < threshold && lngDiff < threshold;
  });
};
