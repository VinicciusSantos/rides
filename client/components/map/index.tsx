"use client";

import { useSelector } from "react-redux";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { CSSProperties, useEffect, useRef, useState } from "react";
import polyline from "@mapbox/polyline";
import { RootState } from "@/store";
import { CarFront, Route } from "lucide-react";

const SAO_PAULO_COORDINATES: google.maps.LatLngLiteral = {
  lat: -23.5505,
  lng: -46.6333,
};

interface MapProps {
  mapContainerStyle?: CSSProperties | undefined;
}

export default function Map({ mapContainerStyle }: MapProps) {
  const [center, setCenter] = useState(SAO_PAULO_COORDINATES);
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [durationPosition, setDurationPosition] =
    useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const estimate = useSelector((state: RootState) => state.ride.estimate);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) =>
          setCenter({ lat: coords.latitude, lng: coords.longitude }),
        (error) => console.error("Error getting current position", error)
      );
    }
  }, []);

  useEffect(() => {
    const { origin, destination } = estimate || {};

    if (estimate && origin && destination && mapRef.current) {
      const bounds = new google.maps.LatLngBounds();

      bounds.extend({ lat: origin.latitude, lng: origin.longitude });
      bounds.extend({ lat: destination.latitude, lng: destination.longitude });

      mapRef.current.fitBounds(bounds);

      const decodedPath = polyline
        .decode(estimate.routeResponse.polyline.encodedPolyline)
        .map(([lat, lng]: [number, number]) => ({ lat, lng }));
      setRoutePath(decodedPath);

      const midIndex = Math.floor(decodedPath.length / 2);
      setDurationPosition(decodedPath[midIndex]);
    }
  }, [estimate]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={14}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {estimate && (
        <>
          <Marker
            position={{
              lat: estimate.origin.latitude,
              lng: estimate.origin.longitude,
            }}
          />

          <Marker
            position={{
              lat: estimate.destination.latitude,
              lng: estimate.destination.longitude,
            }}
          />

          <Polyline
            key={estimate.routeResponse.polyline.encodedPolyline}
            path={routePath}
            options={{
              strokeColor: "#007BFF",
              strokeOpacity: 0.8,
              strokeWeight: 5,
            }}
          />

          {durationPosition && (
            <InfoWindow
              position={durationPosition}
              options={{ disableAutoPan: true, headerDisabled: true }}
            >
              <ul className="flex flex-col gap-1 text-black">
                <li className="flex gap-1 items-center">
                  <CarFront className="mr-1 w-4 h-4" />
                  <strong>Duration:</strong>
                  {estimate.duration}
                </li>
                <li className="flex gap-1 items-center">
                  <Route className="mr-1 w-4 h-4" />
                  <strong>Distance:</strong>
                  {(estimate.distance / 1000).toFixed(1)} km
                </li>
              </ul>
            </InfoWindow>
          )}
        </>
      )}
    </GoogleMap>
  );
}
