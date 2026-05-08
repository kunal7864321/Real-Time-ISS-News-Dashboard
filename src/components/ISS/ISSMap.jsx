import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const ISSIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 30],
  iconAnchor: [25, 15],
  popupAnchor: [0, -15],
});

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

export const ISSMap = ({ position, path, speed }) => {
  if (!position) return <div className="h-64 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-xl">Loading Map...</div>;

  return (
    <div className="h-full min-h-[300px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
      <MapContainer 
        center={[position.latitude, position.longitude]} 
        zoom={3} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={position.latitude} lng={position.longitude} />
        
        {path.length > 1 && <Polyline positions={path} color="red" weight={3} opacity={0.7} />}
        
        <Marker position={[position.latitude, position.longitude]} icon={ISSIcon}>
          <Popup>
            <div className="text-sm font-semibold">
              ISS Location<br/>
              Lat: {position.latitude.toFixed(4)}<br/>
              Lon: {position.longitude.toFixed(4)}<br/>
              Speed: {speed.toFixed(2)} km/h
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
