import { Box, Flex, IconButton, Text, Button } from "@radix-ui/themes";
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
  return (
    <Button
      asChild
      variant="ghost"
      color="gray"
      style={{ justifyContent: "flex-start" }}
    >
      <Link to={to}>
        {icon}
        {!isCollapsed && (
          <Text style={{ marginInlineStart: "var(--space-2)" }}>
            {children}
          </Text>
        )}
      </Link>
    </Button>
  );
};

export const NavSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box
      style={{
        width: isCollapsed ? "80px" : "320px",
        height: "100vh",
        transition: "width 0.2s ease-in-out",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <Flex
        direction="column"
        gap="5"
        p="4"
        style={{
          height: "100vh",
          width: "100%",
          borderRadius: "var(--radius-4)",
          border: "1px solid var(--gray-2)",
          boxShadow: "var(--shadow-3)",
        }}
      >
        {/* Header */}
        <Flex
          align="center"
          justify="between"
          direction={isCollapsed ? "column" : "row"}
          gap="4"
        >
          <Flex align="center" gap="2">
            <img src={logo} alt="Munch" width={32} height={32} />
            {!isCollapsed && (
              <Text size="5" weight="bold">
                Munch
              </Text>
            )}
          </Flex>
          <IconButton
            variant="ghost"
            color="gray"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ViewVerticalIcon />
          </IconButton>
        </Flex>

        {/* Navigation */}
        <Flex direction="column" gap="2">
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
