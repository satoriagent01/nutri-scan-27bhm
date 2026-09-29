/**
 * Storage functions with storage object parameter.
 */

function saveProduct(storage, product) {
  if (!storage.products) {
    storage.products = [];
  }
  storage.products.push(product);
}

function getProducts(storage) {
  return storage.products || [];
}

function saveMeal(storage, meal) {
  if (!storage.meals) {
    storage.meals = [];
  }
  storage.meals.push(meal);
}

function getMeals(storage) {
  return storage.meals || [];
}

function saveDailyLog(storage, log) {
  if (!storage.dailyLogs) {
    storage.dailyLogs = [];
  }
  storage.dailyLogs.push(log);
}

function getDailyLog(storage) {
  return storage.dailyLogs || [];
}

export { saveProduct, getProducts, saveMeal, getMeals, saveDailyLog, getDailyLog };