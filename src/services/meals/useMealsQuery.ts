import { useSyncExternalStore } from "react";
import { store } from "./store";
import type { Meal, MealCategory } from "./types";

export const useMealsQuery = ({
  category,
  search,
}: {
  category?: MealCategory;
  search?: string;
} = {}) => {
  const results = useSyncExternalStore<Meal[]>(store.subscribe, store.get);
  return results.filter((meal) => {
    let matches = true;
    if (category !== undefined) {
      matches = matches && meal.category === category;
    }
    if (search !== undefined) {
      matches =
        matches &&
        [
          meal.name.toLowerCase(),
          ...meal.ingredients.map((i) => i.toLowerCase()),
        ].some((i) => i.includes(search.toLowerCase()));
    }
    return matches;
  });
};
