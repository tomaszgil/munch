import { CategoryBadge } from "@/components/CategoryBadge";
import { AddNewMealDialog } from "@/components/AddNewMealDialog";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  TextField,
  Text,
  Card,
  Select,
  Separator,
} from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMealsQuery } from "@/services/meals/useMealsQuery";
import { useMealCreate } from "@/services/meals/useMealCreate";
import type { Meal } from "@/services/meals/types";

export const Route = createFileRoute("/meals")({
  component: Meals,
});

function Meals() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const meals: Array<Meal> = useMealsQuery();
  const createMeal = useMealCreate();

  return (
    <div>
      <Heading as="h1" size="6" mt="2" mb="4">
        Meals
      </Heading>
      <Box>
        <Card size="3">
          <Flex justify="between" mb="4">
            <TextField.Root
              placeholder="Search meals..."
              style={{ width: "300px" }}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon />
              </TextField.Slot>
            </TextField.Root>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusIcon />
              Add new meal
            </Button>
          </Flex>

          <AddNewMealDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSave={(meal) => createMeal(meal)}
          />

          <Select.Root defaultValue="all">
            <Select.Trigger placeholder="Select category" />
            <Select.Content>
              <Select.Item value="all">All</Select.Item>
              <Select.Item value="breakfast">Breakfast</Select.Item>
              <Select.Item value="lunch">Lunch</Select.Item>
              <Select.Item value="dinner">Dinner</Select.Item>
              <Select.Item value="snack">Snack</Select.Item>
            </Select.Content>
          </Select.Root>

          <Separator orientation="horizontal" size="4" my="5" />

          {meals.length === 0 ? (
            <Flex direction="column" align="center" gap="2" py="6">
              <Heading size="4" align="center">
                No meals available
              </Heading>
              <Text color="gray" align="center" mb="3">
                You haven't added any meals yet. Start by creating your first
                meal!
              </Text>
              <Button variant="soft" onClick={() => setIsDialogOpen(true)}>
                <PlusIcon />
                Create your first meal
              </Button>
            </Flex>
          ) : (
            <Flex direction="column" gap="3">
              {meals.map((meal) => (
                <Card key={meal.id} size="2">
                  <Flex justify="between" align="center">
                    <Flex direction="column" gap="1">
                      <Text size="4" weight="bold">
                        {meal.name}
                      </Text>
                      <Text size="2" color="gray">
                        {meal.ingredients.join(", ")}
                      </Text>
                    </Flex>
                    <CategoryBadge category={meal.category} />
                  </Flex>
                </Card>
              ))}
            </Flex>
          )}
        </Card>
      </Box>
    </div>
  );
}
