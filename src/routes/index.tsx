import { Heading } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div>
      <Heading as="h1" size="6" mt="3" mb="5">
        Dashboard
      </Heading>
    </div>
  );
}
