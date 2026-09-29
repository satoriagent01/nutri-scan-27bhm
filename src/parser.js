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
  } else if (lower.includes('koolhydraten') || lower.includes('carbo')) {
    field100g = 'carbohydrates';
    fieldServing = 'carbohydrates';
  } else if (lower.includes('zucker') || lower.includes('suiker') || lower.includes('sucre')) {
    field100g = 'sugars';
    fieldServing = 'sugars';
  } else if (lower.includes('faser') || lower.includes('vezel') || lower.includes('fibre')) {
    field100g = 'fiber';
    fieldServing = 'fiber';
  } else if (lower.includes('eiweiß') || lower.includes('eiwit') || lower.includes('protéine')) {
    field100g = 'protein';
    fieldServing = 'protein';
  } else if (lower.includes('salz') || lower.includes('zout') || lower.includes('sale')) {
    field100g = 'sodium';
    fieldServing = 'sodium';
  }

  if (field100g && values[0]) {
    per100g[field100g] = parseValue(values[0]);
  }
  if (fieldServing && values[1]) {
    perServing[fieldServing] = parseValue(values[1]);
  }

  // Handle energy kJ/kcal split across lines
  if (lower.includes('energie')) {
    if (values[0] && values[0].includes('kJ')) {
      per100g['energyKj'] = parseValue(values[0]);
    }
    if (values[1] && values[1].includes('kJ')) {
      perServing['energyKj'] = parseValue(values[1]);
    }
    if (values[0] && values[0].includes('kcal')) {
      per100g['energyKcal'] = parseValue(values[0]);
    }
    if (values[1] && values[1].includes('kcal')) {
      perServing['energyKcal'] = parseValue(values[1]);
    }
  }
}

function parseValue(str) {
  if (!str) return 0;
  const match = str.match(/([\d,]+)/);
  if (match) {
    return parseFloat(match[1].replace(',', '.'));
  }
  return 0;
}

function parseSingleColumn(lines) {
  const per100g = {};

  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length >= 2) {
      const label = parts[0].toLowerCase();
      const value = parts[1];

      if (label.includes('energie')) {
        if (value.includes('kJ')) {
          per100g['energyKj'] = parseValue(value);
        } else if (value.includes('kcal')) {
          per100g['energyKcal'] = parseValue(value);
        }
      } else if (label.includes('fett')) {
        per100g['fat'] = parseValue(value);
      } else if (label.includes('koolhydraten') || label.includes('carbo')) {
        per100g['carbohydrates'] = parseValue(value);
      } else if (label.includes('eiweiß') || label.includes('eiwit')) {
        per100g['protein'] = parseValue(value);
      }
    }
  }

  return {
    per100g,
    perServing: null,
  };
}