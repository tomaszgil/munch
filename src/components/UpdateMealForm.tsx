import { useState } from "react";
import type { MealCategory } from "@/services/meals/types";
import { PlusIcon, Cross2Icon, InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Button,
  Flex,
  TextField,
  Text,
  Select,
  IconButton,
  Callout,
} from "@radix-ui/themes";
import { z } from "zod/v4";

const mealFormSchema = z.object({
  name: z.string().min(1, "Meal name is required."),
  category: z.enum(["breakfast", "lunch", "dinner", "snack"] as const),
  ingredients: z
    .array(z.string().min(1, "Ingredient cannot be empty."))
    .min(1, "At least one ingredient is required."),
});

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
    ingredients: [],
  },
  onSubmit,
  children,
}: UpdateMealFormProps) {
  const [errors, setErrors] = useState<Array<string>>([]);
  const [ingredientFieldNames, setIngredientFieldNames] = useState<string[]>(
    Array.from(
      { length: defaultValues.ingredients?.length || 1 },
      (_, index) => `ingredient-${index}`
    )
  );

  const handleAddIngredient = () => {
    setIngredientFieldNames((prev) => [...prev, `ingredient-${prev.length}`]);
  };

  const handleRemoveIngredient = (name: string) => {
    setIngredientFieldNames((prev) => prev.filter((n) => n !== name));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const mealData = {
      name: formData.get("name") as string,
      category: formData.get("category") as MealCategory,
      ingredients: ingredientFieldNames
        .map((name) => formData.get(name)?.toString().trim() ?? "")
        .filter(Boolean),
    };

    const parsed = mealFormSchema.safeParse(mealData);
    if (parsed.success) {
      onSubmit(mealData);
    } else {
      setErrors(parsed.error.issues.map((issue) => issue.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.map((error) => (
        <Callout.Root key={error} color="red" size="1" mb="3">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      ))}
      <Flex direction="column" gap="3">
        <TextField.Root
          name="name"
          placeholder="Meal name"
          defaultValue={defaultValues.name}
        />

        <Select.Root name="category" defaultValue={defaultValues.category}>
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
          {ingredientFieldNames.map((name, index) => (
            <Flex key={name} gap="2" align="center">
              <TextField.Root
                name={name}
                placeholder="Ingredient"
                style={{ flex: 1 }}
                defaultValue={defaultValues.ingredients?.[index]}
              />
              <IconButton
                type="button"
                variant="soft"
                color="red"
                onClick={() => handleRemoveIngredient(name)}
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
