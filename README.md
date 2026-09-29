# NutriScan

A nutrition label scanner and meal planner application. Parse OCR text from nutrition labels, scale nutrition values, plan meals, and track daily intake.

## Features

- **OCR Parsing**: Parse nutrition tables from OCR text (supports German, Dutch, and other formats)
- **Nutrition Scaling**: Scale nutrition values by serving size/quantity
- **Meal Planning**: Create meals with multiple items and calculate totals
- **Storage**: Save and retrieve products, meals, and daily logs
- **Web UI**: Simple browser interface for scanning and planning

## How to Run

### Prerequisites

- Node.js 24+
- A modern web browser

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/satoriagent01/nutri-scan-27bhm.git
   cd nutri-scan-27bhm
   ```

2. No build step or dependencies required. The project uses ES modules natively.

3. Open `public/index.html` in a web browser. Since this uses ES modules, you'll need to serve it via a local server:
   ```bash
   npx serve public
   ```
   Then open `http://localhost:3000` in your browser.

### Running Tests

```bash
node --test tests/*.test.js
```

## AI Endpoint Configuration

The app supports integration with OpenAI-compatible endpoints for OCR processing. Configure the endpoint in the app's UI:

1. Open the app in your browser
2. Enter your AI endpoint URL (e.g., `https://api.openai.com/v1`)
3. Enter your API key (e.g., `sk-...`)
4. Click "Save Configuration"

The configuration is stored in the browser's `localStorage`.

## How to Test

Run the test suite with Node.js:

```bash
node --test tests/*.test.js
```

The tests cover:
- Nutrition table parsing (German and Dutch formats)
- Nutrition value scaling by quantity
- Meal creation and total calculation
- Storage operations (products, meals, daily logs)

## Project Structure

```
├── src/
│   ├── parser.js       # OCR text parsing
│   ├── nutrition.js    # Nutrition value scaling
│   ├── mealPlanner.js  # Meal creation and totals
│   └── storage.js      # Data persistence layer
├── public/
│   └── index.html      # Web UI
├── tests/
│   ├── parser.test.js  # Parser tests
│   ├── nutrition.test.js  # Nutrition tests
│   ├── mealPlanner.test.js  # Meal planner tests
│   └── storage.test.js  # Storage tests
└── README.md
```

## What Is Not Done Yet

- No actual OCR/image processing integration (the UI accepts pasted text)
- No real AI endpoint integration (configuration is stored but not actively used for OCR)
- No authentication or user accounts
- No cloud storage (data is stored in memory during the session)
- No mobile app support
- No barcode scanning
- No nutritional analysis or recommendations