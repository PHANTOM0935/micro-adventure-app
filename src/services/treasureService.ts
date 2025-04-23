
export interface Treasure {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'treasure' | 'obstacle';
  discovered: boolean;
}

export const generateTreasures = (latitude: number, longitude: number): Treasure[] => {
  const treasures: Treasure[] = [];
  
  for (let i = 0; i < 5; i++) {
    const latOffset = (Math.random() * 0.008 - 0.004);
    const lngOffset = (Math.random() * 0.008 - 0.004);
    
    treasures.push({
      id: `treasure-${i}`,
      name: `Hidden Treasure ${i+1}`,
      latitude: latitude + latOffset,
      longitude: longitude + lngOffset,
      type: Math.random() > 0.3 ? 'treasure' : 'obstacle',
      discovered: false
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
