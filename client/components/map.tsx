"use client";

import { GoogleMap } from "@react-google-maps/api";
import { useEffect, useState } from "react";

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
        ({ coords }) =>
          setCenter({ lat: coords.latitude, lng: coords.longitude }),
        (error) => console.error("Error getting current position", error)
      );
    }
  }, []);

  return (
    <div {...rest}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      ></GoogleMap>
    </div>
  );
}
