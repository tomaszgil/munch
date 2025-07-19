import { useCallback } from "react";
import { z } from "zod/v4";
import debounce from "lodash/debounce";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  Select,
  Separator,
  DropdownMenu,
  IconButton,
  Switch,
} from "@radix-ui/themes";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  DotsHorizontalIcon,
  ChevronDownIcon,
  TextAlignTopIcon,
  TextAlignBottomIcon,
} from "@radix-ui/react-icons";

import { useMealsQuery } from "@/services/meals/useMealsQuery";
import { useMealCreate } from "@/services/meals/useMealCreate";
import { useMealDelete } from "@/services/meals/useMealDelete";
import { useMealUpdate } from "@/services/meals/useMealUpdate";
import type { Meal, MealCategory } from "@/services/meals/types";

import { CreateMealDialog } from "@/components/CreateMealDialog";
import { DeleteMealDialog } from "@/components/DeleteMealDialog";
import { UpdateMealDialog } from "@/components/UpdateMealDialog";
import { MealCard } from "@/components/MealCard";
import { AnimatedListItem } from "@/components/AnimatedListItem";
import { AnimatePresence } from "motion/react";

const SearchSchema = z.object({
  search: z.string().optional().default(""),
  category: z
    .enum(["all", "breakfast", "lunch", "dinner", "snack"])
    .optional()
    .default("all"),
  favorite: z.boolean().optional().default(false),
  sortKey: z
    .enum(["name", "createdAt", "updatedAt"])
    .optional()
    .default("updatedAt"),
  sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const Route = createFileRoute("/meals/")({
  component: Meals,
  validateSearch: (search) => SearchSchema.parse(search),
});

function Meals() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mealIdToDelete, setMealIdToDelete] = useState<string | null>(null);
  const [mealToEdit, setMealToEdit] = useState<Meal | null>(null);
  const { search, category, favorite, sortKey, sortDirection } =
    Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const createMeal = useMealCreate();
  const deleteMeal = useMealDelete();
  const updateMeal = useMealUpdate();

  const meals: Array<Meal> = useMealsQuery({
    category: category !== "all" ? category : undefined,
    search,
    favorite: favorite ? true : undefined,
    sortKey,
    sortDirection,
  });

  const debouncedSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      navigate({
        search: (prev) => ({ ...prev, search: e.target.value }),
      });
    }, 500),
    []
  );

  const getSortIcon = () => {
    if (sortDirection === "asc") {
      return <TextAlignTopIcon />;
    }
    return <TextAlignBottomIcon />;
  };

  const getSortLabel = () => {
    if (sortKey === "name") {
      return "Name";
    }
    if (sortKey === "createdAt") {
      return "Created at";
    }
    return "Updated at";
  };

  return (
    <div>
      <Box maxWidth="960px" mx="auto">
        <Heading as="h1" size="6" mt="4" mb="5">
          Meals
        </Heading>
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
            key={mealToEdit?.id}
            isOpen={!!mealToEdit}
            onOpenChange={(open) => !open && setMealToEdit(null)}
            onSave={(id, meal) => {
              const updatedMeal = updateMeal(id, meal);
              toast.success(`You have updated ${updatedMeal?.name}.`);
            }}
            meal={mealToEdit!}
          />

          <Flex justify="between" gap="4">
            <Flex gap="3" align="center">
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

              <Text as="label" size="2">
                <Flex align="center">
                  <Switch
                    checked={!!favorite}
                    onCheckedChange={(checked: boolean) => {
                      navigate({
                        search: (prev) => ({
                          ...prev,
                          favorite: checked,
                        }),
                      });
                    }}
                    size="2"
                    mr="2"
                  />
                  Favorites
                </Flex>
              </Text>
            </Flex>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="outline" color="gray">
                  {getSortIcon()}
                  <Text style={{ color: "var(--gray-12)" }}>
                    {getSortLabel()}
                  </Text>
                  <ChevronDownIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Label>Sort by</DropdownMenu.Label>
                <DropdownMenu.Item
                  onClick={() =>
                    navigate({
                      search: (prev) => ({ ...prev, sortKey: "name" }),
                    })
                  }
                >
                  Name
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() =>
                    navigate({
                      search: (prev) => ({ ...prev, sortKey: "createdAt" }),
                    })
                  }
                >
                  Created at
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() =>
                    navigate({
                      search: (prev) => ({ ...prev, sortKey: "updatedAt" }),
                    })
                  }
                >
                  Updated at
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Label>Order by</DropdownMenu.Label>
                <DropdownMenu.Item
                  onClick={() =>
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        sortDirection: "asc",
                      }),
                    })
                  }
                >
                  <TextAlignTopIcon />
                  Ascending
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() =>
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        sortDirection: "desc",
                      }),
                    })
                  }
                >
                  <TextAlignBottomIcon />
                  Descending
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>

          <Separator orientation="horizontal" size="4" my="5" />

          {meals.length === 0 ? (
            <Flex direction="column" align="center" gap="2" py="6">
              <Heading size="4" align="center">
                No meals available
              </Heading>
              <Text color="gray" align="center" mb="3">
                There are no meals yet to display for this search.
              </Text>
              <Button variant="soft" onClick={() => setIsDialogOpen(true)}>
                <PlusIcon />
                Create a new meal
              </Button>
            </Flex>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              <Flex direction="column">
                <AnimatePresence initial={false}>
                  {meals.map((meal, index) => (
                    <AnimatedListItem key={meal.id}>
                      <Box mb={index === meals.length - 1 ? "0" : "3"}>
                        <MealCard meal={meal}>
                          <Flex gap="4" align="center">
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger>
                                <IconButton variant="ghost" color="gray">
                                  <DotsHorizontalIcon />
                                </IconButton>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Content align="end">
                                <DropdownMenu.Item
                                  onClick={() => {
                                    const updatedMeal = updateMeal(meal.id, {
                                      favorite: !meal.favorite,
                                    });
                                    if (updatedMeal) {
                                      toast.success(
                                        updatedMeal.favorite
                                          ? `Added ${updatedMeal.name} to favorites.`
                                          : `Removed ${updatedMeal.name} from favorites.`
                                      );
                                    }
                                  }}
                                >
                                  {meal.favorite ? (
                                    <Text>Remove from favorites</Text>
                                  ) : (
                                    <Text>Add to favorites</Text>
                                  )}
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => setMealToEdit(meal)}
                                >
                                  Edit
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => {
                                    createMeal({
                                      name: `Copy of ${meal.name}`,
                                      category: meal.category,
                                      ingredients: meal.ingredients,
                                    });
                                    toast.success(
                                      `You have duplicated ${meal.name}.`
                                    );
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
                      </Box>
                    </AnimatedListItem>
                  ))}
                </AnimatePresence>
              </Flex>
            </ul>
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
