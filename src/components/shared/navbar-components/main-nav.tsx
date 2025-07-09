"use client";

import Logo from "@/components/shared/navbar-components/logo";
import UserMenu from "@/components/shared/navbar-components/user-menu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ThemeToggle from "./theme-toggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: `/`,
      label: "Dashboard",
    },
    {
      href: `/departments`,
      label: "Departments",
    },
    {
      href: `/suppliers`,
      label: "Suppliers",
    },
    {
      href: `/invoices`,
      label: "Invoices",
    },
  ];

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {routes.map((link, index) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === link.href
                        : pathname.startsWith(link.href);
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className={cn(
                            "py-1.5",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                          active={isActive}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="text-primary hover:text-primary/90">
              <Logo />
            </a>
          </div>
        </div>
        {/* Middle area */}
        <div className="grow max-md:hidden">
          {/* Search form */}
          <div className="relative mx-auto w-full max-w-xs">
            {/* Navigation menu */}
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {routes.map((link, index) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === link.href
                      : pathname.startsWith(link.href);
                  return (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        active={isActive}
                        href={link.href}
                        className={cn(
                          "py-1.5 font-medium transition-colors hover:text-primary",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
