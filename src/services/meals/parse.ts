import { MealSchema, MealCreateSchema } from "./types";
import type { Meal, MealCreate } from "./types";

export const parseMeal = (meal: Meal) => {
  return MealSchema.parse(meal);
};

export const parseMealCreate = (meal: MealCreate) => {
  return MealCreateSchema.parse(meal);
};
