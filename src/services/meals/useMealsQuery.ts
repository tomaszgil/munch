import { useLocalStorageState } from "../../utils/useLocalStorageState";
import { key } from "./keys";
import type { Meal } from "./types";

export const useMealsQuery = () => {
  const [meals] = useLocalStorageState<Meal[]>(key, []);
  return meals;
};
