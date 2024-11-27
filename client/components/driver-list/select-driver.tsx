"use client";

import { toast } from "@/hooks/use-toast";
import { getUser } from "@/services/auth.service";
import { confirmRide, EstimatedDriver } from "@/services/ride.service";
import { RootState } from "@/store";
import { Loader } from "lucide-react";
import { ButtonHTMLAttributes, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  AuthRequiredDialog,
  ErrorDialog,
  LoadingDialog,
} from "./dialogs";
import { clearEstimate } from "@/store/slices/ride.slice";
import { useRouter } from "next/navigation";

interface SelectDriverProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  driver: EstimatedDriver;
}

export const SelectDriver = ({
  className,
  driver,
  ...props
}: SelectDriverProps) => {
  const estimate = useSelector((state: RootState) => state.ride.estimate);
  const user = getUser();
  const dispatch = useDispatch();
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogState, setDialogState] = useState<"idle" | "loading" | "error">(
    "idle"
  );

  const handleSelectDriver = async () => {
    if (!estimate) {
      return toast({
        title: "Erro",
        description: "Nenhuma estimativa disponível.",
        variant: "destructive",
      });
    }

    if (!user) {
      setDialogState("idle");
      setIsDialogOpen(true);
      return;
    }

    setDialogState("loading");
    setIsDialogOpen(true);

    try {
      const { success } = await confirmRide({
        customer_id: user.sub,
        origin: estimate.origin.address as string,
        destination: estimate.destination.address as string,
        distance: estimate.distance,
        duration: estimate.duration,
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: driver.value,
      });

      if (success) {
        dispatch(clearEstimate());
        toast({
          title: "Corrida Confirmada",
          description: `Sua corrida com ${driver.name} foi confirmada.`,
        });
        router.push(`/rides/${user.sub}`);
      } else {
        setDialogState("error");
      }
    } catch (error) {
      console.error(error);
      setDialogState("error");
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao confirmar a corrida.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsDialogOpen(false);
    setDialogState("idle");
  };

  return (
    <>
      <Button
        onClick={handleSelectDriver}
        {...props}
        size="sm"
        className={className}
      >
        {isLoading ? <Loader className="animate-spin" /> : "Select driver"}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[425px]">
          {dialogState === "idle" && !user && <AuthRequiredDialog />}
          {dialogState === "loading" && <LoadingDialog />}
          {dialogState === "error" && (
            <ErrorDialog tryAgain={handleSelectDriver} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
