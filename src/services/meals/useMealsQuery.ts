import { useSyncExternalStore } from "react";

import { store } from "./store";
import type { Meal, MealCategory, SortKey, SortDirection } from "./types";

export const useMealsQuery = ({
  category,
  search,
  sortKey = "updatedAt",
  sortDirection = "desc",
}: {
  category?: MealCategory;
  search?: string;
  sortKey?: SortKey;
  sortDirection?: SortDirection;
} = {}) => {
  const results = useSyncExternalStore<Meal[]>(store.subscribe, store.get);

  const filteredResults = results.filter((meal) => {
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

  return filteredResults.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortKey) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case "updatedAt":
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
        break;
      default:
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};
