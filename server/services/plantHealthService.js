// ============================================================
// GEMINI IMAGE ANALYSIS
// ============================================================

import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// ============================================================
// GEMINI CONFIGURATION
// ============================================================

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "⚠️ GEMINI_API_KEY is missing. Gemini AI will not work."
  );
}

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// IMPORTANT:
// Put the model name in your .env file.
// Example:
// GEMINI_MODEL=gemini-3.7-flash

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.7-flash";


// ============================================================
// GEMINI IMAGE ANALYSIS
// ============================================================

export async function analyzePlantImage(file) {
  try {
    console.log(
      "🌱 Starting Gemini plant image analysis..."
    );

    // ========================================================
    // CHECK API KEY
    // ========================================================

    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is missing in server environment."
      );
    }

    // ========================================================
    // CHECK FILE
    // ========================================================

    if (!file) {
      throw new Error(
        "Plant image is required."
      );
    }

    if (!file.path) {
      throw new Error(
        "Uploaded image path not found."
      );
    }

    console.log(
      "📦 Processing Multer image:"
    );

    console.log({
      path: file.path,
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
    });

    // ========================================================
    // CHECK IMAGE EXISTS
    // ========================================================

    const imagePath = path.resolve(
      file.path
    );

    if (!fs.existsSync(imagePath)) {
      throw new Error(
        `Uploaded image does not exist: ${imagePath}`
      );
    }

    // ========================================================
    // MIME TYPE
    // ========================================================

    let mimeType =
      file.mimetype || "image/jpeg";

    // Safety fallback
    if (!mimeType.startsWith("image/")) {
      const extension =
        path
          .extname(file.originalname || "")
          .toLowerCase();

      const mimeMap = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
      };

      mimeType =
        mimeMap[extension] ||
        "image/jpeg";
    }

    console.log(
      "🖼️ Image MIME:",
      mimeType
    );

    // ========================================================
    // READ IMAGE
    // ========================================================

    const imageBuffer =
      fs.readFileSync(imagePath);

    if (
      !imageBuffer ||
      imageBuffer.length === 0
    ) {
      throw new Error(
        "Uploaded image file is empty."
      );
    }

    // ========================================================
    // BASE64
    // ========================================================

    const imageBase64 =
      imageBuffer.toString("base64");

    console.log(
      "✅ Image converted successfully"
    );

    // ========================================================
    // PROMPT
    // ========================================================

    const prompt = `
You are an expert plant health assistant for EcoMinds,
a smart plant monitoring and irrigation application.

Carefully inspect the uploaded plant photograph.

==================================================
IMPORTANT IMAGE ANALYSIS RULES
==================================================

1. Actually inspect the visible plant.

2. Do NOT automatically call the plant healthy.

3. Look carefully for visible signs such as:

- yellow leaves
- brown leaves
- dry leaves
- wilting
- drooping
- holes
- spots
- discoloration
- pest damage
- fungal-looking symptoms
- weak growth
- dehydration
- dead portions
- overwatering signs
- leaf curling
- damaged stems
- unhealthy roots if visible

4. Do not invent diseases.

5. Only report problems that are reasonably
   visible in the photograph.

6. If the image is unclear, reduce confidence.

7. Plant identification may be uncertain.

8. Do NOT claim that the image can directly
   measure:

- soil moisture
- temperature
- humidity
- sunlight intensity

Those values come from EcoMinds sensors.

9. Give beginner-friendly and practical advice.

10. If the plant appears severely damaged,
    extremely dry, collapsed, or dead-looking,
    do NOT give it a high health score.

==================================================
HEALTH STATUS
==================================================

Allowed values:

Healthy
Good
Needs Attention
Poor
Critical
Possibly Dead
Uncertain

==================================================
HEALTH SCORE
==================================================

90-100:
Very healthy with no meaningful visible problems.

75-89:
Generally healthy with minor issues.

55-74:
Some visible problems and needs attention.

30-54:
Clearly stressed or unhealthy.

10-29:
Severely damaged.

0-9:
Very likely dead or almost completely dead.

==================================================
JSON RESPONSE
==================================================

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use code blocks.

Use EXACTLY this structure:

{
  "plantName": "string",
  "plantType": "string",
  "confidence": 0,
  "healthStatus": "Healthy",
  "healthScore": 0,
  "visibleProblems": [],
  "wateringAdvice": "string",
  "sunlightAdvice": "string",
  "soilAdvice": "string",
  "careTips": [],
  "overallRecommendation": "string"
}

==================================================
FINAL RULE
==================================================

Analyze ONLY what can reasonably be inferred
from the photograph.

Never invent sensor readings.

Never invent diseases.

Never claim certainty when the image does not
provide enough evidence.
`;

    // ========================================================
    // SEND IMAGE TO GEMINI
    // ========================================================

    console.log(
      "🤖 Sending image to Gemini..."
    );

    console.log(
      "🤖 Gemini model:",
      GEMINI_MODEL
    );

    const response =
      await gemini.models.generateContent({
        model: GEMINI_MODEL,

        contents: [
          {
            role: "user",

            parts: [
              {
                text: prompt,
              },

              {
                inlineData: {
                  mimeType: mimeType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      });

    // ========================================================
    // GET RESPONSE TEXT
    // ========================================================

    const rawText =
      response.text || "";

    console.log(
      "🤖 Gemini RAW RESPONSE:"
    );

    console.log(rawText);

    if (!rawText.trim()) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    // ========================================================
    // CLEAN JSON
    // ========================================================

    let cleaned =
      rawText.trim();

    // Remove ```json
    cleaned =
      cleaned.replace(
        /^```json\s*/i,
        ""
      );

    // Remove ```
    cleaned =
      cleaned.replace(
        /^```\s*/i,
        ""
      );

    cleaned =
      cleaned.replace(
        /\s*```$/i,
        ""
      );

    cleaned =
      cleaned.trim();

    // ========================================================
    // PARSE JSON
    // ========================================================

    let result;

    try {
      result =
        JSON.parse(cleaned);

    } catch (error) {

      console.error(
        "❌ Gemini returned invalid JSON:"
      );

      console.error(
        cleaned
      );

      throw new Error(
        "Gemini returned invalid JSON."
      );
    }

    // ========================================================
    // HEALTH SCORE
    // ========================================================

    const healthScore =
      Math.max(
        0,
        Math.min(
          100,
          Number(
            result.healthScore
          ) || 0
        )
      );

    // ========================================================
    // CONFIDENCE
    // ========================================================

    const confidence =
      Math.max(
        0,
        Math.min(
          100,
          Number(
            result.confidence
          ) || 0
        )
      );

    // ========================================================
    // ALLOWED HEALTH STATUS
    // ========================================================

    const allowedHealthStatuses = [
      "Healthy",
      "Good",
      "Needs Attention",
      "Poor",
      "Critical",
      "Possibly Dead",
      "Uncertain",
    ];

    const healthStatus =
      allowedHealthStatuses.includes(
        result.healthStatus
      )
        ? result.healthStatus
        : "Uncertain";

    // ========================================================
    // FINAL RESULT
    // ========================================================

    const finalResult = {

      plantName:
        result.plantName ||
        "Unknown Plant",

      plantType:
        result.plantType ||
        "Unknown",

      confidence,

      healthStatus,

      healthScore,

      visibleProblems:
        Array.isArray(
          result.visibleProblems
        )
          ? result.visibleProblems
          : [],

      wateringAdvice:
        result.wateringAdvice ||
        "Monitor soil moisture before watering.",

      sunlightAdvice:
        result.sunlightAdvice ||
        "Provide suitable sunlight according to the plant type.",

      soilAdvice:
        result.soilAdvice ||
        "Use suitable, well-drained soil.",

      careTips:
        Array.isArray(
          result.careTips
        )
          ? result.careTips
          : [],

      overallRecommendation:
        result.overallRecommendation ||
        "Continue monitoring the plant regularly.",
    };

    // ========================================================
    // LOG FINAL RESULT
    // ========================================================

    console.log(
      "🌱 GEMINI FINAL RESULT:"
    );

    console.log(
      finalResult
    );

    // ========================================================
    // DELETE TEMPORARY IMAGE
    // ========================================================

    try {

      if (
        fs.existsSync(imagePath)
      ) {

        fs.unlinkSync(
          imagePath
        );

        console.log(
          "🗑️ Temporary image deleted"
        );
      }

    } catch (deleteError) {

      console.warn(
        "⚠️ Could not delete temporary image:",
        deleteError.message
      );
    }

    // ========================================================
    // RETURN
    // ========================================================

    return finalResult;

  } catch (error) {

    console.error(
      "❌ GEMINI IMAGE AI ERROR:",
      error
    );

    throw error;
  }
}