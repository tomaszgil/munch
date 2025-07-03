import { MealSchema, MealCreateSchema } from "./types";
import type { Meal, MealCreate } from "./types";

function addMealBackwardCompatibility(meal: Meal | Omit<Meal, "favorite">) {
  if ("favorite" in meal) {
    return meal;
  }

  return {
    ...meal,
    favorite: false,
  };
}

export const parseMeal = (meal: Meal) => {
  return MealSchema.parse(addMealBackwardCompatibility(meal));
};

export const parseMealCreate = (meal: MealCreate) => {
  return MealCreateSchema.parse(meal);
};
