import { Badge } from "@radix-ui/themes";

import type { MealCategory } from "@/services/meals/types";

const getCategoryColor = (category: MealCategory) => {
  switch (category) {
    case "breakfast":
      return "blue";
    case "lunch":
      return "green";
    case "dinner":
      return "orange";
    default:
      return "purple";
  }
};

const getCategoryName = (category: MealCategory) => {
  switch (category) {
    case "breakfast":
      return "Breakfast";
    case "lunch":
      return "Lunch";
    case "dinner":
      return "Dinner";
    default:
      return "Snack";
  }
};

export const CategoryBadge = ({ category }: { category: MealCategory }) => {
  return (
    <Badge color={getCategoryColor(category)}>
      {getCategoryName(category)}
    </Badge>
  );
};
