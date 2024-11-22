"use client";

import { useEffect, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

type MapProps = React.HTMLProps<HTMLDivElement>;

export default function Map({ ...rest }: MapProps) {
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Erro ao obter localização do usuário:", error);
        }
      );
    }
  }, []);

  return (
    <div {...rest}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={14}
        ></GoogleMap>
      </LoadScript>
    </div>
  );
}
