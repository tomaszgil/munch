import type { Meal, MealCategory, MealUpdate } from "@/services/meals/types";
import { PlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  Button,
  Flex,
  TextField,
  Text,
  Select,
  Dialog,
  IconButton,
} from "@radix-ui/themes";
import { useState, useEffect } from "react";

interface UpdateMealDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, meal: MealUpdate) => void;
  meal: Meal;
}

export function UpdateMealDialog({
  isOpen,
  onOpenChange,
  onSave,
  meal,
}: UpdateMealDialogProps) {
  const [updatedMeal, setUpdatedMeal] = useState<MealUpdate>({
    name: "",
    category: "breakfast",
    ingredients: [""],
  });

  useEffect(() => {
    if (meal) {
      setUpdatedMeal({
        name: meal.name,
        category: meal.category,
        ingredients: meal.ingredients,
      });
    }
  }, [meal]);

  const handleAddIngredient = () => {
    setUpdatedMeal((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), ""],
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setUpdatedMeal((prev) => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    setUpdatedMeal((prev) => ({
      ...prev,
      ingredients: prev.ingredients?.map((ing, i) =>
        i === index ? value : ing
      ),
    }));
  };

  const handleSave = () => {
    if (meal) {
      onSave(meal.id, updatedMeal);
      onOpenChange(false);
    }
  };

  if (!meal) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Edit meal</Dialog.Title>
        <Dialog.Description mb="4">Update meal details.</Dialog.Description>
        <Flex direction="column" gap="3">
          <TextField.Root
            placeholder="Meal name"
            value={updatedMeal.name}
            required
            onChange={(e) =>
              setUpdatedMeal((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <Select.Root
            value={updatedMeal.category}
            onValueChange={(value) =>
              setUpdatedMeal((prev) => ({
                ...prev,
                category: value as MealCategory,
              }))
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
            {updatedMeal.ingredients?.map((ingredient, index) => (
              <Flex key={index} gap="2" align="center">
                <TextField.Root
                  placeholder="Ingredient"
                  style={{ flex: 1 }}
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                />
                <IconButton
                  variant="soft"
                  color="red"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  <Cross2Icon />
                </IconButton>
              </Flex>
            ))}
          </Flex>
          <Button
            variant="ghost"
            onClick={handleAddIngredient}
            mx="2"
            style={{ alignSelf: "flex-start" }}
          >
            <PlusIcon />
            Add ingredient
          </Button>
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
  );
}
