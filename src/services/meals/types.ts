import { z } from "zod/v4";

export const MealCategorySchema = z.enum([
  "breakfast",
  "lunch",
  "dinner",
  "snack",
]);

export const MealCreateSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  category: MealCategorySchema,
});

export const MealSchema = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: z.array(z.string()),
  category: MealCategorySchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Meal = z.infer<typeof MealSchema>;
export type MealCategory = Meal["category"];

export type MealCreate = z.infer<typeof MealCreateSchema>;
export type MealUpdate = Partial<Omit<Meal, "id" | "createdAt" | "updatedAt">>;
