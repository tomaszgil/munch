import { Box, Flex, IconButton } from "@radix-ui/themes";
import * as Popover from "@radix-ui/react-popover";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import logo from "../../assets/logo.png";
import { NavList } from "./NavList";

export const NavHeader = () => {
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
          <Popover.Root>
            <Popover.Trigger asChild>
              <IconButton variant="ghost" mr="2">
                <HamburgerMenuIcon />
              </IconButton>
            </Popover.Trigger>

            <Popover.Content className="nav-overlay-content" sideOffset={4}>
              <Box
                py="4"
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "var(--radius-4)",
                  background:
                    "radial-gradient(16rem 100% at 6.64% 0, #f4deff 0, #fbedff 42.5%, #fdf6fc 100%)",
                }}
              >
                <NavList />
              </Box>
            </Popover.Content>
          </Popover.Root>
        </Flex>
      </Box>
    </Box>
  );
};
