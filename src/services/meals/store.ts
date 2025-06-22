import type { Meal } from "./types";
import { parseMeal } from "./parse";

const key = "v1/meals";

let resultString: string = "";
let resultParsed: Array<Meal> = [];

export const store = {
  subscribe: (callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  },
  get: () => {
    const storedString = localStorage.getItem(key) || "";
    if (storedString !== resultString) {
      const rawResultParsed = storedString ? JSON.parse(storedString) : [];
      resultParsed = rawResultParsed.map(parseMeal);
      resultString = storedString;
    }
    return resultParsed;
  },
  getById: (id: string) => {
    return store.get().find((meal) => meal.id === id);
  },
  set: (value: Array<Meal>) => {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("storage"));
  },
  delete: (id: string) => {
    const deletedMeal = resultParsed.find((meal) => meal.id === id);
    const updatedMeals = resultParsed.filter((meal) => meal.id !== id);
    store.set(updatedMeals);
    return deletedMeal;
  },
  update: (id: string, updates: Partial<Meal>) => {
    const updatedMeals = resultParsed.map((meal) =>
      meal.id === id ? { ...meal, ...updates } : meal
    );
    store.set(updatedMeals);
    return updatedMeals.find((meal) => meal.id === id);
  },
  create: (meal: Meal) => {
    const updatedMeals = [...resultParsed, meal];
    store.set(updatedMeals);
    return meal;
  },
  reset: () => {
    store.set([]);
  },
};
