# NutriScan

A free, ad-free nutrition tracking app that lets you scan nutrition labels from food products, extract nutritional data via OCR and AI, and track your daily intake through a custom meal planner. All data is stored locally in your browser.

## Features

- **Scan Nutrition Labels**: Take a photo of a nutrition label and extract nutritional data (calories, fats, carbs, protein, sodium, etc.) using AI-powered OCR.
- **Custom Meal Planning**: Create meals by adding scanned products or manually entering food items. Specify quantities and get calculated totals.
- **Track Daily Intake**: View your total nutritional intake for any given day, broken down by meal.
- **Multi-language Support**: Works with nutrition labels in German, Dutch, French, Italian, and English.
- **Free & Ad-Free**: No cost, no advertisements. All data stays on your device.

## How to Run

### Prerequisites

- Node.js 24+ (for running tests)
- A modern web browser

### Running the App

Simply open `public/index.html` in a web browser. No server required for basic usage.

For a local development server:

```bash
npx serve public
```

### Running Tests

```bash
node --test tests/*.test.js
```

## AI Configuration

NutriScan uses an OpenAI-compatible endpoint for OCR. To configure:

1. Open the app in your browser
2. Go to the **Config** tab
3. Enter your AI endpoint URL (e.g., `https://api.openai.com/v1/chat/completions`)
4. Enter your API key
5. Click **Save Configuration**

Your configuration is stored locally in your browser's localStorage.

### Supported Endpoints

- OpenAI (`https://api.openai.com/v1/chat/completions`)
- Any OpenAI-compatible API (e.g., local LLMs, other providers)

## How to Use

### Scanning a Product

1. Go to the **Scan** tab
2. Tap the scan area to take a photo or upload an image of a nutrition label
3. Click **Extract Nutrition Data**
4. Review and edit the extracted data
5. Click **Save Product**

### Creating a Meal

1. Go to the **Meals** tab
2. Enter a meal name (e.g., "Breakfast")
3. Select the date
4. Click **Add Item** to add products from your saved products list
5. Specify the quantity in grams
6. Click **Save Meal**

### Tracking Daily Intake

1. Go to the **Track** tab
2. Use the date navigation to select a day
3. View your total nutritional intake and individual meals

## What's Not Done Yet

- **Barcode scanning**: Currently only image-based OCR is supported
- **Food database**: No built-in food database; you must scan or manually add products
- **Nutritional goals**: No configurable daily targets or alerts
- **Export/Import**: No way to export or import your data
- **Offline AI**: Requires an internet connection for OCR (no local model)
- **Mobile app**: Web-only; no native iOS/Android app

## Tech Stack

- **Runtime**: Node 24 with ES modules
- **Testing**: Node's built-in test runner (`node --test`)
- **UI**: Static HTML/CSS/JavaScript
- **Storage**: Browser localStorage
- **AI**: OpenAI-compatible API endpoint

## License

Free and open source. No ads, no tracking, no data collection.