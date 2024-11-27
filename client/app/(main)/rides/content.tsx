"use client";

import FilterForm from "@/components/rides-table/rides-filters";
import RidesTable from "@/components/rides-table/rides-table";
import { Button } from "@/components/ui/button";
import { getUser } from "@/services/auth.service";
import { DriversResponse } from "@/services/driver.service";
import { RidesResponse } from "@/services/ride.service";
import { Link, LogIn, UserPlus } from "lucide-react";

interface RidesListPageContentProps {
  rides: RidesResponse;
  drivers: DriversResponse;
}

export function RidesListPageContent({
  drivers,
  rides,
}: RidesListPageContentProps) {
  const user = getUser();

  return user ? (
    <div className="flex flex-col gap-6">
      <FilterForm drivers={drivers.items} />
      <RidesTable rides={rides} />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-4 bg-accent p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold text-foreground">
        Please log in or sign up to access recent rides
      </h2>
      <p className="text-muted-foreground">
        Access to recent rides is restricted to logged-in users.
      </p>
      <div className="flex gap-2">
        <Button variant="outline">
          <Link className="flex items-center" href="/sign-in">
            <LogIn className="mr-2 h-4 w-4" />
            Fazer Login
          </Link>
        </Button>
        <Button>
          <Link className="flex items-center" href="/sign-up">
            <UserPlus className="mr-2 h-4 w-4" />
            Criar Conta
          </Link>
        </Button>
      </div>
    </div>
  );
}
