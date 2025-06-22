import { Badge, Card, Flex, Text } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { Meal } from "@/services/meals/types";

interface MealCardProps {
  meal: Meal;
  children?: React.ReactNode;
}

export function MealCard({ meal, children }: MealCardProps) {
  return (
    <Card size="2">
      <Flex justify="between" align="center">
        <Flex direction="column" gap="1">
          <Text weight="bold" truncate>
            <Link
              to="/meals/$mealId"
              params={{ mealId: meal.id }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {meal.name}
            </Link>
          </Text>
          <Flex gap="2" align="center">
            <CategoryBadge category={meal.category} />
            <Flex gap="2" align="center">
              <Text size="2" color="gray" truncate>
                {meal.ingredients.slice(0, 3).join(", ")}
              </Text>
              {meal.ingredients.length > 3 && (
                <Badge color="gray" variant="soft">
                  + {meal.ingredients.length - 3}
                </Badge>
              )}
            </Flex>
          </Flex>
        </Flex>
        {children}
      </Flex>
    </Card>
  );
}
