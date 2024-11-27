import { clearObject } from "@/lib/clear-object";
import { fetchDrivers } from "@/services/driver.service";
import { fetchRides } from "@/services/ride.service";
import { Metadata, NextPage } from "next";

import { RidesListPageContent } from "./content";

export const metadata: Metadata = {
  title: "Recent rides",
  description: "Check all rides",
};

interface RidesFromUserPageProps {
  searchParams: {
    userId?: string;
    driverId?: string;
  };
}

const RidesFromUserPage: NextPage<RidesFromUserPageProps> = async ({
  searchParams,
}) => {
  const { userId: customer_id, driverId: driver_id } = searchParams;

  const [rides, drivers] = await Promise.all([
    fetchRides(clearObject({ customer_id, driver_id })),
    fetchDrivers(),
  ]);

  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Rides List</h1>
      <RidesListPageContent rides={rides} drivers={drivers} />
    </div>
  );
};

export default RidesFromUserPage;
