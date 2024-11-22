"use client";

import { DriverList } from "@/components/driver-list";
import { Header } from "@/components/header";
import { LocationForm } from "@/components/location-form";
import { RideEstimateResponse } from "@/services/ride.service";
import dynamic from "next/dynamic";
import { useState } from "react";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Home() {
  const [data, setData] = useState<RideEstimateResponse | undefined>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = (data: RideEstimateResponse) => {
    setData(data);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-col flex h-screen overflow-y-auto">
        <div className="w-full h-96">
          <Map />
        </div>
        <div className="flex justify-center w-full mb-28 h-64">
          <LocationForm
            className="w-1/3 max-w-[450px] absolute transform -translate-y-1/2 bg-background p-6 rounded-lg shadow-lg"
            onSubmit={handleSubmit}
          />
        </div>

        {data && <DriverList drivers={data.options} className="w-8/12 mt-10 m-auto" />}
      </main>
    </div>
  );
}
