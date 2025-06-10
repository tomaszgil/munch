import { Theme, Box, Flex } from "@radix-ui/themes";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NavSidebar } from "../components/NavSidebar";

export const Route = createRootRoute({
  component: () => {
    return (
      <Theme accentColor="plum" grayColor="sand" radius="large">
        <Flex>
          <NavSidebar />

          {/* Main Content */}
          <Box style={{ flex: 1, padding: "24px" }}>
            <Outlet />
          </Box>
        </Flex>
        <TanStackRouterDevtools />
      </Theme>
    );
  },
});
