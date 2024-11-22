"use client";

import { DriverList } from "@/components/driver-list";
import { Header } from "@/components/header";
import { LocationForm, LocationFormValues } from "@/components/location-form";
import dynamic from "next/dynamic";
import { useState } from "react";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Home() {
  const [showDrivers, setShowDrivers] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = (_data: LocationFormValues) => {
    setShowDrivers(true);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-col flex h-full">
        <Map className="w-full h-2/5" />
        <div className="flex justify-center w-full mb-28">
          <LocationForm
            className="w-1/3 absolute transform -translate-y-1/2 bg-background p-6 rounded-lg shadow-lg"
            onSubmit={handleSubmit}
          />
        </div>
        {/* TODO - Add a conditional rendering for the driver list */}
        {(showDrivers || true) && (
          <div className="w-full overflow-y-auto flex justify-center">
            <DriverList className="w-8/12 mt-10" />
          </div>
        )}
      </main>
    </div>
  );
}
