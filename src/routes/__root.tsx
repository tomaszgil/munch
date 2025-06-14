import { Theme, Box, Flex } from "@radix-ui/themes";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  InfoCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import { NavHeader } from "@/components/navigation/NavHeader";
import { NavSidebar } from "../components/navigation/NavSidebar";

export const Route = createRootRoute({
  component: () => {
    return (
      <Theme accentColor="plum" grayColor="sand" radius="large">
        <Flex direction={{ initial: "column", md: "row" }}>
          <Box display={{ initial: "block", md: "none" }}>
            <NavHeader />
          </Box>
          <Box display={{ initial: "none", md: "block" }}>
            <NavSidebar />
          </Box>

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
