// Haversine formula to calculate distance between two coordinates in kilometers
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Calculate speed in km/h given two positions and time difference in seconds
export const calculateSpeed = (pos1, pos2, timeDiffSeconds) => {
  if (!pos1 || !pos2 || timeDiffSeconds <= 0) return 0;
  
  const distance = calculateDistance(
    pos1.latitude, pos1.longitude,
    pos2.latitude, pos2.longitude
  );
  
  const timeHours = timeDiffSeconds / 3600;
  return distance / timeHours;
};
