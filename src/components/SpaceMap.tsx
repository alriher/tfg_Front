import React from 'react';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

interface SpaceMapProps {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: '100%',
  height: '300px',
};

export default function SpaceMap({lat, lng}: SpaceMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <div>No se ha configurado la API Key de Google Maps</div>;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div style={containerStyle}>
        <Map
          defaultCenter={{lat, lng}}
          defaultZoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          style={{width: '100%', height: '100%'}}
        >
          <Marker position={{lat, lng}} />
        </Map>
      </div>
    </APIProvider>
  );
}