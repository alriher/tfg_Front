import { useRef, useEffect } from 'react';

interface SpaceMapProps {
  lat: number;
  lng: number;
  onLocationChange?: (lat: number, lng: number) => void;
}

const containerStyle = {
  width: '100%',
  height: '300px',
};

export default function SpaceMap({ lat, lng, onLocationChange }: SpaceMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const inputRef = useRef<HTMLInputElement>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const autocompleteInstance = useRef<any>(null);

  // Inicializar mapa y Autocomplete solo una vez
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      // Esperar a que la API esté disponible
      const interval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places && mapDivRef.current) {
          clearInterval(interval);
          if (!mapInstance.current) {
            mapInstance.current = new window.google.maps.Map(mapDivRef.current, {
              center: { lat, lng },
              zoom: 15,
              gestureHandling: 'auto',
              disableDefaultUI: false,
            });
          }
          if (onLocationChange && !autocompleteInstance.current && inputRef.current) {
            autocompleteInstance.current = new window.google.maps.places.Autocomplete(inputRef.current);
            autocompleteInstance.current.addListener('place_changed', () => {
              const place = autocompleteInstance.current.getPlace();
              if (place && place.geometry && place.geometry.location && onLocationChange) {
                const newLat = place.geometry.location.lat();
                const newLng = place.geometry.location.lng();
                onLocationChange(newLat, newLng);
                mapInstance.current.panTo({ lat: newLat, lng: newLng });
              }
            });
          }
        }
      }, 200);
      return () => clearInterval(interval);
    }
    if (!mapDivRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapDivRef.current, {
        center: { lat, lng },
        zoom: 15,
        gestureHandling: 'auto',
        disableDefaultUI: false,
      });
    }
    if (onLocationChange && !autocompleteInstance.current && inputRef.current) {
      autocompleteInstance.current = new window.google.maps.places.Autocomplete(inputRef.current);
      autocompleteInstance.current.addListener('place_changed', () => {
        const place = autocompleteInstance.current.getPlace();
        if (place && place.geometry && place.geometry.location && onLocationChange) {
          const newLat = place.geometry.location.lat();
          const newLng = place.geometry.location.lng();
          onLocationChange(newLat, newLng);
          mapInstance.current.panTo({ lat: newLat, lng: newLng });
        }
      });
    }
  }, [apiKey, onLocationChange]);

  // Log para saber si la API de Google Maps está cargada
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      console.log("Google Maps API cargada");
    } else {
      console.log("Google Maps API NO cargada");
    }
  }, []);

  // Mantener el centro del mapa sincronizado con lat/lng
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setCenter({ lat, lng });
    }
  }, [lat, lng]);

  // Manejar el marcador y los listeners de interacción
  useEffect(() => {
    if (!mapInstance.current) return;
    // Eliminar marcador anterior si existe
    if (markerInstance.current) {
      markerInstance.current.setMap(null);
    }
    markerInstance.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstance.current,
      draggable: !!onLocationChange,
    });
    // Listener para arrastrar el marcador
    if (onLocationChange) {
      markerInstance.current.addListener('dragend', (e: any) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        onLocationChange(newLat, newLng);
      });
      // Listener para click en el mapa
      const clickListener = mapInstance.current.addListener('click', (e: any) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        onLocationChange(newLat, newLng);
      });
      // Limpiar listeners al desmontar
      return () => {
        window.google.maps.event.removeListener(clickListener);
        if (markerInstance.current) markerInstance.current.setMap(null);
      };
    } else {
      // Limpiar marcador si no hay onLocationChange
      return () => {
        if (markerInstance.current) markerInstance.current.setMap(null);
      };
    }
  }, [lat, lng, onLocationChange]);

  if (!apiKey) {
    return <div>No se ha configurado la API Key de Google Maps</div>;
  }

  return (
    <div style={{ ...containerStyle, position: 'relative' }}>
      {/* Barra de búsqueda sobre el mapa, solo si se permite */}
      {onLocationChange && (
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
            fontSize: '16px',
          }}
        />
      )}
      {/* Mapa manual */}
      <div
        ref={mapDivRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}