/**
 * Send image to AI endpoint for OCR and nutrition extraction.
 */

/**
 * Sends a base64-encoded image to an OpenAI-compatible endpoint
 * and returns parsed nutrition data.
 *
 * @param {string} imageData - Base64-encoded image data.
 * @param {object} options - Configuration options.
 * @param {string} options.endpoint - The AI endpoint URL.
 * @param {string} options.key - The API key.
 * @returns {Promise<object>} Parsed nutrition data.
 */
async function extractNutritionData(imageData, options = {}) {
  const { endpoint, key } = options;

  if (!endpoint || !key) {
    throw new Error("AI endpoint and key are required");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the nutrition information from this image. Return a JSON object with keys: per100g (object with energyKj, energyKcal, fat, saturatedFat, carbohydrates, sugars, fiber, protein, sodium), perServing (object with servingSize, energyKj, energyKcal, fat, saturatedFat, carbohydrates, sugars, fiber, protein, sodium). Only return valid JSON.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Extract the text content from the response
  const content = data.choices?.[0]?.message?.content || "";

  // Try to parse JSON from the response
  try {
    // Find JSON in the response (in case there's markdown wrapping)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // If parsing fails, throw an error
    throw new Error(`Failed to parse AI response as JSON: ${content}`);
  }

  throw new Error("No valid JSON found in AI response");
}

export { extractNutritionData };