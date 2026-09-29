import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateNutrition } from "../src/nutrition.js";

describe("calculateNutrition", () => {
  test("scales nutrition values by quantity (AC-4)", () => {
    const item = {
      name: "Hazelnut Chocolate",
      per100g: {
        energyKj: 2292,
        energyKcal: 549,
        fat: 33,
        saturatedFat: 13,
        carbohydrates: 55,
        sugars: 45,
        fiber: 2.4,
        protein: 6.8,
        sodium: 0.18,
      },
    };

    const result = calculateNutrition(item, 30);

    assert.deepStrictEqual(result, {
      name: "Hazelnut Chocolate",
      quantity: 30,
      energyKj: 687.6,
      energyKcal: 164.7,
      fat: 9.9,
      saturatedFat: 3.9,
      carbohydrates: 16.5,
      sugars: 13.5,
      fiber: 0.72,
      protein: 2.04,
      sodium: 0.054,
    });
  });

  test("handles 100g quantity (no scaling)", () => {
    const item = {
      name: "Apple Juice",
      per100g: {
        energyKj: 199,
        energyKcal: 47,
        fat: 0,
        saturatedFat: 0,
        carbohydrates: 11,
        sugars: 10,
        fiber: 0.7,
        protein: 0.4,
        sodium: 0,
      },
    };

    const result = calculateNutrition(item, 100);

    assert.deepStrictEqual(result, {
      name: "Apple Juice",
      quantity: 100,
      energyKj: 199,
      energyKcal: 47,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 11,
      sugars: 10,
      fiber: 0.7,
      protein: 0.4,
      sodium: 0,
    });
  });

  test("handles zero quantity", () => {
    const item = {
      name: "Olive Oil",
      per100g: {
        energyKj: 3404,
        energyKcal: 828,
        fat: 92,
        saturatedFat: 14,
        carbohydrates: 0,
        sugars: 0,
        fiber: 0,
        protein: 0,
        sodium: 0,
      },
    };

    const result = calculateNutrition(item, 0);

    assert.deepStrictEqual(result, {
      name: "Olive Oil",
      quantity: 0,
      energyKj: 0,
      energyKcal: 0,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 0,
      sugars: 0,
      fiber: 0,
      protein: 0,
      sodium: 0,
    });
  });
});