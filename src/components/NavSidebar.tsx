import { Box, Flex, Text, Tooltip } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileTextIcon,
  DashboardIcon,
  ViewVerticalIcon,
} from "@radix-ui/react-icons";
import type { ReactNode } from "react";
import logo from "../assets/logo.png";

interface NavLinkItemProps {
  to: string;
  icon: ReactNode;
  children: ReactNode;
  isCollapsed: boolean;
}

const NavLinkItem = ({ to, icon, children, isCollapsed }: NavLinkItemProps) => {
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
      {!isCollapsed && (
        <Text size="2" weight="bold">
          {children}
        </Text>
      )}
    </Link>
  );
};

export const NavSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box
      style={{
        width: isCollapsed ? "96px" : "320px",
        height: "100vh",
        position: "sticky",
        top: 0,
        transition: "width 0.2s ease-in-out",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <Flex
        direction="column"
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "var(--radius-4)",
          background:
            "radial-gradient(16rem 100% at 6.64% 0, #f4deff 0, #fbedff 42.5%, #fdf6fc 100%)",
        }}
      >
        {/* Header */}
        <Flex
          align="center"
          justify="between"
          direction={isCollapsed ? "column" : "row"}
          gap="4"
          p="4"
        >
          <Flex align="center" gap="2">
            <img
              src={logo}
              alt="Munch"
              width={32}
              height={32}
              style={{ borderRadius: "var(--radius-2)" }}
            />
            {!isCollapsed && (
              <Text size="4" weight="bold">
                Munch
              </Text>
            )}
          </Flex>
          <button
            className="collapse-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ViewVerticalIcon />
          </button>
        </Flex>

        {/* Navigation */}
        <Flex direction="column">
          <NavLinkItem
            to="/"
            icon={<DashboardIcon />}
            isCollapsed={isCollapsed}
          >
            Dashboard
          </NavLinkItem>
          <NavLinkItem
            to="/meals"
            icon={<FileTextIcon />}
            isCollapsed={isCollapsed}
          >
            Meals
          </NavLinkItem>
        </Flex>
      </Flex>
    </Box>
  );
};
