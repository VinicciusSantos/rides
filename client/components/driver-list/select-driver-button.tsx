"use client";

import { ButtonHTMLAttributes } from "react";
import { Button } from "../ui/button";

interface SelectDriverButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
}

export const SelectDriverButton = ({
  loading,
  className,
  ...props
}: SelectDriverButtonProps) => (
  <Button {...props} size="sm" className={className} disabled={loading}>
    {loading ? "Loading..." : "Select driver"}
  </Button>
);
