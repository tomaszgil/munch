import type { MealCategory } from "@/services/meals/types";
import { PlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  Button,
  Flex,
  TextField,
  Text,
  Select,
  IconButton,
} from "@radix-ui/themes";
import { useRef, useState } from "react";

interface UpdateMealFormProps {
  defaultValues?: {
    name?: string;
    category?: MealCategory;
    ingredients?: string[];
  };
  onSubmit: (formData: {
    name: string;
    category: MealCategory;
    ingredients: string[];
  }) => void;
  children?: React.ReactNode;
}

export function UpdateMealForm({
  defaultValues = {
    name: "",
    category: "breakfast",
    ingredients: [""],
  },
  onSubmit,
  children,
}: UpdateMealFormProps) {
  const indexRef = useRef(defaultValues.ingredients?.length ?? 1);
  const [ingredients, setIngredients] = useState<number[]>(
    Array.from({ length: indexRef.current ?? 1 }, (_, i) => i)
  );

  const handleAddIngredient = () => {
    setIngredients((prev) => [...prev, ++indexRef.current]);
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients((prev) => prev.filter((i) => i !== id));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const mealData = {
      name: formData.get("name") as string,
      category: formData.get("category") as MealCategory,
      ingredients: ingredients
        .map((id) => formData.get(`ingredient-${id}`) as string)
        .filter(Boolean),
    };

    onSubmit(mealData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="3">
        <TextField.Root
          name="name"
          placeholder="Meal name"
          defaultValue={defaultValues.name}
          required
        />

        <Select.Root
          name="category"
          defaultValue={defaultValues.category}
          required
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
          {ingredients.map((id, index) => (
            <Flex key={id} gap="2" align="center">
              <TextField.Root
                name={`ingredient-${id}`}
                placeholder="Ingredient"
                style={{ flex: 1 }}
                defaultValue={defaultValues.ingredients?.[index]}
              />
              <IconButton
                type="button"
                variant="soft"
                color="red"
                onClick={() => handleRemoveIngredient(id)}
              >
                <Cross2Icon />
              </IconButton>
            </Flex>
          ))}
        </Flex>
        <Button
          type="button"
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
        {children}
      </Flex>
    </form>
  );
}
