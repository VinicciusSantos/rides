"use client";

import { getUser } from "@/services/auth.service";
import Link from "next/link";
import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../ui/navigation-menu";
import UserAvatarPopover from "../user-avatar";

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  hide?: boolean;
}

export function Header() {
  const user = getUser();

  const mainNavigation: NavigationItem[] = [
    {
      label: "API Docs",
      href: process.env.NEXT_PUBLIC_API_BASE_URL + "/docs",
      external: true,
    },
    { label: "Drivers", href: "/docs/components" },
    { hide: !user, label: "Recent rides", href: `/rides/${user?.sub}` },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border flex justify-center">
      <div className="flex h-14 w-full max-w-screen-2xl items-center justify-between px-4">
        <div className="mr-4 hidden md:flex">
          <div className="flex items-center gap-2 mr-4">
            <Logo />
            <Link href="/" className="hidden lg:flex items-center gap-2">
              <span className="font-bold text-primary">Rides</span>
            </Link>
          </div>

          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-4 text-sm xl:gap-6">
              {mainNavigation
                .filter((i) => !i.hide)
                .map((item, index) => (
                  <NavigationMenuItem key={index}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-foreground/80 text-foreground/80"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="transition-colors hover:text-foreground/80 text-foreground/80"
                      >
                        {item.label}
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <UserAvatarPopover />
          ) : (
            <div className="flex gap-2">
              <Link href="/sign-in">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
