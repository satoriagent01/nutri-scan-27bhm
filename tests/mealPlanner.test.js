import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createMeal, calculateMealTotal } from "../src/mealPlanner.js";

describe("mealPlanner", () => {
  describe("createMeal", () => {
    test("creates a meal with items (AC-3)", () => {
      const items = [
        {
          productId: "prod-1",
          quantity: 30,
          name: "Hazelnut Chocolate",
          energyKcal: 164.7,
        },
        {
          productId: "prod-2",
          quantity: 200,
          name: "Apple Juice",
          energyKcal: 94,
        },
      ];

      const meal = createMeal("Breakfast", items);

      assert.strictEqual(meal.name, "Breakfast");
      assert.strictEqual(meal.items.length, 2);
      assert.ok(meal.id);
      assert.ok(meal.date);
    });

    test("creates a meal with no items", () => {
      const meal = createMeal("Empty Meal", []);

      assert.strictEqual(meal.name, "Empty Meal");
      assert.strictEqual(meal.items.length, 0);
      assert.ok(meal.id);
      assert.ok(meal.date);
    });
  });

  describe("calculateMealTotal", () => {
    test("calculates total nutrition for a meal (AC-3)", () => {
      const meal = {
        name: "Breakfast",
        items: [
          {
            productId: "prod-1",
            quantity: 30,
            name: "Hazelnut Chocolate",
            energyKj: 687.6,
            energyKcal: 164.7,
            fat: 9.9,
            saturatedFat: 3.9,
            carbohydrates: 16.5,
            sugars: 13.5,
            fiber: 0.72,
            protein: 2.04,
            sodium: 0.054,
          },
          {
            productId: "prod-2",
            quantity: 200,
            name: "Apple Juice",
            energyKj: 398,
            energyKcal: 94,
            fat: 0,
            saturatedFat: 0,
            carbohydrates: 22,
            sugars: 20,
            fiber: 1.4,
            protein: 0.8,
            sodium: 0,
          },
        ],
      };

      const total = calculateMealTotal(meal);

      assert.deepStrictEqual(total, {
        energyKj: 1085.6,
        energyKcal: 258.7,
        fat: 9.9,
        saturatedFat: 3.9,
        carbohydrates: 38.5,
        sugars: 33.5,
        fiber: 2.12,
        protein: 2.84,
        sodium: 0.054,
      });
    });

    test("returns zeros for empty meal", () => {
      const meal = {
        name: "Empty Meal",
        items: [],
      };

      const total = calculateMealTotal(meal);

      assert.deepStrictEqual(total, {
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

    test("handles single item meal", () => {
      const meal = {
        name: "Snack",
        items: [
          {
            productId: "prod-3",
            quantity: 100,
            name: "Olive Oil",
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
        ],
      };

      const total = calculateMealTotal(meal);

      assert.deepStrictEqual(total, {
        energyKj: 3404,
        energyKcal: 828,
        fat: 92,
        saturatedFat: 14,
        carbohydrates: 0,
        sugars: 0,
        fiber: 0,
        protein: 0,
        sodium: 0,
      });
    });
  });
});