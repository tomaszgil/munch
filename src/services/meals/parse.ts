import { MealSchema } from "./types";
import type { Meal } from "./types";

export const parseMeal = (meal: Meal) => {
  return MealSchema.parse(meal);
};
