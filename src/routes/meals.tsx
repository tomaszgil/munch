import { useCallback } from "react";
import { z } from "zod/v4";
import debounce from "lodash/debounce";
import { CategoryBadge } from "@/components/CategoryBadge";
import { CreateMealDialog } from "@/components/CreateMealDialog";
import { DeleteMealDialog } from "@/components/DeleteMealDialog";
import { UpdateMealDialog } from "@/components/UpdateMealDialog";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
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
  DropdownMenu,
  IconButton,
} from "@radix-ui/themes";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useMealsQuery } from "@/services/meals/useMealsQuery";
import { useMealCreate } from "@/services/meals/useMealCreate";
import { useMealDelete } from "@/services/meals/useMealDelete";
import { useMealUpdate } from "@/services/meals/useMealUpdate";
import type { Meal, MealCategory } from "@/services/meals/types";
import { MealCard } from "@/components/MealCard";

const SearchSchema = z.object({
  search: z.string().optional().default(""),
  category: z
    .enum(["all", "breakfast", "lunch", "dinner", "snack"])
    .optional()
    .default("all"),
});

export const Route = createFileRoute("/meals")({
  component: Meals,
  validateSearch: (search) => SearchSchema.parse(search),
});

function Meals() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mealIdToDelete, setMealIdToDelete] = useState<string | null>(null);
  const [mealToEdit, setMealToEdit] = useState<Meal | null>(null);
  const { search, category } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const createMeal = useMealCreate();
  const deleteMeal = useMealDelete();
  const updateMeal = useMealUpdate();

  const meals: Array<Meal> = useMealsQuery({
    category: category !== "all" ? category : undefined,
    search,
  });

  const debouncedSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      navigate({
        search: (prev) => ({ ...prev, search: e.target.value }),
      });
    }, 500),
    []
  );

  return (
    <div>
      <Heading as="h1" size="6" mt="3" mb="5">
        Meals
      </Heading>
      <Box maxWidth="960px" mx="auto">
        <Card size="3">
          <Flex justify="between" mb="4" gap="4">
            <TextField.Root
              placeholder="Search meals..."
              style={{ width: "300px" }}
              defaultValue={search}
              onChange={debouncedSearch}
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

          <CreateMealDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSave={(meal) => {
              const createdMeal = createMeal(meal);
              toast.success(`You have created ${createdMeal.name}.`);
            }}
          />

          <UpdateMealDialog
            isOpen={!!mealToEdit}
            onOpenChange={(open) => !open && setMealToEdit(null)}
            onSave={(id, meal) => {
              const updatedMeal = updateMeal(id, meal);
              toast.success(`You have updated ${updatedMeal?.name}.`);
            }}
            meal={mealToEdit!}
          />

          <Select.Root
            value={category}
            onValueChange={(category: MealCategory) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  category,
                }),
              });
            }}
          >
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
                <MealCard meal={meal}>
                  <Flex gap="4" align="center">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="ghost" color="gray">
                          <DotsHorizontalIcon />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content align="end">
                        <DropdownMenu.Item onClick={() => setMealToEdit(meal)}>
                          Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onClick={() => {
                            createMeal({
                              name: `Copy of ${meal.name}`,
                              category: meal.category,
                              ingredients: meal.ingredients,
                            });
                            toast.success(`You have duplicated ${meal.name}.`);
                          }}
                        >
                          Duplicate
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          color="red"
                          onClick={() => setMealIdToDelete(meal.id)}
                        >
                          Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Flex>
                </MealCard>
              ))}
            </Flex>
          )}
        </Card>
      </Box>

      <DeleteMealDialog
        isOpen={!!mealIdToDelete}
        onOpenChange={(open) => !open && setMealIdToDelete(null)}
        onDelete={() => {
          if (mealIdToDelete) {
            const meal = deleteMeal(mealIdToDelete);
            setMealIdToDelete(null);
            toast.success(`You have deleted ${meal?.name}.`);
          }
        }}
      />
    </div>
  );
}
