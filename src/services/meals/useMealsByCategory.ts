import type { MealCategory } from "./types";

import { useMealsQuery } from "./useMealsQuery";

export const useMealsByCategory = () => {
  const meals = useMealsQuery();
  return meals.reduce(
    (acc, meal) => {
      acc[meal.category] = (acc[meal.category] || 0) + 1;
      return acc;
    },
    {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
    } as Record<MealCategory, number>
  );
};
