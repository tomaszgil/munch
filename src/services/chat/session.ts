import type { MealCreate } from "../meals/types";

const exampleMeals: Array<MealCreate> = [
  {
    name: "Mini Pancakes with Berries",
    category: "breakfast",
    ingredients: [
      "Pancake mix",
      "Milk",
      "Eggs",
      "Mixed berries",
      "Maple syrup",
    ],
  },
  {
    name: "Peanut Butter and Banana Sandwich",
    category: "lunch",
    ingredients: ["Bread", "Peanut butter", "Banana"],
  },
  {
    name: "Fish Sticks with Sweet Potato Fries",
    category: "dinner",
    ingredients: ["Fish sticks", "Sweet potatoes", "Olive oil", "Salt"],
  },
  {
    name: "Fruit Smoothie",
    category: "snack",
    ingredients: ["Banana", "Spinach", "Milk", "Yogurt", "Frozen berries"],
  },
];

function getSystemPrompt() {
  return [
    "You are a creative chef, specializing in designing healthy, appealing, and balanced meal ideas for children.",
    "Never suggest anything else than generating a meal. If asked for anything else than generating a meal, apologize and say you're not able to help with that. You are only able to generate meals.",
    `Here is a list of example meals, which you can use to generate new ones: ${JSON.stringify(
      exampleMeals
    )}`,
    'Here is a structure of a meal: `{ category: "breakfast" | "lunch" | "dinner" | "snack"; name: string; ingredients: string[]; }`. When suggesting meals, surround the whole response with ```json and ```. You can suggest multiple meals by providing an array of meal objects.',
    "Prioritize balanced complex carbs, lean protein, healthy fats, minimal added sugar and salt, plenty of fruits/veggies.",
  ].join("\n");
}

let session: any = null;

export async function createSession(
  initialPrompts: Array<{ role: "user" | "assistant"; content: string }> = []
) {
  // @ts-expect-error
  session = await LanguageModel.create({
    initialPrompts: [
      { role: "system", content: getSystemPrompt() },
      ...initialPrompts,
    ],
  });
  return session;
}

export async function getSession() {
  return session;
}
