import { Box, Flex } from "@radix-ui/themes";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  InfoCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import { NavHeader } from "@/components/navigation/NavHeader";
import { NavSidebar } from "../components/navigation/NavSidebar";
import { ThemeProvider } from "@/components/theme/ThemeContext";
import { ContentErrorBoundary } from "@/components/ContentErrorBoundary";

export const Route = createRootRoute({
  component: () => {
    return (
      <ThemeProvider>
        <Flex direction={{ initial: "column", md: "row" }}>
          <Box display={{ initial: "block", md: "none" }}>
            <NavHeader />
          </Box>
          <Box display={{ initial: "none", md: "block" }}>
            <NavSidebar />
          </Box>

          {/* Main Content */}
          <Box p="4" style={{ flex: 1 }}>
            <ContentErrorBoundary>
              <Outlet />
            </ContentErrorBoundary>
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
      </ThemeProvider>
    );
  },
});
