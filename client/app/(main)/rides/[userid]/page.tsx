import FilterForm from "@/components/rides-table/rides-filters";
import RidesTable from "@/components/rides-table/rides-table";
import { fetchDrivers } from "@/services/driver.service";
import { fetchRides } from "@/services/ride.service";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Recent rides",
  description: "Check all rides",
};

export default async function RidesFromUserPage() {
  const [rides, drivers] = await Promise.all([fetchRides(), fetchDrivers()]);

  return (
    <div className="container mx-auto py-10 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Rides List</h1>
      <div className="flex flex-col gap-6">
        <FilterForm drivers={drivers.items} />
        <Suspense fallback={<div>Loading...</div>}>
          <RidesTable rides={rides} />
        </Suspense>
      </div>
    </div>
  );
}
