import { Card, Flex, Text } from "@radix-ui/themes";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { Meal } from "@/services/meals/types";

interface MealCardProps {
  meal: Meal;
  children: React.ReactNode;
}

export function MealCard({ meal, children }: MealCardProps) {
  return (
    <Card key={meal.id} size="2">
      <Flex justify="between" align="center">
        <Flex direction="column" gap="1">
          <Text weight="bold">{meal.name}</Text>
          <Flex gap="2" align="center">
            <CategoryBadge category={meal.category} />
            <Text size="2" color="gray">
              {meal.ingredients.join(", ")}
            </Text>
          </Flex>
        </Flex>
        {children}
      </Flex>
    </Card>
  );
}
