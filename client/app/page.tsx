"use client";

import { useSelector } from "react-redux";
import { DriverList } from "@/components/driver-list";
import { Header } from "@/components/header";
import { LocationForm } from "@/components/location-form";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { RootState } from "@/store";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Home() {
  const estimate = useSelector((state: RootState) => state.ride.estimate);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main>
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
      </main>
    </div>
  );
}
