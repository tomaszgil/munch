import { forwardRef } from "react";
import type { ReactNode } from "react";
import { Tooltip } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { Text } from "@radix-ui/themes";

interface NavLinkItemProps {
  to: string;
  icon: ReactNode;
  children: ReactNode;
  isCollapsed?: boolean;
}

export const NavLinkItem = forwardRef<HTMLAnchorElement, NavLinkItemProps>(
  ({ to, icon, children, isCollapsed = false, ...props }, ref) => {
    const iconWithTooltip = isCollapsed ? (
      <Tooltip content={children} side="right">
        {icon}
      </Tooltip>
    ) : (
      icon
    );

    return (
      <Link
        ref={ref}
        to={to}
        className="nav-link-item"
        activeProps={{
          "data-state": "active",
        }}
        {...props}
      >
        {iconWithTooltip}
        <Text size="2" weight="bold" style={{ opacity: isCollapsed ? 0 : 1 }}>
          {children}
        </Text>
      </Link>
    );
  }
);

NavLinkItem.displayName = "NavLinkItem";
