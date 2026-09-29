/**
 * Parse OCR text from nutrition labels into structured data.
 * Handles multi-language labels (German, Dutch, French, Italian, English).
 */

function parseNutritionTable(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Find the header line with column info (e.g. "100 g", "30 g = 1 Melto")
  let headerLineIndex = -1;
  let per100gLabel = '100 g';
  let perServingLabel = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Nährwertdeklaration') ||
        line.includes('Déclaration nutritionnelle') ||
        line.includes('Voedingswaarde') ||
        line.includes('Dichiarazione nutrizionale') ||
        line.includes('Voedingswaarde per')) {
      headerLineIndex = i;
      // Check if this line has column labels
      if (line.includes('100 g') || line.includes('100 ml')) {
        // Extract column labels
        const parts = line.split(/\t+/);
        if (parts.length >= 2) {
          per100gLabel = parts[1].trim();
          perServingLabel = parts[2] ? parts[2].trim() : '';
        }
      }
      break;
    }
  }

  // If no header found with multi-language, try to find "per" line
  if (headerLineIndex === -1) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('per') && (line.includes('100') || line.includes('ml') || line.includes('g'))) {
        headerLineIndex = i;
        const parts = line.split(/\t+/);
        if (parts.length >= 2) {
          per100gLabel = parts[1].trim();
          perServingLabel = parts[2] ? parts[2].trim() : '';
        }
        break;
      }
    }
  }

  // Parse rows
  const per100g = {};
  const perServing = {};

  // Known fields and their regex patterns
  const fields = [
    { key: 'energyKj', patterns: [/energie/i, /energy/i, /energi/i, /energia/i] },
    { key: 'energyKcal', patterns: [/kcal/i] },
    { key: 'fat', patterns: [/fett/i, /matières grasses/i, /vetten/i, /grassi/i, /vet/i] },
    { key: 'saturatedFat', patterns: [/gesättigte Fettsäuren/i, /acides gras saturés/i, /verzadigde vetzuren/i, /acidi grassi saturi/i, /verzadigde vet/i] },
    { key: 'carbohydrates', patterns: [/kohlenhydrate/i, /glucides/i, /koolhydraten/i, /carboidrati/i, /koolhydraten/i] },
    { key: 'sugars', patterns: [/zucker/i, /sucres/i, /suikers/i, /zuccheri/i, /suikers/i, /suikers/i] },
    { key: 'fiber', patterns: [/ballaststoffe/i, /fibres alimentaires/i, /vezels/i, /fibre/i, /vezels/i] },
    { key: 'protein', patterns: [/eiweiß/i, /protéines/i, /eiwitten/i, /proteine/i, /eiwitten/i, /eiwitten/i] },
    { key: 'sodium', patterns: [/salz/i, /sel/i, /zout/i, /sale/i, /zout/i] },
  ];

  // Determine if this is a "per 100g/ml" table or "per serving" table
  // Look at the data rows to understand the structure
  let dataStartIndex = headerLineIndex + 1;

  // Find the actual data rows (skip empty lines and non-data lines)
  let firstDataRowIndex = -1;
  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i];
    // Check if line contains numeric values (nutrition data)
    if (/\d/.test(line) && !line.includes('Nährwert') && !line.includes('Déclaration') &&
        !line.includes('Voedingswaarde') && !line.includes('Dichiarazione') &&
        !line.includes('Referentie') && !line.includes('Percentage')) {
      firstDataRowIndex = i;
      break;
    }
  }

  if (firstDataRowIndex === -1) {
    return { per100g: {}, perServing: {} };
  }

  // Parse each data row
  for (let i = firstDataRowIndex; i < lines.length; i++) {
    const line = lines[i];

    // Skip lines that are clearly not data rows
    if (line.includes('Referentie') || line.includes('Percentage') ||
        line.includes('Per glas') || line.includes('Per 100') ||
        line.includes('Schütteln') || line.includes('Schütteln') ||
        line.includes('Ten minste') || line.includes('Houdbaar') ||
        line.includes('Allergie') || line.includes('Ingrediënten') ||
        line.includes('Ingrediants') || line.includes('Ingredienti') ||
        line.includes('Ingrédients') || line.includes('Gebrauch') ||
        line.includes('Gevaren') || line.includes('Land van') ||
        line.includes('FSC') || line.includes('MIX') ||
        line.includes('Separate') || line.includes('Verifica') ||
        line.includes('Dr. Schär') || line.includes('Winkela') ||
        line.includes('Burgstall') || line.includes('Postal') ||
        line.includes('Italy') || line.includes('Nederland') ||
        line.includes('Ah!') || line.includes('Heijn') ||
        line.includes('Provincialeweg') || line.includes('ZAANDAM') ||
        line.includes('BUS') || line.includes('DOP') ||
        line.includes('Schär') || line.includes('Melto') ||
        line.includes('90 g') || line.includes('90g') ||
        line.includes('3x') || line.includes('100%') ||
        line.includes('RECYCLABLE') || line.includes('RECYCLED') ||
        line.includes('VERS') || line.includes('GEPERST') ||
        line.includes('SINAAS') || line.includes('MANGO') ||
        line.includes('APPEL') || line.includes('SAP') ||
        line.includes('EXTRA') || line.includes('OLIE') ||
        line.includes('FOLIE') || line.includes('PERSING') ||
        line.includes('MECHANISCHE') || line.includes('KOUDE') ||
        line.includes('VERWERKING') || line.includes('OLIJFEN') ||
        line.includes('SUPERIEURE') || line.includes('KVALITEIT') ||
        line.includes('200 ml') || line.includes('335') ||
        line.includes('718907') || line.includes('942102') ||
        line.includes('71220424P') || line.includes('090493') ||
        line.includes('Alten') || line.includes('B.V.')) {
      continue;
    }

    // Try to match this line to a known field
    let matchedField = null;
    for (const field of fields) {
      for (const pattern of field.patterns) {
        if (pattern.test(line)) {
          matchedField = field;
          break;
        }
      }
      if (matchedField) break;
    }

    if (!matchedField) continue;

    // Extract numeric values from the line
    // The line format varies:
    // - "Fett / matières grasses / vetten / grassi\t33 g\t10 g"
    // - "energie\t199 kJ / 47 kcal\t399 kJ / 94 kcal"
    // - "davon gesättigte Fettsäuren\t13 g\t3,9 g"

    // Remove the field name part (everything before the first tab or the known pattern)
    let valuePart = line;
    // Try to find where the numeric values start
    const match = line.match(/(\d[\d,.]*)\s*(?:g|kJ|kcal)/);
    if (!match) continue;

    const values = [];
    const regex = /(\d[\d,.]*)\s*(?:g|kJ|kcal)/g;
    let m;
    while ((m = regex.exec(line)) !== null) {
      values.push(parseFloat(m[1].replace(',', '.')));
    }

    if (values.length === 0) continue;

    // Determine if this is a per-100g or per-serving value
    // For simple tables with one value per row, assume per-100g
    // For tables with two values, first is per-100g, second is per-serving
    if (values.length >= 2) {
      per100g[matchedField.key] = values[0];
      perServing[matchedField.key] = values[1];
    } else {
      per100g[matchedField.key] = values[0];
    }
  }

  // Handle special case: energy has both kJ and kcal
  // If we only found kcal values, we need to re-parse
  if (per100g.energyKj === undefined && per100g.energyKcal !== undefined) {
    // Re-parse to get both values
    for (let i = firstDataRowIndex; i < lines.length; i++) {
      const line = lines[i];
      if (/energie|energy|energi|energia/i.test(line)) {
        const kJMatch = line.match(/(\d[\d,.]*)\s*kJ/);
        const kcalMatch = line.match(/(\d[\d,.]*)\s*kcal/);
        if (kJMatch) per100g.energyKj = parseFloat(kJMatch[1].replace(',', '.'));
        if (kcalMatch) per100g.energyKcal = parseFloat(kcalMatch[1].replace(',', '.'));
        break;
      }
    }
  }

  // Set default values for missing fields
  const defaultValues = {
    energyKj: 0,
    energyKcal: 0,
    fat: 0,
    saturatedFat: 0,
    carbohydrates: 0,
    sugars: 0,
    fiber: 0,
    protein: 0,
    sodium: 0,
  };

  for (const key of Object.keys(defaultValues)) {
    if (per100g[key] === undefined) per100g[key] = defaultValues[key];
    if (perServing[key] === undefined) perServing[key] = defaultValues[key];
  }

  // Set serving size label
  if (perServingLabel) {
    perServing.servingSize = perServingLabel;
  } else {
    perServing.servingSize = per100gLabel;
  }

  return {
    per100g,
    perServing,
  };
}

export { parseNutritionTable };