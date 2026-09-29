/**
 * Save a product to storage.
 * @param {object} storage - The storage object
 * @param {object} product - The product to save
 */
export function saveProduct(storage, product) {
  if (!storage.products) {
    storage.products = [];
  }
  storage.products.push(product);
}

/**
 * Get all products from storage.
 * @param {object} storage - The storage object
 * @returns {Array} Array of products
 */
export function getProducts(storage) {
  return storage.products || [];
}

/**
 * Save a meal to storage.
 * @param {object} storage - The storage object
 * @param {object} meal - The meal to save
 */
export function saveMeal(storage, meal) {
  if (!storage.meals) {
    storage.meals = [];
  }
  storage.meals.push(meal);
}

/**
 * Get all meals from storage.
 * @param {object} storage - The storage object
 * @returns {Array} Array of meals
 */
export function getMeals(storage) {
  return storage.meals || [];
}

/**
 * Save a daily log to storage.
 * @param {object} storage - The storage object
 * @param {object} log - The daily log to save
 */
export function saveDailyLog(storage, log) {
  if (!storage.dailyLogs) {
    storage.dailyLogs = [];
  }
  storage.dailyLogs.push(log);
}

/**
 * Get all daily logs from storage.
 * @param {object} storage - The storage object
 * @returns {Array} Array of daily logs
 */
export function getDailyLog(storage) {
  return storage.dailyLogs || [];
}