import { useCallback } from "react";
import { useLocalStorageState } from "../../utils/useLocalStorageState";
import { key } from "./keys";
import type { Meal, MealCategory } from "./types";

type MealUpdate = {
  name?: string;
  ingredients?: string[];
  category?: MealCategory;
};

export const useMealUpdate = () => {
  const [_, setMeals] = useLocalStorageState<Meal[]>(key, []);

  const updateMeal = useCallback(
    (id: string, updates: MealUpdate) => {
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.id === id
            ? {
                ...meal,
                ...updates,
              }
            : meal
        )
      );
    },
    [setMeals]
  );

  return updateMeal;
};
