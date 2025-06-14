import { Flex, Tooltip } from "@radix-ui/themes";
import { DashboardIcon, FileTextIcon, GearIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

interface NavLinkItemProps {
  to: string;
  icon: ReactNode;
  children: ReactNode;
  isCollapsed?: boolean;
}

const NavLinkItem = ({
  to,
  icon,
  children,
  isCollapsed = false,
}: NavLinkItemProps) => {
  const iconWithTooltip = isCollapsed ? (
    <Tooltip content={children} side="right">
      {icon}
    </Tooltip>
  ) : (
    icon
  );
  return (
    <Link
      to={to}
      className="nav-link-item"
      activeProps={{
        "data-state": "active",
      }}
    >
      {iconWithTooltip}
      <Text size="2" weight="bold" style={{ opacity: isCollapsed ? 0 : 1 }}>
        {children}
      </Text>
    </Link>
  );
};

export const NavList = ({ isCollapsed = false }: { isCollapsed?: boolean }) => {
  return (
    <Flex direction="column">
      <NavLinkItem to="/" icon={<DashboardIcon />} isCollapsed={isCollapsed}>
        Dashboard
      </NavLinkItem>
      <NavLinkItem
        to="/meals"
        icon={<FileTextIcon />}
        isCollapsed={isCollapsed}
      >
        Meals
      </NavLinkItem>
      <NavLinkItem
        to="/management"
        icon={<GearIcon />}
        isCollapsed={isCollapsed}
      >
        Management
      </NavLinkItem>
    </Flex>
  );
};
