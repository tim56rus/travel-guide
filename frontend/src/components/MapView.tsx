import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibHVpc2FhaWtvIiwiYSI6ImNtOW9taGNmeDEzaXYyanE3NTE5Y2N2ZWoifQ.6y-DqLfpxyAK-IjditBnkQ';

type MapViewProps = {
  location: string;
};

const MapView: React.FC<MapViewProps> = ({ location }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [city, setCity] = useState('');
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const initializeMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-81.19861, 28.59861], // Default center (UCF)
        zoom: 10,
      });

      setMap(initializeMap);

      return () => {
        initializeMap.remove();
      };
    }
  }, []);

  const fetchAndDisplayLocation = async (loc: string) => {
    if (!loc || !map) return;

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        loc
      )}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].geometry.coordinates;
      map.flyTo({ center: [lng, lat], zoom: 13 });

      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
    }
  };

  useEffect(() => {
    fetchAndDisplayLocation(location);
  }, [location, map]);

  const handleSearch = () => {
    fetchAndDisplayLocation(city);
  };

  const handleBackToLocation = () => {
    fetchAndDisplayLocation(location);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city"
        style={{ padding: '0.5rem', width: '200px', marginRight: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '0.5rem 1rem', marginRight: '10px' }}>
        Show on Map
      </button>
      <button onClick={handleBackToLocation} style={{ padding: '0.5rem 1rem', backgroundColor: '#acd3a8', border: 'none', borderRadius: '50px', fontWeight: 500 }}>
        Back to Location
      </button>
      <div
        ref={mapContainerRef}
        style={{ height: '500px', marginTop: '20px', borderRadius: '8px' }}
      />
    </div>
  );
};

export default MapView;
