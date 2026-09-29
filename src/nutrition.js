/**
 * Scale nutrition values by quantity.
 */

function calculateNutrition(item, quantity) {
  const scale = quantity / 100;

  return {
    name: item.name,
    quantity,
    energyKj: (item.per100g?.energyKj || 0) * scale,
    energyKcal: (item.per100g?.energyKcal || 0) * scale,
    fat: (item.per100g?.fat || 0) * scale,
    saturatedFat: (item.per100g?.saturatedFat || 0) * scale,
    carbohydrates: (item.per100g?.carbohydrates || 0) * scale,
    sugars: (item.per100g?.sugars || 0) * scale,
    fiber: (item.per100g?.fiber || 0) * scale,
    protein: (item.per100g?.protein || 0) * scale,
    sodium: (item.per100g?.sodium || 0) * scale,
  };
}

export { calculateNutrition };