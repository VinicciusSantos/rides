"use client";

import { LogIn, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { useRouter } from "next/navigation";

export const AuthRequiredDialog = () => {
  const router = useRouter();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Conta Necessária</DialogTitle>
        <DialogDescription>
          Você precisa estar logado para realizar uma corrida. Faça login ou
          crie uma nova conta.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => router.push("/sign-in")}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Fazer Login
        </Button>
        <Button className="w-full" onClick={() => router.push("/sign-up")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Criar Conta
        </Button>
      </div>
    </>
  );
};

export const LoadingDialog = () => (
  <DialogHeader>
    <DialogTitle>Confirmando Corrida</DialogTitle>
    <DialogDescription>
      Aguarde enquanto confirmamos sua corrida...
    </DialogDescription>
  </DialogHeader>
);

export const ErrorDialog = ({ tryAgain }: { tryAgain: () => void }) => (
  <>
    <DialogHeader>
      <DialogTitle>Falha ao Confirmar Corrida</DialogTitle>
      <DialogDescription>
        Ocorreu um erro ao confirmar sua corrida. Por favor, tente novamente.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4">
      <Button className="w-full" onClick={tryAgain}>
        Tentar Novamente
      </Button>
    </div>
  </>
);
