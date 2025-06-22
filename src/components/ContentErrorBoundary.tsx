import { ErrorBoundary } from "react-error-boundary";
import { z } from "zod/v4";
import { Box, Button, Callout, Heading, Text } from "@radix-ui/themes";
import { useMealsReset } from "../services/meals/useMealsReset";
import { CrossCircledIcon } from "@radix-ui/react-icons";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const resetMeals = useMealsReset();

  const isParseError = error instanceof z.ZodError;

  const handleReset = () => {
    resetMeals();
    resetErrorBoundary();
  };

  if (isParseError) {
    return (
      <Box maxWidth="960px" mx="auto">
        <Callout.Root size="3" color="red">
          <Callout.Icon>
            <CrossCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            <Heading as="h2" size="3" mb="2">
              Invalid meal data
            </Heading>
            <Text>
              One or more meals in your data don't match the expected format.
              Resetting will clear all your meals. You'll need to add them back
              manually.
            </Text>
          </Callout.Text>
          <div>
            <Button
              size="3"
              variant="soft"
              onClick={handleReset}
              style={{ marginRight: "1rem" }}
            >
              Reset All Meals
            </Button>
          </div>
        </Callout.Root>
      </Box>
    );
  }

  return (
    <Box maxWidth="960px" mx="auto">
      <Callout.Root size="3" color="red">
        <Callout.Icon>
          <CrossCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          <Heading as="h2" size="3" mb="2">
            Something went wrong
          </Heading>
          <Text>
            An unexpected error occurred. Please try again or contact support if
            the problem persists.
          </Text>
        </Callout.Text>
        <div>
          <Button size="3" variant="soft" onClick={resetErrorBoundary}>
            Try Again
          </Button>
        </div>
      </Callout.Root>
    </Box>
  );
}

interface ContentErrorBoundaryProps {
  children: React.ReactNode;
}

export function ContentErrorBoundary({ children }: ContentErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log the error for debugging purposes
        console.error("Error caught by boundary:", error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
