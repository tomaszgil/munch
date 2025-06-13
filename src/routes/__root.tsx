import { Theme, Box, Flex } from "@radix-ui/themes";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

import { NavSidebar } from "../components/NavSidebar";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  InfoCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

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
        <Toaster
          icons={{
            success: <CheckCircledIcon color="green" />,
            info: <InfoCircledIcon color="blue" />,
            warning: <ExclamationTriangleIcon color="yellow" />,
            error: <CrossCircledIcon color="red" />,
          }}
        />
        <TanStackRouterDevtools />
      </Theme>
    );
  },
});
