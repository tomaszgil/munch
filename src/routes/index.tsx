import { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Text,
  DataList,
  Button,
  DropdownMenu,
} from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { useMealsQuery } from "@/services/meals/useMealsQuery";
import { useMealsByCategory } from "@/services/meals/useMealsByCategory";
import type { MealCategory, Meal } from "@/services/meals/types";

import { CategoryBadge } from "@/components/CategoryBadge";
import { MealCard } from "@/components/MealCard";
import { useBrandBackground } from "@/components/navigation/useBrandBackground";

const orderedCategories = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
] as const;

export const Route = createFileRoute("/")({
  component: App,
});

function RecentMeals() {
  const meals = useMealsQuery({
    sortKey: "updatedAt",
    sortDirection: "desc",
    limit: 3,
  });

  if (meals.length === 0) {
    return (
      <Flex direction="column" align="center" gap="2" py="6">
        <Heading size="4" align="center">
          No meals available
        </Heading>
        <Text color="gray" align="center">
          You haven't added any meals yet.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="3">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </Flex>
  );
}

function FavoriteMeals() {
  const meals = useMealsQuery({
    favorite: true,
    sortKey: "updatedAt",
    sortDirection: "desc",
    limit: 3,
  });

  if (meals.length === 0) {
    return (
      <Flex direction="column" align="center" gap="2" py="6">
        <Heading size="4" align="center">
          No favorite meals
        </Heading>
        <Text color="gray" align="center">
          You haven't marked any meals as favorites yet.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="3">
      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </Flex>
  );
}

function Analytics() {
  const meals = useMealsQuery();
  const mealsByCategory = useMealsByCategory();

  return (
    <Grid columns="2" gap="4">
      <Flex direction="column" gap="1">
        <Text size="6" weight="bold">
          {meals.length}
        </Text>
        <Text size="2" color="gray">
          Total Meals
        </Text>
      </Flex>
      <DataList.Root>
        {orderedCategories.map(({ value }) => (
          <DataList.Item key={value}>
            <DataList.Label>
              <CategoryBadge category={value as any} />
            </DataList.Label>
            <DataList.Value>{mealsByCategory[value]}</DataList.Value>
          </DataList.Item>
        ))}
      </DataList.Root>
    </Grid>
  );
}

const AnimatedDrawer = function AnimatedDrawer({
  items,
  selectedItem,
}: {
  items: Meal[];
  selectedItem: Meal | null;
}) {
  const count = useRef(0);
  const [animationItems, setAnimationItems] = useState<Meal[]>([]);

  useEffect(() => {
    if (selectedItem && items.length > 0) {
      const rouletteItems = Array.from({ length: 4 }, () => {
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
      });

      count.current++;
      setAnimationItems([...rouletteItems, selectedItem]);
    }
  }, [selectedItem, items]);

  return (
    <div style={{ position: "relative", minHeight: "80px" }}>
      {animationItems.map((meal, index) => (
        <div
          key={`${count.current}-${index}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: index + 1,
            backgroundColor: "var(--color-panel-solid)",
            animation: `slideUp 0.3s ease-in-out ${index * 0.25}s forwards`,
            opacity: 0,
            transform: "translateY(40px)",
            pointerEvents:
              index === animationItems.length - 1 ? "auto" : "none",
          }}
        >
          <MealCard meal={meal} />
        </div>
      ))}
    </div>
  );
};

function RandomMealDrawer() {
  const [randomMeal, setRandomMeal] = useState<Meal | null>(null);
  const meals = useMealsQuery();
  const mealsByCategory = useMealsByCategory();

  const getRandomMeal = useCallback(
    (category?: MealCategory) => {
      if (meals.length === 0) return null;
      const mealsToDraw = category
        ? meals.filter((meal) => meal.category === category)
        : meals;
      return mealsToDraw[Math.floor(Math.random() * mealsToDraw.length)];
    },
    [meals]
  );

  if (meals.length === 0) {
    return (
      <Flex direction="column" align="center" gap="2" py="6">
        <Heading size="4" align="center">
          No meals available
        </Heading>
        <Text color="gray" align="center">
          You haven't added any meals yet.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4">
      <Flex align="center">
        <Button
          onClick={() => setRandomMeal(getRandomMeal())}
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        >
          Draw random meal
        </Button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button
              variant="soft"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              Draw by category
              <ChevronDownIcon />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            {orderedCategories.map(({ value, label }) => (
              <DropdownMenu.Item
                disabled={mealsByCategory[value] === 0}
                key={value}
                onClick={() => setRandomMeal(getRandomMeal(value))}
              >
                {label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>

      {!randomMeal && (
        <Card size="2">
          <Flex minHeight="48px" align="center" justify="center">
            <Text color="gray" size="2">
              Your meal drawer is empty
            </Text>
          </Flex>
        </Card>
      )}

      {randomMeal && <AnimatedDrawer items={meals} selectedItem={randomMeal} />}
    </Flex>
  );
}

function App() {
  const brandBackground = useBrandBackground();

  return (
    <Box maxWidth="960px" mx="auto">
      <Heading as="h1" size="6" mt="4" mb="5">
        Dashboard
      </Heading>

      <Flex
        direction="column"
        gap="3"
        style={{
          ...brandBackground,
          border: 0,
          padding: "var(--space-5)",
          borderRadius: "var(--radius-4)",
        }}
        mb="5"
      >
        <Heading as="h2" size="5">
          Welcome to Munch! 👋
        </Heading>
        <Text size="3">
          Your personal meal management companion for kids. Track your favorite
          dishes, organize them by categories, and never wonder what to cook
          again. Draw random meals for inspiration or browse your recent entries
          to plan your next delicious meal for the little ones.
        </Text>
      </Flex>

      <Grid columns={{ initial: "1", md: "2" }} gap="4">
        <Card size="3">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4">
              Recent Meals
            </Heading>
            <Text size="2" color="gray" mb="4">
              View your most recent meal entries.
            </Text>
            <RecentMeals />
          </Flex>
        </Card>

        <Card size="3">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4">
              Favorite Meals
            </Heading>
            <Text size="2" color="gray" mb="4">
              Your most recently updated favorite meals.
            </Text>
            <FavoriteMeals />
          </Flex>
        </Card>

        <Card size="3">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4">
              Random Meal Drawer
            </Heading>
            <Text size="2" color="gray" mb="4">
              Draw a random meal from the database.
            </Text>
            <RandomMealDrawer />
          </Flex>
        </Card>
        <Card size="3">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4">
              Meal Analytics
            </Heading>
            <Text size="2" color="gray" mb="4">
              View analytics for your meal entries.
            </Text>
            <Analytics />
          </Flex>
        </Card>
      </Grid>
    </Box>
  );
}
