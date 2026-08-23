// server/services/aiService.js

import { GoogleGenAI } from "@google/genai";

// ============================================================
// GEMINI CLIENT
// ============================================================

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "⚠️ GEMINI_API_KEY is missing. AI will not work."
  );
}

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ============================================================
// GEMINI MODEL
// ============================================================

const MODEL =
  process.env.GEMINI_MODEL || "gemini-3.7-flash";

// ============================================================
// SAFE JSON PARSER
// ============================================================

function parseAIJson(text) {
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  let cleaned = text.trim();

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("❌ Gemini JSON parsing failed:");
    console.error(cleaned);

    throw new Error(
      "Gemini returned invalid JSON."
    );
  }
}

// ============================================================
// IMAGE AI
// POST /api/ai/analyze-image
// ============================================================

export const analyzePlantImage = async (file) => {
  try {
    console.log(
      "🌱 Starting Gemini plant image analysis..."
    );

    // --------------------------------------------------------
    // API KEY
    // --------------------------------------------------------

    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is missing in server environment."
      );
    }

    // --------------------------------------------------------
    // FILE
    // --------------------------------------------------------

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

    console.log("📦 Processing image:", {
      path: file.path,
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
    });

    // --------------------------------------------------------
    // READ IMAGE
    // --------------------------------------------------------

    const fs = await import("fs");

    if (!fs.existsSync(file.path)) {
      throw new Error(
        `Uploaded image does not exist: ${file.path}`
      );
    }

    const imageBuffer =
      fs.readFileSync(file.path);

    if (!imageBuffer.length) {
      throw new Error(
        "Uploaded image is empty."
      );
    }

    const mimeType =
      file.mimetype || "image/jpeg";

    const imageBase64 =
      imageBuffer.toString("base64");

    console.log(
      "✅ Image converted successfully"
    );

    // --------------------------------------------------------
    // PROMPT
    // --------------------------------------------------------

    const prompt = `
You are an expert plant health assistant
for EcoMinds, a smart plant monitoring and
irrigation application.

Carefully inspect the uploaded plant photograph.

IMPORTANT:

1. Actually analyze the visible plant.
2. Do NOT automatically call it healthy.
3. Look for:
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

4. Do not invent diseases.
5. Only report problems reasonably visible.
6. If the image is unclear, confidence should be low.
7. Plant identification can be uncertain.
8. Image analysis CANNOT measure:
   - soil moisture
   - temperature
   - humidity
   - sunlight intensity

Those values come from EcoMinds sensors.

Return ONLY valid JSON.

Use exactly this structure:

{
  "plantName": "",
  "plantType": "",
  "confidence": 0,
  "healthStatus": "",
  "healthScore": 0,
  "visibleProblems": [],
  "wateringAdvice": "",
  "sunlightAdvice": "",
  "soilAdvice": "",
  "careTips": [],
  "overallRecommendation": ""
}

Health score:

90-100 = Very healthy
75-89 = Generally healthy
55-74 = Needs attention
30-54 = Clearly stressed
10-29 = Severely damaged
0-9 = Very likely dead

If the plant looks dead, extremely dry,
collapsed or severely damaged,
DO NOT return Healthy.

Analyze only what can reasonably
be inferred from the photograph.
`;

    // --------------------------------------------------------
    // GEMINI REQUEST
    // --------------------------------------------------------

    console.log(
      "🤖 Sending image to Gemini..."
    );

    const response =
      await gemini.models.generateContent({
        model: MODEL,

        contents: [
          {
            role: "user",

            parts: [
              {
                text: prompt,
              },

              {
                inlineData: {
                  mimeType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      });

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    const rawText =
      response.text || "";

    console.log(
      "🤖 Gemini RAW IMAGE RESPONSE:",
      rawText
    );

    const result =
      parseAIJson(rawText);

    // --------------------------------------------------------
    // NORMALIZE
    // --------------------------------------------------------

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

    const finalResult = {
      plantName:
        result.plantName ||
        "Unknown Plant",

      plantType:
        result.plantType ||
        "Unknown",

      confidence,

      healthStatus:
        result.healthStatus ||
        "Uncertain",

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
        "Provide suitable sunlight for the plant.",

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
        "Continue monitoring the plant.",
    };

    console.log(
      "🌱 GEMINI IMAGE RESULT:",
      finalResult
    );

    return finalResult;

  } catch (error) {
    console.error(
      "❌ GEMINI IMAGE AI ERROR:",
      error
    );

    throw error;
  }
};

// ============================================================
// SENSOR HISTORY → AI HEALTH PREDICTION
// ============================================================

export const predictPlantHealth = async ({
  plant,
  sensorData = [],
  careHistory = [],
}) => {
  try {
    console.log(
      "🌱 Starting Gemini sensor health prediction..."
    );

    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is missing."
      );
    }

    if (!plant) {
      throw new Error(
        "Plant information is required."
      );
    }

    if (!Array.isArray(sensorData)) {
      sensorData = [];
    }

    if (!Array.isArray(careHistory)) {
      careHistory = [];
    }

    // ========================================================
    // FORMAT SENSOR DATA
    // ========================================================

    const formattedSensorData =
      sensorData.map((item) => ({
        date:
          item.recordedAt || null,

        soilMoisture:
          item.soilMoisture ??
          item.moisture ??
          null,

        temperature:
          item.temperature ??
          null,

        humidity:
          item.humidity ??
          null,

        // ☀️ SUNLIGHT SENSOR
        light:
          item.light ??
          item.sunlight ??
          item.lightLevel ??
          null,
      }));

    // ========================================================
    // CARE HISTORY
    // ========================================================

    const formattedCareHistory =
      careHistory.map((item) => ({
        date:
          item.performedAt ||
          item.createdAt ||
          null,

        careType:
          item.careType || "",

        notes:
          item.notes || "",
      }));

    const dataPointsUsed =
      formattedSensorData.length;

    // ========================================================
    // PROMPT
    // ========================================================

    const prompt = `
You are the AI plant-health prediction system
for EcoMinds.

EcoMinds receives REAL IoT sensor data.

Sensors:

💧 Soil Moisture
🌡️ Temperature
💨 Air Humidity
☀️ Light / Sunlight

Analyze the recent sensor history.

==================================================
PLANT
==================================================

Name:
${plant.plantName || "Unknown"}

Type:
${plant.plantType || "Unknown"}

Location:
${plant.location || "Unknown"}

Watering frequency:
${plant.wateringFrequency || "Unknown"}

==================================================
SENSOR HISTORY
==================================================

${JSON.stringify(
  formattedSensorData,
  null,
  2
)}

==================================================
CARE HISTORY
==================================================

${JSON.stringify(
  formattedCareHistory,
  null,
  2
)}

==================================================
ANALYSIS RULES
==================================================

1. Use the actual sensor values.

2. Analyze soil moisture trends.

3. Low moisture for several readings
   may indicate watering need.

4. Extremely high moisture may indicate
   overwatering.

5. Analyze temperature trends.

6. Analyze humidity trends.

7. Analyze sunlight/light readings.

8. Low light may indicate insufficient light.

9. Very high light + high temperature
   may indicate possible heat/light stress.

10. Do not assume more sunlight is always better.

11. Consider plant type.

12. Combine sunlight and temperature.

13. Do not invent sensor values.

14. Do not invent diseases.

15. If fewer than 3 useful readings exist,
    mention limited confidence.

16. Explain WHY the plant received its score.

17. Give practical recommendations.

==================================================
RETURN ONLY JSON
==================================================

{
  "healthScore": 0,
  "status": "healthy",
  "riskLevel": "low",
  "trend": "stable",
  "analysis": "",
  "recommendation": "",
  "factors": [
    {
      "factor": "",
      "impact": "positive"
    }
  ],
  "prediction": "",
  "wateringNeeded": false,
  "suggestedWateringReason": "",
  "sunlightStatus": "",
  "sunlightRecommendation": "",
  "dataPointsUsed": 0
}

Allowed status:

healthy
warning
critical

Allowed risk:

low
medium
high

Allowed trend:

improving
stable
declining

Factor impact:

positive
negative
neutral

Health score:

90-100 = Excellent
75-89 = Generally healthy
50-74 = Needs attention
25-49 = Stressed
0-24 = Critical
`;

    // ========================================================
    // GEMINI REQUEST
    // ========================================================

    console.log(
      "🤖 Sending sensor history to Gemini..."
    );

    const response =
      await gemini.models.generateContent({
        model: MODEL,

        contents: [
          {
            role: "user",

            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      });

    // ========================================================
    // PARSE RESPONSE
    // ========================================================

    const rawText =
      response.text || "";

    console.log(
      "🤖 Gemini SENSOR RAW RESPONSE:",
      rawText
    );

    const result =
      parseAIJson(rawText);

    // ========================================================
    // NORMALIZE
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

    const allowedStatus = [
      "healthy",
      "warning",
      "critical",
    ];

    const allowedRisk = [
      "low",
      "medium",
      "high",
    ];

    const allowedTrend = [
      "improving",
      "stable",
      "declining",
    ];

    const finalResult = {
      healthScore,

      status:
        allowedStatus.includes(
          result.status
        )
          ? result.status
          : "warning",

      riskLevel:
        allowedRisk.includes(
          result.riskLevel
        )
          ? result.riskLevel
          : "medium",

      trend:
        allowedTrend.includes(
          result.trend
        )
          ? result.trend
          : "stable",

      analysis:
        result.analysis ||
        "Not enough information for detailed analysis.",

      recommendation:
        result.recommendation ||
        "Continue monitoring the plant.",

      factors:
        Array.isArray(
          result.factors
        )
          ? result.factors
          : [],

      prediction:
        result.prediction || "",

      wateringNeeded:
        Boolean(
          result.wateringNeeded
        ),

      suggestedWateringReason:
        result.suggestedWateringReason ||
        "",

      sunlightStatus:
        result.sunlightStatus ||
        "Unknown",

      sunlightRecommendation:
        result.sunlightRecommendation ||
        "Continue monitoring sunlight.",

      dataPointsUsed,
    };

    console.log(
      "🌱 GEMINI SENSOR AI RESULT:",
      finalResult
    );

    return finalResult;

  } catch (error) {
    console.error(
      "❌ Gemini sensor AI error:",
      error
    );

    throw error;
  }
};