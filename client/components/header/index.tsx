import Link from "next/link";

import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Logo } from "../logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border flex justify-center">
      <div className="flex h-14 w-full max-w-screen-2xl items-center justify-between px-4">
        <div className="mr-4 hidden md:flex">
          <div className="flex gap-1 items-center mr-2">
            <Logo />
            <a className="mr-4 flex items-center gap-2 lg:mr-6" href="/">
              <span className="hidden font-bold text-primary lg:inline-block">
                Rides
              </span>
            </a>
          </div>
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-4 text-sm xl:gap-6">
              <NavigationMenuItem>
                <a
                  className="transition-colors hover:text-foreground/80 text-foreground/80"
                  href={process.env.NEXT_PUBLIC_API_BASE_URL + "/docs"}
                  target="_blank"
                >
                  API Docs
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a
                  className="transition-colors hover:text-foreground/80 text-foreground/80"
                  href="/docs/components"
                >
                  Drivers
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex gap-4">
          <ThemeToggle />

          <Link href="/sign-in">
            <Button className="flex gap-4" variant="ghost">
              Sign in
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button className="flex gap-4">Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
