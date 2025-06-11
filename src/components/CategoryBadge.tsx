import { Badge } from "@radix-ui/themes";

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Breakfast":
      return "blue";
    case "Lunch":
      return "green";
    case "Dinner":
      return "red";
    default:
      return "gray";
  }
};

export const CategoryBadge = ({ category }: { category: string }) => {
  return <Badge color={getCategoryColor(category)}>{category}</Badge>;
};
