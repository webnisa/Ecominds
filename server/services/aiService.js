import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL =
  process.env.OPENAI_MODEL || "gpt-5.6-luna";

// ============================================================
// SAFE JSON PARSER
// ============================================================

function parseAIJson(text) {
  if (!text) {
    throw new Error("AI returned an empty response.");
  }

  let cleaned = text.trim();

  // Remove markdown code block
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("❌ AI JSON parsing failed");
    console.error(cleaned);

    throw new Error("AI returned invalid JSON.");
  }
}

// ============================================================
// IMAGE AI
//
// NOTE:
// Your current image AI is handled by
// plantHealthService.js.
// This function is kept here only if another part
// of your application uses it.
// ============================================================

export const analyzePlantImage = async ({
  imageBase64,
  mimeType,
}) => {
  try {
    const response = await client.responses.create({
      model: MODEL,

      input: [
        {
          role: "user",

          content: [
            {
              type: "input_text",

              text: `
You are an expert plant-care assistant.

Analyze the uploaded plant image.

Return ONLY valid JSON:

{
  "plantName": "",
  "plantType": "",
  "confidence": 0,
  "healthStatus": "",
  "visibleProblems": [],
  "wateringAdvice": "",
  "sunlightAdvice": "",
  "soilAdvice": "",
  "careTips": [],
  "warning": ""
}

Rules:

- Identify the plant as accurately as possible.
- If identification is uncertain, say so.
- Only describe visible problems.
- Do not claim to measure soil moisture,
  temperature or humidity from an image.
- Give practical beginner-friendly care advice.
- confidence must be between 0 and 100.
`,
            },

            {
              type: "input_image",

              image_url:
                `data:${mimeType};base64,${imageBase64}`,
            },
          ],
        },
      ],
    });

    return parseAIJson(response.output_text);
  } catch (error) {
    console.error(
      "❌ AI image analysis error:",
      error
    );

    throw error;
  }
};

// ============================================================
// SENSOR HISTORY → AI PLANT HEALTH PREDICTION
// ============================================================

export const predictPlantHealth = async ({
  plant,
  sensorData = [],
  careHistory = [],
}) => {
  try {
    if (!plant) {
      throw new Error("Plant information is required.");
    }

    if (!Array.isArray(sensorData)) {
      sensorData = [];
    }

    if (!Array.isArray(careHistory)) {
      careHistory = [];
    }

    // ========================================================
    // FORMAT SENSOR HISTORY
    // ========================================================

    const formattedSensorData =
      sensorData.map((item) => ({
        date: item.recordedAt,

        soilMoisture:
          item.soilMoisture ?? null,

        temperature:
          item.temperature ?? null,

        humidity:
          item.humidity ?? null,

        // ☀️ IMPORTANT
        light:
          item.light ?? null,
      }));

    // ========================================================
    // FORMAT CARE HISTORY
    // ========================================================

    const formattedCareHistory =
      careHistory.map((item) => ({
        date:
          item.performedAt ||
          item.createdAt ||
          null,

        careType:
          item.careType ||
          "",

        notes:
          item.notes ||
          "",
      }));

    // ========================================================
    // SENSOR DATA COUNT
    // ========================================================

    const dataPointsUsed =
      formattedSensorData.length;

    // ========================================================
    // PROMPT
    // ========================================================

    const prompt = `
You are the AI plant-health prediction system
for a smart irrigation application called EcoMinds.

You are analyzing REAL SENSOR HISTORY collected
from an IoT plant monitoring system.

The available sensors are:

💧 Soil Moisture
🌡️ Temperature
💨 Air Humidity
☀️ Light / Sunlight

Your job is to analyze the recent history and
predict the plant's current health and possible
watering/sunlight needs.

==================================================
PLANT INFORMATION
==================================================

Plant Name:
${plant.plantName || "Unknown"}

Plant Type:
${plant.plantType || "Unknown"}

Location:
${plant.location || "Unknown"}

Watering Frequency:
${plant.wateringFrequency || "Unknown"} days

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
IMPORTANT SENSOR ANALYSIS RULES
==================================================

1. Analyze the actual sensor history.

2. Look for decreasing soil moisture.

3. If soil moisture has stayed low for
   several readings/days, consider possible
   watering need.

4. If soil moisture remains extremely high,
   consider possible overwatering.

5. Analyze temperature trends.

6. Analyze humidity trends.

7. Analyze light/sunlight readings.

8. Consistently low light may indicate that
   the plant is not receiving enough light.

9. Very high light combined with high temperature
   may indicate possible heat/light stress.

10. Do NOT assume more sunlight is always better.

11. Consider plant type when giving sunlight advice.

12. Combine light and temperature together
    when evaluating possible heat stress.

13. Do not claim certainty when sensor data
    is insufficient.

14. If fewer than 3 meaningful sensor readings
    are available, clearly mention that the
    prediction has limited confidence.

15. Do not invent sensor values.

16. Do not invent diseases.

17. Use watering history if available.

18. Explain WHY the plant is predicted to be
    healthy, stressed or critical.

==================================================
RETURN ONLY VALID JSON
==================================================

Return exactly this structure:

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

==================================================
ALLOWED VALUES
==================================================

status:
- healthy
- warning
- critical

riskLevel:
- low
- medium
- high

trend:
- improving
- stable
- declining

factor impact:
- positive
- negative
- neutral

==================================================
HEALTH SCORE
==================================================

90-100:
Excellent conditions.

75-89:
Generally healthy.

50-74:
Needs some attention.

25-49:
Stressed.

0-24:
Critical condition.

==================================================
IMPORTANT
==================================================

The AI prediction should be based on:

💧 moisture
🌡️ temperature
💨 humidity
☀️ sunlight/light
🌱 plant type
💦 watering history
📅 recent sensor trend

Do not say that the plant definitely has a disease.

Return ONLY JSON.
`;

    console.log(
      "🤖 Sending sensor history to AI..."
    );

    // ========================================================
    // OPENAI
    // ========================================================

    const response =
      await client.responses.create({
        model: MODEL,

        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: prompt,
              },
            ],
          },
        ],
      });

    // ========================================================
    // RESPONSE
    // ========================================================

    const result =
      parseAIJson(
        response.output_text
      );

    // ========================================================
    // NORMALIZE
    // ========================================================

    const healthScore = Math.max(
      0,
      Math.min(
        100,
        Number(result.healthScore) || 0
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
        Array.isArray(result.factors)
          ? result.factors
          : [],

      prediction:
        result.prediction ||
        "",

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
        "Continue monitoring light conditions.",

      dataPointsUsed:
        dataPointsUsed,
    };

    console.log(
      "🌱 SENSOR AI RESULT:",
      finalResult
    );

    return finalResult;

  } catch (error) {
    console.error(
      "❌ AI health prediction error:",
      error
    );

    throw error;
  }
};