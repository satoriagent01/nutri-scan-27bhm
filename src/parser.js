// Parse nutrition table from OCR text
// Handles German, Dutch, French, Italian nutrition tables

/**
 * Parses OCR nutrition table text into structured nutrition data.
 * @param {string} text - The OCR text containing nutrition information
 * @returns {{ per100g: object, perServing: object|null }}
 */
export function parseNutritionTable(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Find the serving size line (contains "=" or "g =" pattern)
  let servingSize = null;
  let servingLineIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Look for serving size line like "100 g\t30 g = 1 Melto" or "Voedingswaarde per\t100 ml\tglas (200 ml)"
    if (line.includes('=') && line.includes('g')) {
      servingSize = line;
      servingLineIndex = i;
      break;
    }
    // Dutch style: "Voedingswaarde per\t100 ml\tglas (200 ml)"
    if (/^\S+\s+per\s+/.test(line) && line.includes('ml') && line.includes('g')) {
      servingSize = line;
      servingLineIndex = i;
      break;
    }
  }

  // Determine column structure
  // German style: "Label\t100g_value\t30g_value"
  // Dutch style: "Label\t100ml_value\tglas_value"
  // Mixed: "Label\tvalue" (single column)

  // Find data lines (after header/serving line)
  const dataLines = [];
  let startIdx = servingLineIndex >= 0 ? servingLineIndex + 1 : 0;

  // Skip the first line if it's a header (contains "Nährwertdeklaration" or "Voedingswaarde per")
  if (startIdx < lines.length) {
    const firstLine = lines[startIdx];
    if (/^(Nährwert|Dichlaration|Voedingswaarde|Dichiarazione)/i.test(firstLine)) {
      startIdx++;
    }
  }

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    // Skip empty lines or lines that are clearly headers
    if (line.includes('Nährwert') || line.includes('Dichlaration') || line.includes('Voedingswaarde') || line.includes('Dichiarazione')) {
      continue;
    }
    dataLines.push(line);
  }

  // Parse each data line
  const per100g = {};
  const perServing = {};

  // Known field mappings (label -> field name)
  const fieldMap = {
    'energie': 'energy',
    'energie': 'energy',
    'fett': 'fat',
    'matières grasses': 'fat',
    'matiere grasses': 'fat',
    'grassi': 'fat',
    'vetten': 'fat',
    'davon gesättigte fettsäuren': 'saturatedFat',
    'dont acides gras saturés': 'saturatedFat',
    'dont acides gras saturé': 'saturatedFat',
    'waarvan verzadigde vetzuren': 'saturatedFat',
    'di cui acidi grassi saturi': 'saturatedFat',
    '- verzadigde vetzuren': 'saturatedFat',
    '- onverzadigde vetzuren': 'unsaturatedFat',
    'kohlenhydrate': 'carbohydrates',
    'glucides': 'carbohydrates',
    'koolhydraten': 'carbohydrates',
    'carboidrati': 'carbohydrates',
    'davon zucker': 'sugars',
    'dont sucres': 'sugars',
    'waarvan suikers': 'sugars',
    'di cui zuccheri': 'sugars',
    '- suiker': 'sugars',
    '- suikers': 'sugars',
    'ballaststoffe': 'fiber',
    'fibres alimentaires': 'fiber',
    'fibres alimantaires': 'fiber',
    'vezels': 'fiber',
    'fibre': 'fiber',
    '- vezels': 'fiber',
    'eiweiß': 'protein',
    'eiweiss': 'protein',
    'protéines': 'protein',
    'proteine': 'protein',
    'proteïne': 'protein',
    'eiwitten': 'protein',
    'eiwitten': 'protein',
    'salz': 'sodium',
    'sel': 'sodium',
    'zout': 'sodium',
    'sale': 'sodium',
  };

  // Try to determine if we have 2 columns (per 100g and per serving)
  // by checking if the serving size line has two value columns
  let hasTwoColumns = false;
  if (servingLineIndex >= 0) {
    const servingLine = lines[servingLineIndex];
    // Count tab-separated parts
    const parts = servingLine.split('\t');
    if (parts.length >= 3) {
      hasTwoColumns = true;
    }
  }

  // Parse data lines
  for (const line of dataLines) {
    // Split by tab
    let parts = line.split('\t');

    // If only one part, try splitting by multiple spaces
    if (parts.length === 1) {
      parts = line.split(/\s{2,}/);
    }

    // Clean up parts
    parts = parts.map(p => p.trim()).filter(p => p.length > 0);

    if (parts.length === 0) continue;

    // Extract the label (first part)
    let label = parts[0].replace(/^-+\s*/, '').trim();

    // Determine values based on column structure
    let value100g = null;
    let valueServing = null;

    if (hasTwoColumns && parts.length >= 3) {
      // German/Dutch style: label\t100g_value\tserving_value
      value100g = parts[1];
      valueServing = parts[2];
    } else if (parts.length === 2) {
      // Could be: label\tvalue (single column)
      // Or: label\tvalue100g (no serving column)
      // Check if this looks like a single-column entry
      // If the line doesn't have a serving equivalent, treat as single column
      value100g = parts[1];
    }

    // Map label to field
    const lowerLabel = label.toLowerCase();
    let fieldName = null;
    for (const [key, value] of Object.entries(fieldMap)) {
      if (lowerLabel.includes(key)) {
        fieldName = value;
        break;
      }
    }

    if (!fieldName) continue;

    // Parse values
    if (fieldName === 'energy') {
      // Energy has both kJ and kcal
      // Format: "2292 kJ\t688 kJ" and "549 kcal\t165 kcal"
      // Or: "199 kJ / 47 kcal\t399 kJ / 94 kcal"
      if (value100g) {
        const kJMatch = value100g.match(/(\d+(?:[.,]\d+)?)\s*kj/i);
        const kcalMatch = value100g.match(/(\d+(?:[.,]\d+)?)\s*kcal/i);
        if (kJMatch) {
          per100g.energyKj = parseFloat(kJMatch[1].replace(',', '.'));
        }
        if (kcalMatch) {
          per100g.energyKcal = parseFloat(kcalMatch[1].replace(',', '.'));
        } else if (per100g.energyKj !== undefined) {
          per100g.energyKcal = Math.round(per100g.energyKj / 4.184);
        }
      }
      if (valueServing) {
        const kJMatch = valueServing.match(/(\d+(?:[.,]\d+)?)\s*kj/i);
        const kcalMatch = valueServing.match(/(\d+(?:[.,]\d+)?)\s*kcal/i);
        if (kJMatch) {
          perServing.energyKj = parseFloat(kJMatch[1].replace(',', '.'));
        }
        if (kcalMatch) {
          perServing.energyKcal = parseFloat(kcalMatch[1].replace(',', '.'));
        } else if (perServing.energyKj !== undefined) {
          perServing.energyKcal = Math.round(perServing.energyKj / 4.184);
        }
      }
    } else {
      // Regular numeric field
      if (value100g) {
        const numMatch = value100g.match(/(\d+(?:[.,]\d+)?)/);
        if (numMatch) {
          per100g[fieldName] = parseFloat(numMatch[1].replace(',', '.'));
        }
      }
      if (valueServing) {
        const numMatch = valueServing.match(/(\d+(?:[.,]\d+)?)/);
        if (numMatch) {
          perServing[fieldName] = parseFloat(numMatch[1].replace(',', '.'));
        }
      }
    }
  }

  // Handle serving size
  if (servingSize) {
    // Extract serving size description
    // German: "100 g\t30 g = 1 Melto" -> "30 g = 1 Melto"
    // Dutch: "Voedingswaarde per\t100 ml\tglas (200 ml)" -> "glas (200 ml)"
    const servingParts = servingSize.split('\t');
    if (servingParts.length >= 3) {
      // Take the last part as serving size description
      perServing.servingSize = servingParts[servingParts.length - 1];
    } else if (servingParts.length === 2) {
      perServing.servingSize = servingParts[1];
    }
  }

  // Build result
  const result = {
    per100g: {
      energyKj: per100g.energyKj || 0,
      energyKcal: per100g.energyKcal || 0,
      fat: per100g.fat || 0,
      saturatedFat: per100g.saturatedFat || 0,
      carbohydrates: per100g.carbohydrates || 0,
      sugars: per100g.sugars || 0,
      fiber: per100g.fiber || 0,
      protein: per100g.protein || 0,
      sodium: per100g.sodium || 0,
    },
    perServing: null,
  };

  // Only include perServing if we have data for it
  const hasServingData = Object.keys(perServing).length > 0;
  if (hasServingData) {
    result.perServing = {
      servingSize: perServing.servingSize || null,
      energyKj: perServing.energyKj || 0,
      energyKcal: perServing.energyKcal || 0,
      fat: perServing.fat || 0,
      saturatedFat: perServing.saturatedFat || 0,
      carbohydrates: perServing.carbohydrates || 0,
      sugars: perServing.sugars || 0,
      fiber: perServing.fiber || 0,
      protein: perServing.protein || 0,
      sodium: perServing.sodium || 0,
    };
  }

  return result;
}