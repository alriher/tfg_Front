import React, { useRef, useEffect, useState } from 'react';

interface SpaceMapProps {
  lat: number;
  lng: number;
  onLocationChange?: (lat: number, lng: number) => void;
}

const containerStyle = {
  width: '100%',
  height: '300px',
};

export default function SpaceMap({lat, lng, onLocationChange}: SpaceMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const inputRef = useRef<HTMLInputElement>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [map, setMap] = useState<any>(null);

  // Inicializa el mapa y el autocompletado manualmente
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;
    if (!mapDivRef.current || !inputRef.current) return;
    // Solo inicializar una vez
    if (map && autocomplete) return;

    // Inicializar mapa si no existe
    let mapInstance = map;
    if (!mapInstance) {
      mapInstance = new window.google.maps.Map(mapDivRef.current, {
        center: { lat, lng },
        zoom: 15,
        gestureHandling: 'auto',
        disableDefaultUI: false,
      });
      setMap(mapInstance);
    }

    // Inicializar Autocomplete
    let autocompleteInstance = autocomplete;
    if (!autocompleteInstance) {
      autocompleteInstance = new window.google.maps.places.Autocomplete(inputRef.current);
      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place && place.geometry && place.geometry.location && onLocationChange) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          onLocationChange(lat, lng);
          mapInstance.panTo({ lat, lng });
        }
      });
      setAutocomplete(autocompleteInstance);
    }
  }, [lat, lng, onLocationChange, map, autocomplete]);

  // Actualiza el centro del mapa si cambian lat/lng externamente
  useEffect(() => {
    if (map) {
      map.setCenter({ lat, lng });
    }
  }, [lat, lng, map]);

  // Añadir marcador y click en el mapa para seleccionar ubicación
  useEffect(() => {
    if (!map) return;
    let marker = new window.google.maps.Marker({
      position: { lat, lng },
      map,
      draggable: !!onLocationChange,
    });

    // Actualizar posición del marcador si cambian lat/lng
    marker.setPosition({ lat, lng });

    // Permitir arrastrar el marcador
    if (onLocationChange) {
      marker.addListener('dragend', (e: any) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        onLocationChange(newLat, newLng);
      });
    }

    // Permitir seleccionar ubicación haciendo click en el mapa
    if (onLocationChange) {
      const clickListener = map.addListener('click', (e: any) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        onLocationChange(newLat, newLng);
      });
      // Limpiar listener al desmontar o cambiar
      return () => {
        window.google.maps.event.removeListener(clickListener);
        marker.setMap(null);
      };
    } else {
      // Limpiar marcador si no hay onLocationChange
      return () => {
        marker.setMap(null);
      };
    }
  }, [map, lat, lng, onLocationChange]);

  if (!apiKey) {
    return <div>No se ha configurado la API Key de Google Maps</div>;
  }

  return (
    <div style={{...containerStyle, position: 'relative'}}>
      {/* Barra de búsqueda sobre el mapa */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar dirección o lugar"
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 2,
          width: '80%',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          fontSize: '16px'
        }}
      />
      {/* Mapa manual */}
      <div
        ref={mapDivRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}