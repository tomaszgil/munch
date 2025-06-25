import { DataList } from "@radix-ui/themes";
import { CategoryBadge } from "./CategoryBadge";
import type { MealCreate } from "@/services/meals/types";

interface MealDetailsProps {
  meal: MealCreate;
}

export function MealDetails({ meal }: MealDetailsProps) {
  return (
    <DataList.Root>
      <DataList.Item>
        <DataList.Label>Name</DataList.Label>
        <DataList.Value>{meal.name}</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Category</DataList.Label>
        <DataList.Value>
          <CategoryBadge category={meal.category} />
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Ingredients</DataList.Label>
        <DataList.Value>
          <ol style={{ margin: 0, paddingLeft: "1rem" }}>
            {meal.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ol>
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  );
}
