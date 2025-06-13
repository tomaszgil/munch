import type { MealCategory, MealCreate } from "@/services/meals/types";
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
import { useState } from "react";

interface CreateMealDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (meal: MealCreate) => void;
}

const defaultMeal: MealCreate = {
  name: "",
  category: "breakfast",
  ingredients: [""],
};

export function CreateMealDialog({
  isOpen,
  onOpenChange,
  onSave,
}: CreateMealDialogProps) {
  const [meal, setMeal] = useState<MealCreate>(defaultMeal);

  const handleAddIngredient = () => {
    setMeal((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setMeal((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    setMeal((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? value : ing
      ),
    }));
  };

  const handleSave = () => {
    onSave(meal);
    setMeal(defaultMeal);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Add new meal</Dialog.Title>
        <Dialog.Description mb="4">
          Add a new meal to your list.
        </Dialog.Description>
        <Flex direction="column" gap="3">
          <TextField.Root
            placeholder="Meal name"
            value={meal.name}
            required
            onChange={(e) =>
              setMeal((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <Select.Root
            value={meal.category}
            onValueChange={(value) =>
              setMeal((prev) => ({ ...prev, category: value as MealCategory }))
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
            {meal.ingredients.map((ingredient, index) => (
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
