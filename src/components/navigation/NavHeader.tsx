import { Box, Flex, IconButton, Link, Text } from "@radix-ui/themes";
import * as Popover from "@radix-ui/react-popover";
import { HamburgerMenuIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import logo from "../../assets/logo.png";
import { NavLinkItem } from "./NavListItem";
import { navConfig } from "./config";
import { useBrandBackground } from "./useBrandBackground";
import { useTheme } from "../theme/ThemeContext";

export const NavHeader = () => {
  const { background } = useBrandBackground();
  const [theme, setTheme] = useTheme();

  return (
    <Box mb="64px">
      <Box
        p="4"
        width="100%"
        position="fixed"
        top="0"
        style={{ background: "var(--color-panel-solid)", zIndex: 1 }}
      >
        <Flex justify="between" align="center">
          <img
            src={logo}
            alt="Munch"
            height={32}
            width={32}
            style={{ borderRadius: "var(--radius-2)" }}
          />
          <Flex align="center" gap="4" px="2">
            <IconButton
              variant="ghost"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <MoonIcon /> : <SunIcon />}
            </IconButton>
            <Popover.Root>
              <Popover.Trigger asChild>
                <IconButton variant="ghost">
                  <HamburgerMenuIcon />
                </IconButton>
              </Popover.Trigger>

              <Popover.Content className="nav-overlay-content" sideOffset={4}>
                <Flex
                  direction="column"
                  gap="4"
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "var(--radius-4)",
                    background,
                  }}
                >
                  <Box py="4" flexGrow="1">
                    {navConfig.map((item) => (
                      <Popover.Close asChild key={item.label}>
                        <NavLinkItem to={item.to} icon={item.icon}>
                          {item.label}
                        </NavLinkItem>
                      </Popover.Close>
                    ))}
                  </Box>
                  <Box p="4">
                    <Text size="1" color="gray">
                      © 2025{" "}
                      <Link href="https://tomaszgil.me" target="_blank">
                        Tomasz Gil
                      </Link>
                    </Text>
                  </Box>
                </Flex>
              </Popover.Content>
            </Popover.Root>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
