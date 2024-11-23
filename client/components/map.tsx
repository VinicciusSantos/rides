"use client";

import { GoogleMap } from "@react-google-maps/api";
import { CSSProperties, useEffect, useState } from "react";

interface MapProps {
  mapContainerStyle?: CSSProperties | undefined;
}

export default function Map({ mapContainerStyle }: MapProps) {
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) =>
          setCenter({ lat: coords.latitude, lng: coords.longitude }),
        (error) => console.error("Error getting current position", error)
      );
    }
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={10}
    ></GoogleMap>
  );
}
