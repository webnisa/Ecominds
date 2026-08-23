import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL =
  process.env.OPENAI_MODEL || "gpt-5.6-luna";


// ==========================================
// IMAGE → PLANT AI
// ==========================================

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

Return ONLY valid JSON in this exact structure:

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
- If identification is uncertain, clearly say so.
- Do not pretend that image alone can measure soil moisture,
  temperature or humidity.
- Only describe visible problems.
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

    const text =
      response.output_text;

    return JSON.parse(text);

  } catch (error) {

    console.error(
      "AI image analysis error:",
      error
    );

    throw new Error(
      "Failed to analyze plant image"
    );
  }
};


// ==========================================
// 4–5 DAYS SENSOR DATA → AI PREDICTION
// ==========================================

export const predictPlantHealth = async ({
  plant,
  sensorData,
  careHistory = [],
}) => {

  try {

    const formattedSensorData =
      sensorData.map((item) => ({
        date: item.recordedAt,
        soilMoisture:
          item.soilMoisture,
        temperature:
          item.temperature,
        humidity:
          item.humidity,
      }));


    const formattedCareHistory =
      careHistory.map((item) => ({
        date: item.performedAt,
        careType: item.careType,
        notes: item.notes,
      }));


    const response =
      await client.responses.create({

        model: MODEL,

        input: `

You are an AI plant-health prediction system
for a smart irrigation application called EcoMinds.

Analyze the plant and its recent sensor/care history.

PLANT:

Name:
${plant.plantName}

Type:
${plant.plantType || "Unknown"}

Watering frequency:
${plant.wateringFrequency || "Unknown"} days


SENSOR HISTORY:

${JSON.stringify(
  formattedSensorData,
  null,
  2
)}


CARE HISTORY:

${JSON.stringify(
  formattedCareHistory,
  null,
  2
)}


Return ONLY valid JSON:

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
  "dataPointsUsed": 0
}


Allowed values:

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

Rules:

1. healthScore must be 0–100.
2. Use the actual sensor history.
3. Look for declining soil moisture.
4. Look for prolonged high temperature.
5. Look for unusually low humidity.
6. Detect possible overwatering if moisture remains very high.
7. Consider care history.
8. Do not claim certainty.
9. Explain why the prediction was made.
10. If there is insufficient data, clearly mention it.
`,

      });


    const text =
      response.output_text;


    return JSON.parse(text);

  } catch (error) {

    console.error(
      "AI health prediction error:",
      error
    );

    throw new Error(
      "Failed to predict plant health"
    );
  }
};