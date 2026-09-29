import { randomUUID } from 'node:crypto';

/**
 * Create a meal with a name and items.
 * @param {string} name - The name of the meal
 * @param {Array} items - Array of meal items
 * @returns {object} The created meal
 */
export function createMeal(name, items) {
  return {
    id: randomUUID(),
    name: name,
    items: items || [],
    date: new Date().toISOString().split('T')[0],
  };
}

/**
 * Calculate the total nutrition for a meal.
 * @param {object} meal - The meal object with items
 * @returns {object} Total nutrition values
 */
export function calculateMealTotal(meal) {
  const total = {
    energyKj: 0,
    energyKcal: 0,
    fat: 0,
    saturatedFat: 0,
    carbohydrates: 0,
    sugars: 0,
    fiber: 0,
    protein: 0,
    sodium: 0,
  };

  if (!meal.items || meal.items.length === 0) {
    return total;
  }

  for (const item of meal.items) {
    total.energyKj += item.energyKj || 0;
    total.energyKcal += item.energyKcal || 0;
    total.fat += item.fat || 0;
    total.saturatedFat += item.saturatedFat || 0;
    total.carbohydrates += item.carbohydrates || 0;
    total.sugars += item.sugars || 0;
    total.fiber += item.fiber || 0;
    total.protein += item.protein || 0;
    total.sodium += item.sodium || 0;
  }

  return total;
}