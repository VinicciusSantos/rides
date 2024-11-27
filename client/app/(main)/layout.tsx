import { Header } from "@/components/header";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main>{children}</main>
    </div>
  );
}
