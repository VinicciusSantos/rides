"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <Card className="p-6 text-center shadow-md">
        <div className="flex flex-col">
          <h1 className="text-destructive">Algo deu errado</h1>
          <span className="mt-4 text-muted-foreground">
            {error.message || "Ocorreu um erro inesperado. Tente novamente."}
          </span>
        </div>
        <Button className="mt-8" onClick={reset} variant={"destructive"}>
          Tentar novamente
        </Button>
      </Card>
    </div>
  );
}
