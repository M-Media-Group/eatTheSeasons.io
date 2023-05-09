// A simple script that populates the indexedDB table of eatenFoodItems

import { addToIndexedDB } from "@/helpers";
import { consumedItem } from "@/types/consumedItem";

const DATA_COUNT = 10_000;

export const run = async () => {
  for (let i = 0; i < DATA_COUNT; i++) {
    const value = {
      id: i,
      alcohol: Math.random() * 1000,
      carbohydrate: Math.random() * 1000,
      created_at: new Date().toISOString(),
      description: "test",
      fat: Math.random() * 1000,
      fiber: Math.random() * 1000,
      food_id: Math.round(Math.random() * 1000),
      grams: Math.random() * 1000,
      kcal: Math.random() * 1000,
      name: "test",
      protein: Math.random() * 1000,
      updated_at: new Date().toISOString(),
      water: Math.random() * 1000,
    } as consumedItem;
    console.log("Adding to indexedDB", i);
    await addToIndexedDB(value);
  }
};
