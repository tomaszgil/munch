import { useState } from "react";
import { Box, Flex, Text, Link } from "@radix-ui/themes";
import { MoonIcon, SunIcon, ViewVerticalIcon } from "@radix-ui/react-icons";

import logo from "../../assets/logo.png";

import { NavLinkItem } from "./NavListItem";
import { navConfig } from "./config";
import { useBrandBackground } from "./useBrandBackground";
import { useTheme } from "../theme/ThemeContext";

export const NavSidebar = () => {
  const { background } = useBrandBackground();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useTheme();

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
        overflow: "hidden",
      }}
    >
      <Flex
        direction="column"
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "var(--radius-4)",
          background,
        }}
      >
        {/* Header */}
        <Flex
          align="center"
          justify="between"
          flexGrow="1"
          wrap="wrap"
          gap="4"
          p="4"
        >
          <Flex align="center" gap="2" style={{ overflow: "hidden" }}>
            <img
              src={logo}
              alt="Munch"
              width={32}
              height={32}
              style={{ borderRadius: "var(--radius-2)" }}
            />
            <Text size="4" weight="bold">
              Munch
            </Text>
          </Flex>
          <button
            className="sidebar-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ViewVerticalIcon />
          </button>
        </Flex>

        <Box flexBasis="100%">
          {navConfig.map((item) => (
            <NavLinkItem
              key={item.label}
              to={item.to}
              icon={item.icon}
              isCollapsed={isCollapsed}
            >
              {item.label}
            </NavLinkItem>
          ))}
        </Box>
        <Flex
          p="4"
          align="center"
          gap="4"
          justify={isCollapsed ? "center" : "between"}
        >
          {!isCollapsed && (
            <Text
              size="1"
              color="gray"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              © 2025{" "}
              <Link href="https://tomaszgil.me" target="_blank">
                Tomasz Gil
              </Link>
            </Text>
          )}
          <button
            className="sidebar-button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
          </button>
        </Flex>
      </Flex>
    </Box>
  );
};
