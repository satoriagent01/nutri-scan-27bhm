/**
 * Parse OCR nutrition table text into structured nutrition data.
 */

/**
 * Parse a nutrition table string into structured data.
 * @param {string} text - The OCR text of a nutrition table.
 * @returns {object} Parsed nutrition data with per100g and perServing sections.
 */
export function parseNutritionTable(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  // Find header row (contains column labels like "100 g", "30 g = 1 Melto")
  let headerIdx = -1;
  let headers = [];
  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split('\t');
    if (parts.length >= 2 && (parts[1].includes('g') || parts[1].includes('ml'))) {
      headerIdx = i;
      headers = parts.slice(1);
      break;
    }
  }

  if (headerIdx === -1 || headers.length === 0) {
    return parseSingleColumn(lines);
  }

  const servingSize = headers[1] || headers[0];
  const numCols = headers.length;
  const per100g = {};
  const perServing = {};

  // Parse rows after header
  let currentLabel = '';
  let currentValues = [];

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const parts = lines[i].split('\t');

    if (parts.length >= numCols + 1) {
      // New row with label and values
      if (currentLabel) {
        processRow(currentLabel, currentValues, per100g, perServing);
      }
      currentLabel = parts[0];
      currentValues = parts.slice(1);
    } else if (currentLabel) {
      // Continuation line (e.g., kcal line after kJ line)
      currentValues.push(...parts);
    }
  }

  // Process last row
  if (currentLabel) {
    processRow(currentLabel, currentValues, per100g, perServing);
  }

  return {
    per100g,
    perServing: {
      servingSize,
      ...perServing,
    },
  };
}

function processRow(label, values, per100g, perServing) {
  const lower = label.toLowerCase();

  let field100g = null;
  let fieldServing = null;

  if (lower.includes('energie')) {
    field100g = 'energyKj';
    fieldServing = 'energyKj';
  } else if (lower.includes('fett') && !lower.includes('gesättigte') && !lower.includes('satur') && !lower.includes('verzat')) {
    field100g = 'fat';
    fieldServing = 'fat';
  } else if (lower.includes('gesättigte') || lower.includes('satur') || lower.includes('verzat')) {
    field100g = 'saturatedFat';
    fieldServing = 'saturatedFat';
  } else if (lower.includes('kohlenhydrate') || lower.includes('glucides') || lower.includes('koolhydraten') || lower.includes('carboidrati')) {
    field100g = 'carbohydrates';
    fieldServing = 'carbohydrates';
  } else if (lower.includes('zucker') || lower.includes('sucres') || lower.includes('suikers') || lower.includes('suikers')) {
    field100g = 'sugars';
    fieldServing = 'sugars';
  } else if (lower.includes('ballast') || lower.includes('fibres') || lower.includes('vezels') || lower.includes('fibre')) {
    field100g = 'fiber';
    fieldServing = 'fiber';
  } else if (lower.includes('eiweiß') || lower.includes('protéines') || lower.includes('eiwitten') || lower.includes('proteine') || lower.includes('eiwitten')) {
    field100g = 'protein';
    fieldServing = 'protein';
  } else if (lower.includes('salz') || lower.includes('sel') || lower.includes('zout') || lower.includes('sale')) {
    field100g = 'sodium';
    fieldServing = 'sodium';
  }

  if (field100g && values.length >= 1) {
    const val100g = extractValue(values[0]);
    if (val100g !== null) {
      per100g[field100g] = val100g;
    }
  }

  if (fieldServing && values.length >= 2) {
    const valServing = extractValue(values[1]);
    if (valServing !== null) {
      perServing[fieldServing] = valServing;
    }
  }
}

function extractValue(str) {
  // Remove 'g', 'ml', 'kJ', 'kcal' and whitespace
  const cleaned = str.replace(/g|ml|kJ|kcal|\/|per|\/|energy|energie|energi|energia/gi, '').trim();
  // Replace comma with dot for decimal numbers
  const numStr = cleaned.replace(',', '.');
  const num = parseFloat(numStr);
  if (isNaN(num)) return null;
  return num;
}

function parseSingleColumn(lines) {
  const per100g = {};
  let foundHeader = false;

  for (const line of lines) {
    if (line.includes('100 g') || line.includes('100ml') || line.includes('100 ml')) {
      foundHeader = true;
      continue;
    }

    if (!foundHeader) continue;

    const parts = line.split('\t');
    const label = parts[0].trim().toLowerCase();
    const valueStr = parts[1] ? parts[1].trim() : '';

    if (label.includes('energie')) {
      // Check if it's kcal or kJ
      if (valueStr.includes('kcal')) {
        per100g.energyKcal = extractValue(valueStr);
      } else if (valueStr.includes('kJ')) {
        per100g.energyKj = extractValue(valueStr);
      } else {
        // Try to determine from context
        per100g.energyKcal = extractValue(valueStr);
      }
    } else if (label.includes('fett') && !label.includes('gesättigte') && !label.includes('satur') && !label.includes('verzat')) {
      per100g.fat = extractValue(valueStr);
    } else if (label.includes('gesättigte') || label.includes('satur') || label.includes('verzat')) {
      per100g.saturatedFat = extractValue(valueStr);
    } else if (label.includes('kohlenhydrate') || label.includes('glucides') || label.includes('koolhydraten') || label.includes('carboidrati')) {
      per100g.carbohydrates = extractValue(valueStr);
    } else if (label.includes('zucker') || label.includes('sucres') || label.includes('suikers')) {
      per100g.sugars = extractValue(valueStr);
    } else if (label.includes('ballast') || label.includes('fibres') || label.includes('vezels') || label.includes('fibre')) {
      per100g.fiber = extractValue(valueStr);
    } else if (label.includes('eiweiß') || label.includes('protéines') || label.includes('eiwitten') || label.includes('proteine')) {
      per100g.protein = extractValue(valueStr);
    } else if (label.includes('salz') || label.includes('sel') || label.includes('zout') || label.includes('sale')) {
      per100g.sodium = extractValue(valueStr);
    }
  }

  return {
    per100g,
    perServing: null,
  };
}