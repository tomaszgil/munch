export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

export type Meal = {
  id: string;
  name: string;
  ingredients: Array<string>;
  category: MealCategory;
};
