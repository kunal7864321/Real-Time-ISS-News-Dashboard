import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { calculateSpeed } from '../utils/haversine';
import { formatTime } from '../utils/formatDate';
import toast from 'react-hot-toast';

export const useISS = () => {
  const [data, setData] = useState({
    position: null,
    locationName: 'Loading...',
    speed: 0,
    peopleCount: 0,
    peopleNames: [],
    path: [], // last 15 positions
    speedHistory: [], // last 30 speed measurements with timestamps
    readingsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const prevPositionRef = useRef(null);

  const fetchISSData = useCallback(async (isManual = false) => {
    // Prevent rapid double-fetching (e.g., from React StrictMode)
    const nowMs = Date.now();
    if (!isManual && prevPositionRef.current && (nowMs - prevPositionRef.current.timestamp) < 5000) {
      return; // Skip if less than 5 seconds since last fetch
    }

    try {
      // Only show loading if we don't have data yet
      if (!prevPositionRef.current) setLoading(true);
      setError(null);
      
      const [posRes, astrosRes] = await Promise.all([
        axios.get('/api/iss/iss-now.json'),
        axios.get('/api/iss/astros.json')
      ]);

      const { latitude, longitude } = posRes.data.iss_position;
      const currentPos = { 
        latitude: parseFloat(latitude), 
        longitude: parseFloat(longitude) 
      };

      // Reverse geocode
      let locationName = 'Ocean / Unknown';
      try {
        const geoRes = await axios.get(
          `/api/geo/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          { headers: { 'User-Agent': 'NexusDashboard/1.0' } }
        );
        if (geoRes.data.display_name) {
          locationName = geoRes.data.address.country || geoRes.data.address.state || geoRes.data.name || 'Ocean';
        }
      } catch (e) {
        // nominatim might rate limit or fail, silently fallback to Ocean
      }

      const now = new Date();
      let currentSpeed = 27600; // default approximate speed
      
      if (prevPositionRef.current) {
        const timeDiff = (now.getTime() - prevPositionRef.current.timestamp) / 1000;
        const calcSpeed = calculateSpeed(prevPositionRef.current.pos, currentPos, timeDiff);
        if (calcSpeed > 0 && calcSpeed < 35000) {
          currentSpeed = calcSpeed;
        }
      }
      
      prevPositionRef.current = { pos: currentPos, timestamp: now.getTime() };

      const astros = astrosRes.data.people.filter(p => p.craft === 'ISS').map(p => p.name);

      setData(prev => {
        const newPath = [...prev.path, [currentPos.latitude, currentPos.longitude]].slice(-15);
        const newSpeedHistory = [
          ...prev.speedHistory, 
          { time: formatTime(now), speed: currentSpeed }
        ].slice(-30);

        return {
          position: currentPos,
          locationName,
          speed: currentSpeed,
          peopleCount: astros.length,
          peopleNames: astros,
          path: newPath,
          speedHistory: newSpeedHistory,
          readingsCount: prev.readingsCount + 1
        };
      });

      if (isManual) toast.success('ISS data updated');
      setCountdown(15);
    } catch (err) {
      console.warn('ISS API Error:', err.message);
      // Only show error if we have NO previous data. If we have data, just skip silently.
      if (!prevPositionRef.current) {
        setError(err.message || 'Failed to fetch ISS data');
        toast.error('Failed to update ISS data');
      } else if (err?.response?.status === 429) {
        if (isManual) toast.error('Rate limited. Please wait.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchISSData();
    const interval = setInterval(() => {
      fetchISSData();
    }, 15000);

    const countdownInterval = setInterval(() => {
      setCountdown(c => (c > 0 ? c - 1 : 15));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [fetchISSData]);

  return { data, loading, error, countdown, refetch: () => fetchISSData(true) };
};
