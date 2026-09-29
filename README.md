# NutriScan

A free, ad-free web application that allows users to scan nutrition labels from food products using their camera, extract nutritional data via OCR and AI, and track their daily nutritional intake through a custom meal planner. All data is stored locally in the browser.

## Features

- **Scan Nutrition Labels**: Use your camera to capture nutrition labels and extract data via AI
- **Manual Entry**: Paste OCR text from nutrition labels for manual parsing
- **Product Database**: Save and manage your favorite food products
- **Meal Planner**: Create meals with multiple items and track nutritional totals
- **Local Storage**: All data stored locally in your browser - no server required

## Stack

- **Runtime**: Node 24 with ES modules
- **Testing**: Node's built-in test runner (`node --test`)
- **Build**: No build step
- **UI**: Static web page in `public/`
- **AI**: OpenAI-compatible endpoint (configured by user via URL and key)
- **Storage**: LocalStorage (browser-only, abstracted for testing)

## Modules

### `src/parser.js`
- `parseNutritionTable(text)` - Parses OCR text from nutrition labels into structured data with `per100g` and `perServing` sections

### `src/nutrition.js`
- `calculateNutrition(item, quantity)` - Scales nutrition values by quantity (e.g., per 100g to per serving)

### `src/mealPlanner.js`
- `createMeal(name, items)` - Creates a meal with a name and list of items
- `calculateMealTotal(meal)` - Calculates total nutrition for all items in a meal

### `src/storage.js`
- `saveProduct(storage, product)` / `getProducts(storage)` - Manage saved products
- `saveMeal(storage, meal)` / `getMeals(storage)` - Manage saved meals
- `saveDailyLog(storage, log)` / `getDailyLog(storage)` - Manage daily nutrition logs

### `src/ocr.js`
- `extractNutritionData(imageData, options)` - Sends image to AI endpoint for OCR and nutrition extraction

## How to Run

### Development

```bash
# Run tests
npm test

# Serve the web interface
npx serve public
```

### Configure AI Endpoint

1. Open the app in your browser
2. Go to the **Settings** tab
3. Enter your AI endpoint URL (e.g., `https://api.openai.com/v1/chat/completions`)
4. Enter your API key
5. Click **Save Settings**

The app uses an OpenAI-compatible endpoint. You can use any compatible service like OpenAI, Azure OpenAI, or local models via Ollama.

## How to Test

```bash
npm test
```

This runs all tests using Node's built-in test runner.

## What's Not Done Yet

- [ ] Real-time camera capture (currently uses file upload)
- [ ] Daily nutrition goals and tracking
- [ ] Meal recommendations based on dietary preferences
- [ ] Export to CSV/PDF
- [ ] Dark mode
- [ ] Mobile app (PWA support)
- [ ] Cloud sync for data backup

## License

MIT