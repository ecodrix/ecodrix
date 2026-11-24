"use client";

import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import type * as React from "react";
import { ChevronDown } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * shadcn NavigationMenu (radix-nova) on ERIX tokens, used without the shared
 * viewport so each panel can enter and leave with framer-motion (the header
 * wraps NavigationMenuContent in AnimatePresence). Radix keeps the keyboard
 * model: Tab between items, Enter/Space/↓ to open, Esc to close, arrow keys
 * inside, and hover intent with open/close delays.
 */
function NavigationMenu({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return <NavigationMenuPrimitive.Root data-slot="navigation-menu" className={cn("static", className)} {...props} />;
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex list-none items-center gap-0.5", className)}
      {...props}
    />
  );
}

const NavigationMenuItem = NavigationMenuPrimitive.Item;

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        "group/nav relative isolate inline-flex h-9 items-center gap-1 rounded-full px-3 text-[14.5px] font-semibold text-muted-foreground",
        "hover:text-foreground data-[state=open]:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden="true"
        className="size-3.5 transition-transform duration-200 group-data-[state=open]/nav:rotate-180"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

const NavigationMenuContent = NavigationMenuPrimitive.Content;
const NavigationMenuLink = NavigationMenuPrimitive.Link;

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
};
