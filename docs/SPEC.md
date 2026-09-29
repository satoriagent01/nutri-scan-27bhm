# NutriScan - Product Specification

## Overview
NutriScan is a free, ad-free web application that allows users to scan nutrition labels from food products using their camera, extract nutritional data via OCR and AI, and track their daily nutritional intake through a custom meal planner. All data is stored locally in the browser.

## Stack
- **Runtime**: Node 24 with ES modules
- **Testing**: Node's built-in test runner (`node --test`)
- **Build**: No build step
- **UI**: Static web page in `public/`
- **AI**: OpenAI-compatible endpoint (configured by user via URL and key)
- **Storage**: LocalStorage (browser-only, abstracted for testing)

## Modules

### `src/ocr.js`
- `extractNutritionData(imageData: string): Promise<NutritionData>`
  - Takes base64-encoded image data, sends to AI endpoint, returns parsed nutrition data.
  - Example input: base64 string of a nutrition label image.
  - Example output: `{ energy: { value: 2292, unit: 'kJ' }, fat: { value: 33, unit: 'g' }, ... }`

### `src/parser.js`
- `parseNutritionTable(text: string): NutritionData`
  - Parses a string containing a nutrition table (OCR output) into structured data.
  - Example input: `"Energie 2292 kJ / 549 kcal\nFett 33 g\nKohlenhydrate 55 g"`
  - Example output: `{ energy: { value: 2292, unit: 'kJ' }, fat: { value: 33, unit: 'g' }, carbohydrates: { value: 55, unit: 'g' } }`

### `src/nutrition.js`
- `calculateNutrition(item: FoodItem, quantity: number): NutritionData`
  - Calculates nutritional values for a given quantity of a food item.
  - Example input: `{ name: 'Hazelnut chocolate', nutrition: { energy: { value: 2292, unit: 'kJ' }, fat: { value: 33, unit: 'g' } } }, 50`
  - Example output: `{ energy: { value: 1146, unit: 'kJ' }, fat: { value: 16.5, unit: 'g' } }`

### `src/storage.js`
- `saveProduct(product: Product): void`
- `getProducts(): Product[]`
- `saveMeal(meal: Meal): void`
- `getMeals(date: string): Meal[]`
- `saveDailyLog(log: DailyLog): void`
- `getDailyLog(date: string): DailyLog`
  - All methods interact with a storage object (e.g., localStorage wrapper) passed as a parameter.

### `src/mealPlanner.js`
- `createMeal(name: string, items: MealItem[]): Meal`
- `calculateMealTotal(meal: Meal): NutritionData`
  - Example input: `{ name: 'Breakfast', items: [{ productId: '1', quantity: 30 }] }`
  - Example output: `{ name: 'Breakfast', totalNutrition: { energy: { value: 688, unit: 'kJ' }, fat: { value: 10, unit: 'g' } } }`

## Acceptance Criteria

### AC-1: Scan Nutrition Labels
- Users can take a photo of a nutrition label using their device's camera.
- The app uses OCR and AI to extract nutritional data from the image.
- Extracted data is displayed to the user for confirmation and editing.
- Example: Scanning a hazelnut chocolate bar label (as in `1.jpg`) extracts energy (2292 kJ/549 kcal per 100g), fat (33g), carbohydrates (55g), sugars (45g), fiber (2.4g), protein (6.8g), salt (0.18g).

### AC-2: Custom Meal Planning
- Users can create meals by adding scanned products or manually entering food items.
- For each item, users specify the quantity (e.g., grams).
- The app calculates the total nutritional value for the meal.
- Example: Adding 30g of hazelnut chocolate (from AC-1) to a meal results in energy (688 kJ/165 kcal), fat (10g), carbohydrates (16g), sugars (14g), fiber (0.7g), protein (2.0g), salt (0.05g).

### AC-3: Track Daily Intake
- A daily log shows meals added for the day and the total nutritional intake.
- Users can view their intake for any given day.
- Example: A day with two meals (breakfast and lunch) shows the sum of all nutritional values from both meals.

### AC-4: Free and Ad-Free
- The app is free to use with no advertisements.
- All data is stored locally in the browser.

### AC-5: Multi-language Support
- The app supports nutrition labels in multiple languages (e.g., German, French, Italian, Dutch).
- Example: Scanning a Dutch juice label (as in `2.jpg`) extracts energy (199 kJ/47 kcal per 100ml), fat (0g), carbohydrates (11g), sugars (10g), fiber (0g), protein (0.7g), salt (0g).

### AC-6: User-configurable AI Endpoint
- Users can configure their own OpenAI-compatible endpoint (URL and key).
- The tests never call the AI endpoint; they use mock data.

## Examples from Shared Images

### Image 1 (`1.jpg`)
- **Product**: Hazelnut chocolate bar (Dr. Schär AG)
- **Language**: Multi-language (German, French, Italian, Dutch)
- **Nutrition per 100g**:
  - Energy: 2292 kJ / 549 kcal
  - Fat: 33g (of which saturates: 13g)
  - Carbohydrates: 55g (of which sugars: 45g)
  - Fiber: 2.4g
  - Protein: 6.8g
  - Salt: 0.18g
- **Nutrition per 30g (1 Melto)**:
  - Energy: 688 kJ / 165 kcal
  - Fat: 10g
  - Carbohydrates: 16g
  - Sugars: 14g
  - Fiber: 0.7g
  - Protein: 2.0g
  - Salt: 0.05g

### Image 2 (`2.jpg`)
- **Product**: Apple-orange-mango juice (Versgeperst Appel-Sinaasappel- en Mangosap)
- **Language**: Dutch
- **Volume**: 1L, 5 portions (200ml)
- **Nutrition per 100ml**:
  - Energy: 199 kJ / 47 kcal
  - Fat: 0g
  - Carbohydrates: 11g (of which sugars: 10g)
  - Fiber: 0g
  - Protein: 0.7g
  - Salt: 0g
- **Nutrition per 200ml (glas)**:
  - Energy: 399 kJ / 94 kcal
  - Fat: 0g
  - Carbohydrates: 22g (of which sugars: 20g)
  - Fiber: 0g
  - Protein: 1.4g
  - Salt: 0g
- **Vitamin C**: 26% per 100ml, 21mg per 200ml

### Image 3 (`3.jpg`)
- **Product**: Extra virgin olive oil spray (Extra Olijfolie van de Eerste Persing)
- **Language**: Dutch
- **Volume**: 200ml
- **Nutrition per 100ml**:
  - Energy: 3404 kJ / 828 kcal
  - Fat: 92g (of which saturates: 14g)
  - Carbohydrates: 0g (of which sugars: 0g)
  - Fiber: 0g
  - Protein: 0g
  - Salt: 0g
- **Vitamin E**: 150% of daily reference intake