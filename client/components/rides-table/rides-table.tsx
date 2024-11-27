"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RidesResponse } from "@/services/ride.service";
import { getUser } from "@/services/auth.service";

export default function RidesTable({ rides }: { rides: RidesResponse }) {
  const router = useRouter();
  const user = getUser();
  const [currentPage, setCurrentPage] = useState(rides.current_page);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > rides.last_page) return;
    setCurrentPage(page);
    router.push(`/rides/${user?.sub}?page=${page}&per_page=${rides.per_page}`);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Driver name</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Distance (m)</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rides.items.map((ride) => (
            <TableRow key={ride.ride_id}>
              <TableCell>{ride.driver.name}</TableCell>
              <TableCell>{ride.origin.address}</TableCell>
              <TableCell>{ride.destination.address}</TableCell>
              <TableCell>{ride.distance}m</TableCell>
              <TableCell>{ride.duration}</TableCell>
              <TableCell>${ride.value.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>
          {Array.from({ length: rides.last_page }, (_, i) => i + 1).map(
            (page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
