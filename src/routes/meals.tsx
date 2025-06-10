import { Heading } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/meals")({
  component: Meals,
});

function Meals() {
  return (
    <div>
      <Heading as="h1" size="7">
        Meals
      </Heading>
    </div>
  );
}
