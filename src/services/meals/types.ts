import { z } from "zod/v4";

export const MealSchema = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: z.array(z.string()),
  category: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Meal = z.infer<typeof MealSchema>;
export type MealCategory = Meal["category"];

export type MealCreate = Omit<Meal, "id" | "createdAt" | "updatedAt">;
export type MealUpdate = Partial<Omit<Meal, "id" | "createdAt" | "updatedAt">>;
