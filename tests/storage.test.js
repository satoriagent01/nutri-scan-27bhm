import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  saveProduct,
  getProducts,
  saveMeal,
  getMeals,
  saveDailyLog,
  getDailyLog,
} from "../src/storage.js";

describe("storage", () => {
  describe("saveProduct / getProducts", () => {
    test("saves and retrieves a product (AC-5)", () => {
      const storage = {};

      const product = {
        id: "prod-1",
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

      saveProduct(storage, product);

      const products = getProducts(storage);

      assert.strictEqual(products.length, 1);
      assert.deepStrictEqual(products[0], product);
    });

    test("returns empty array when no products saved", () => {
      const storage = {};
      assert.deepStrictEqual(getProducts(storage), []);
    });

    test("stores multiple products", () => {
      const storage = {};

      saveProduct(storage, { id: "prod-1", name: "Product A" });
      saveProduct(storage, { id: "prod-2", name: "Product B" });

      const products = getProducts(storage);
      assert.strictEqual(products.length, 2);
    });
  });

  describe("saveMeal / getMeals", () => {
    test("saves and retrieves a meal (AC-5)", () => {
      const storage = {};

      const meal = {
        id: "meal-1",
        name: "Breakfast",
        items: [
          {
            productId: "prod-1",
            quantity: 30,
            name: "Hazelnut Chocolate",
            energyKcal: 164.7,
          },
        ],
        date: "2024-01-15",
      };

      saveMeal(storage, meal);

      const meals = getMeals(storage);

      assert.strictEqual(meals.length, 1);
      assert.deepStrictEqual(meals[0], meal);
    });

    test("returns empty array when no meals saved", () => {
      const storage = {};
      assert.deepStrictEqual(getMeals(storage), []);
    });
  });

  describe("saveDailyLog / getDailyLog", () => {
    test("saves and retrieves a daily log (AC-5)", () => {
      const storage = {};

      const log = {
        date: "2024-01-15",
        totalEnergyKcal: 2000,
        totalFat: 80,
        totalCarbohydrates: 250,
        totalProtein: 100,
        totalSodium: 2.5,
      };

      saveDailyLog(storage, log);

      const logs = getDailyLog(storage);

      assert.strictEqual(logs.length, 1);
      assert.deepStrictEqual(logs[0], log);
    });

    test("returns empty array when no daily logs saved", () => {
      const storage = {};
      assert.deepStrictEqual(getDailyLog(storage), []);
    });

    test("stores multiple daily logs", () => {
      const storage = {};

      saveDailyLog(storage, { date: "2024-01-15", totalEnergyKcal: 2000 });
      saveDailyLog(storage, { date: "2024-01-16", totalEnergyKcal: 2200 });

      const logs = getDailyLog(storage);
      assert.strictEqual(logs.length, 2);
    });
  });
});