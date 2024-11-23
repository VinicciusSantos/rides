import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Rides",
  description: "Sign in to your account",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Card className="w-[400px]">{children}</Card>
    </div>
  );
}
