import { Box, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { ViewVerticalIcon } from "@radix-ui/react-icons";
import logo from "../../assets/logo.png";
import { NavLinkItem } from "./NavListItem";
import { navConfig } from "./config";

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
        <Flex align="center" justify="between" wrap="wrap" gap="4" p="4">
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
            className="collapse-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ViewVerticalIcon />
          </button>
        </Flex>

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
      </Flex>
    </Box>
  );
};
