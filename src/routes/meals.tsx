import {
  MagnifyingGlassIcon,
  PlusIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  TextField,
  Text,
  Badge,
  Card,
  Select,
  Dialog,
} from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ChangeEvent } from "react";

export const Route = createFileRoute("/meals")({
  component: Meals,
});

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Breakfast":
      return "blue";
    case "Lunch":
      return "green";
    case "Dinner":
      return "red";
    default:
      return "gray";
  }
};

function Meals() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: "",
    category: "",
    ingredients: [""],
  });

  const handleAddIngredient = () => {
    setNewMeal((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setNewMeal((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    setNewMeal((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? value : ing
      ),
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsDialogOpen(false);
    setNewMeal({ name: "", category: "", ingredients: [""] });
  };

  const meals = [
    {
      id: 1,
      name: "Meal 1",
      ingredients: ["Ingredient 1", "Ingredient 2"],
      category: "Breakfast",
    },
    {
      id: 2,
      name: "Meal 2",
      ingredients: ["Ingredient 3", "Ingredient 4"],
      category: "Lunch",
    },
  ];

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

          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>Add new meal</Dialog.Title>
              <Flex direction="column" gap="3">
                <TextField.Root>
                  <TextField.Slot>
                    <input
                      placeholder="Meal name"
                      value={newMeal.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewMeal((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </TextField.Slot>
                </TextField.Root>

                <Select.Root
                  value={newMeal.category}
                  onValueChange={(value) =>
                    setNewMeal((prev) => ({ ...prev, category: value }))
                  }
                >
                  <Select.Trigger placeholder="Select category" />
                  <Select.Content>
                    <Select.Item value="breakfast">Breakfast</Select.Item>
                    <Select.Item value="lunch">Lunch</Select.Item>
                    <Select.Item value="dinner">Dinner</Select.Item>
                    <Select.Item value="snack">Snack</Select.Item>
                  </Select.Content>
                </Select.Root>

                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold">
                    Ingredients
                  </Text>
                  {newMeal.ingredients.map((ingredient, index) => (
                    <Flex key={index} gap="2">
                      <TextField.Root style={{ flex: 1 }}>
                        <TextField.Slot>
                          <input
                            placeholder="Ingredient"
                            value={ingredient}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleIngredientChange(index, e.target.value)
                            }
                          />
                        </TextField.Slot>
                      </TextField.Root>
                      <Button
                        variant="ghost"
                        color="red"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        <Cross2Icon />
                      </Button>
                    </Flex>
                  ))}
                  <Button
                    variant="ghost"
                    onClick={handleAddIngredient}
                    style={{ alignSelf: "flex-start" }}
                  >
                    <PlusIcon />
                    Add ingredient
                  </Button>
                </Flex>
              </Flex>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button onClick={handleSave}>Save</Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

          <Flex gap="3" mb="4">
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
          </Flex>

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
                  <Badge color={getCategoryColor(meal.category)}>
                    {meal.category}
                  </Badge>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Card>
      </Box>
    </div>
  );
}
