"use client";

import { DriverList } from "@/components/driver-list";
import { LocationForm } from "@/components/location-form";
import { Card } from "@/components/ui/card";
import { RootState } from "@/store";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function HomePage() {
  const estimate = useSelector((state: RootState) => state.ride.estimate);

  return (
    <>
      <Map mapContainerStyle={{ height: "24rem", width: "100%" }} />
      <div className="flex justify-center w-full mb-40">
        <Card className="w-1/3 max-w-[450px] absolute transform -translate-y-1/2 ">
          <LocationForm />
        </Card>
      </div>

      {estimate && (
        <DriverList
          drivers={estimate.options}
          className="w-8/12 max-w-screen-lg m-auto"
        />
      )}
    </>
  );
}
