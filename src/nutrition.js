/**
 * Scale nutrition values by quantity.
 * @param {object} item - The nutrition item with per100g values
 * @param {number} quantity - The quantity in grams
 * @returns {object} Scaled nutrition values
 */
export function calculateNutrition(item, quantity) {
  const per100g = item.per100g || {};
  const scale = quantity / 100;

  return {
    name: item.name,
    quantity: quantity,
    energyKj: (per100g.energyKj || 0) * scale,
    energyKcal: (per100g.energyKcal || 0) * scale,
    fat: (per100g.fat || 0) * scale,
    saturatedFat: (per100g.saturatedFat || 0) * scale,
    carbohydrates: (per100g.carbohydrates || 0) * scale,
    sugars: (per100g.sugars || 0) * scale,
    fiber: (per100g.fiber || 0) * scale,
    protein: (per100g.protein || 0) * scale,
    sodium: (per100g.sodium || 0) * scale,
  };
}