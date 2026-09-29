import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { parseNutritionTable } from "../src/parser.js";

describe("parseNutritionTable", () => {
  test("parses German nutrition table (AC-1)", () => {
    const text = `Nährwertdeklaration / Déclaration nutritionnelle / Voedingswaarde / Dichiarazione nutrizionale
100 g	30 g = 1 Melto
Energie / énergie / energie / energia	2292 kJ	688 kJ
549 kcal	165 kcal
Fett / matières grasses / vetten / grassi	33 g	10 g
davon gesättigte Fettsäuren / dont acides gras saturés / waarvan verzadigde vetzuren / di cui acidi grassi saturi	13 g	3,9 g
Kohlenhydrate / glucides / koolhydraten / carboidrati	55 g	16 g
davon Zucker / dont sucres / waarvan suikers / di cui zuccheri	45 g	14 g
Ballaststoffe / fibres alimentaires / vezels / fibre	2,4 g	0,7 g
Eiweiß / protéines / eiwitten / proteine	6,8 g	2,0 g
Salz / sel / zout / sale	0,18 g	0,05 g`;

    const result = parseNutritionTable(text);

    assert.deepStrictEqual(result, {
      per100g: {
        energyKj: 2292,
        energyKcal: 549,
        fat: 33,
        saturatedFat: 13,
        carbohydrates: 55,
        sugars: 45,
        fiber: 2.4,
        protein: 6.8,
        sodium: 0.18,
      },
      perServing: {
        servingSize: "30 g = 1 Melto",
        energyKj: 688,
        energyKcal: 165,
        fat: 10,
        saturatedFat: 3.9,
        carbohydrates: 16,
        sugars: 14,
        fiber: 0.7,
        protein: 2.0,
        sodium: 0.05,
      },
    });
  });

  test("parses Dutch nutrition table (AC-2)", () => {
    const text = `Voedingswaarde per	100 ml	glas (200 ml)
energie	199 kJ / 47 kcal	399 kJ / 94 kcal
vetten, waarvan	0 g	0 g
- verzadigde vetzuren	0 g	0 g
- onverzadigde vetzuren	0 g	0 g
koolhydraten, waarvan	11 g	22 g
- suikers	10 g	20 g
- vezels	0,7 g	1,4 g
eiwitten	0,4 g	0,8 g
zout	0 g	0 g`;

    const result = parseNutritionTable(text);

    assert.deepStrictEqual(result, {
      per100g: {
        energyKj: 199,
        energyKcal: 47,
        fat: 0,
        saturatedFat: 0,
        carbohydrates: 11,
        sugars: 10,
        fiber: 0.7,
        protein: 0.4,
        sodium: 0,
      },
      perServing: {
        servingSize: "glas (200 ml)",
        energyKj: 399,
        energyKcal: 94,
        fat: 0,
        saturatedFat: 0,
        carbohydrates: 22,
        sugars: 20,
        fiber: 1.4,
        protein: 0.8,
        sodium: 0,
      },
    });
  });

  test("handles missing optional fields gracefully (AC-3)", () => {
    const text = `Nährwertdeklaration
100 g
Energie	500 kcal
Fett	20 g
Kohlenhydrate	50 g
Eiweiß	10 g`;

    const result = parseNutritionTable(text);

    assert.deepStrictEqual(result, {
      per100g: {
        energyKj: 0,
        energyKcal: 500,
        fat: 20,
        saturatedFat: 0,
        carbohydrates: 50,
        sugars: 0,
        fiber: 0,
        protein: 10,
        sodium: 0,
      },
      perServing: null,
    });
  });
});