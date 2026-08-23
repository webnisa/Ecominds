import OpenAI from "openai";
import fs from "fs";
import path from "path";

// ============================================================
// OPENAI CLIENT
// ============================================================

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "⚠️ OPENAI_API_KEY is missing. Image AI will not work."
  );
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// ============================================================
// JSON HELPER
// ============================================================

function extractJSON(text) {
  if (!text) {
    throw new Error("AI returned an empty response.");
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
    console.error("❌ AI JSON parse failed:");
    console.error(cleaned);

    throw new Error("AI returned invalid JSON.");
  }
}


// ============================================================
// IMAGE NORMALIZER
// Accepts:
// 1. Multer req.file
// 2. data:image/... base64
// 3. normal base64
// ============================================================

function normalizeImage(image) {

  if (!image) {
    throw new Error("Plant image is required.");
  }


  // ========================================================
  // MULTER FILE OBJECT
  // ========================================================

  if (
    typeof image === "object" &&
    image.path
  ) {

    console.log("📦 Processing Multer image:");

    console.log({
      path: image.path,
      mimetype: image.mimetype,
      originalname: image.originalname,
      size: image.size,
    });


    const imagePath = path.resolve(
      image.path
    );


    if (!fs.existsSync(imagePath)) {

      console.error(
        "❌ Image file does not exist:",
        imagePath
      );

      throw new Error(
        `Uploaded image file not found: ${imagePath}`
      );
    }


    const buffer =
      fs.readFileSync(imagePath);


    if (!buffer || buffer.length === 0) {

      throw new Error(
        "Uploaded image file is empty."
      );
    }


    // ------------------------------------------------------
    // MIME TYPE
    // ------------------------------------------------------

    let mimeType =
      image.mimetype;


    // Sometimes multer may not provide correct type
    if (
      !mimeType ||
      !mimeType.startsWith("image/")
    ) {

      const extension =
        path.extname(
          image.originalname || ""
        ).toLowerCase();


      const mimeMap = {

        ".jpg":
          "image/jpeg",

        ".jpeg":
          "image/jpeg",

        ".png":
          "image/png",

        ".webp":
          "image/webp",

        ".gif":
          "image/gif",

      };


      mimeType =
        mimeMap[extension] ||
        "image/jpeg";
    }


    console.log(
      "🖼️ Image MIME:",
      mimeType
    );


    // ------------------------------------------------------
    // BASE64
    // ------------------------------------------------------

    const base64 =
      buffer.toString("base64");


    return {
      dataUrl:
        `data:${mimeType};base64,${base64}`,

      filePath:
        imagePath,
    };
  }


  // ========================================================
  // STRING IMAGE
  // ========================================================

  if (typeof image === "string") {

    // Already data URL
    if (
      image.startsWith(
        "data:image/"
      )
    ) {

      return {
        dataUrl: image,
        filePath: null,
      };
    }


    // Plain base64
    return {
      dataUrl:
        `data:image/jpeg;base64,${image}`,

      filePath: null,
    };
  }


  throw new Error(
    "Invalid image format."
  );
}


// ============================================================
// REAL IMAGE AI ANALYSIS
// ============================================================

export async function analyzePlantImage(image) {

  try {

    console.log(
      "🌱 Starting REAL plant image analysis..."
    );


    // ========================================================
    // API KEY
    // ========================================================

    if (!process.env.OPENAI_API_KEY) {

      throw new Error(
        "OPENAI_API_KEY is missing in server environment."
      );
    }


    // ========================================================
    // NORMALIZE IMAGE
    // ========================================================

    const normalized =
      normalizeImage(image);


    const imageData =
      normalized.dataUrl;


    console.log(
      "✅ Image converted successfully"
    );


    // ========================================================
    // PROMPT
    // ========================================================

    const prompt = `

You are an expert plant health assistant.

Analyze the uploaded plant photograph carefully.

IMPORTANT:

Actually inspect the visible plant.

Do NOT automatically call every plant healthy.

Look for visible signs such as:

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
- dead-looking portions
- overwatering signs

If the image does not provide enough evidence,
say so.

Never invent a disease that cannot reasonably
be seen from the photograph.

Plant health categories:

Healthy
Good
Needs Attention
Poor
Critical
Possibly Dead
Uncertain

Health score must reflect visible condition.

A severely dry or dead-looking plant MUST NOT
receive a high score.

Return ONLY valid JSON.

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

HEALTH SCORE:

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

If the plant appears dead, extremely dry,
collapsed or severely damaged,
DO NOT return Healthy.

Analyze ONLY what can reasonably be inferred
from the image.

`;


    // ========================================================
    // OPENAI REQUEST
    // ========================================================

    console.log(
      "🤖 Sending image to OpenAI..."
    );


    const response =
      await openai.responses.create({

        model:
          process.env.OPENAI_VISION_MODEL ||
          "gpt-5.6-luna",

        input: [

          {
            role: "user",

            content: [

              {
                type: "input_text",

                text: prompt,
              },

              {
                type: "input_image",

                image_url: imageData,
              },

            ],
          },

        ],

      });


    // ========================================================
    // RAW RESPONSE
    // ========================================================

    const rawText =
      response.output_text;


    console.log(
      "🤖 Raw AI image response:",
      rawText
    );


    // ========================================================
    // PARSE
    // ========================================================

    const result =
      extractJSON(rawText);


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
    // FINAL RESULT
    // ========================================================

    const finalResult = {

      plantName:
        result.plantName ||
        "Unknown Plant",

      plantType:
        result.plantType ||
        "Unknown",

      confidence:
        Math.max(
          0,
          Math.min(
            100,
            Number(
              result.confidence
            ) || 0
          )
        ),

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
        "Provide appropriate light for the plant.",

      soilAdvice:
        result.soilAdvice ||
        "Keep soil well-drained.",

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


    console.log(
      "🤖 AI RESULT:",
      finalResult
    );


    // ========================================================
    // DELETE TEMP IMAGE
    // ========================================================

    if (normalized.filePath) {

      try {

        fs.unlinkSync(
          normalized.filePath
        );

        console.log(
          "🗑️ Temporary image deleted"
        );

      } catch (deleteError) {

        console.warn(
          "⚠️ Could not delete temporary image:",
          deleteError.message
        );

      }
    }


    return finalResult;


  } catch (error) {

    console.error(
      "❌ REAL IMAGE AI ERROR:",
      error
    );

    throw error;
  }
}


// ============================================================
// DAILY SENSOR HEALTH ANALYSIS
// ============================================================

export async function analyzePlantHealth(
  plant
) {

  if (!plant) {
    throw new Error(
      "Plant data is required."
    );
  }


  const moisture =
    Number(
      plant.moisture ?? 0
    );

  const temperature =
    Number(
      plant.temperature ?? 0
    );

  const humidity =
    Number(
      plant.humidity ?? 0
    );


  let score = 100;

  const problems = [];

  const tips = [];


  // ========================================================
  // MOISTURE
  // ========================================================

  if (moisture < 15) {

    score -= 40;

    problems.push(
      "Soil moisture is extremely low."
    );

    tips.push(
      "The plant may be severely dehydrated. Check the soil and water appropriately."
    );

  } else if (moisture < 25) {

    score -= 30;

    problems.push(
      "Soil is very dry."
    );

    tips.push(
      "The plant may need watering soon."
    );

  } else if (moisture < 35) {

    score -= 15;

    problems.push(
      "Soil moisture is low."
    );

    tips.push(
      "Monitor soil moisture and water if required."
    );

  } else if (moisture > 90) {

    score -= 35;

    problems.push(
      "Soil is excessively wet."
    );

    tips.push(
      "Avoid additional watering and check drainage."
    );

  } else if (moisture > 80) {

    score -= 20;

    problems.push(
      "Soil moisture is very high."
    );

    tips.push(
      "Avoid overwatering."
    );

  } else if (moisture > 70) {

    score -= 10;

    problems.push(
      "Soil moisture is relatively high."
    );

    tips.push(
      "Allow the soil to dry appropriately before watering again."
    );
  }


  // ========================================================
  // TEMPERATURE
  // ========================================================

  if (temperature < 5) {

    score -= 35;

    problems.push(
      "Temperature is extremely low."
    );

    tips.push(
      "Protect the plant from extreme cold."
    );

  } else if (temperature < 10) {

    score -= 20;

    problems.push(
      "Temperature is low."
    );

  } else if (temperature > 40) {

    score -= 35;

    problems.push(
      "Temperature is extremely high."
    );

    tips.push(
      "Protect the plant from extreme heat."
    );

  } else if (temperature > 35) {

    score -= 20;

    problems.push(
      "Temperature is high."
    );

    tips.push(
      "Provide shade and monitor heat stress."
    );

  } else if (temperature > 32) {

    score -= 10;

    problems.push(
      "Temperature is somewhat high."
    );
  }


  // ========================================================
  // HUMIDITY
  // ========================================================

  if (humidity < 20) {

    score -= 25;

    problems.push(
      "Air humidity is very low."
    );

    tips.push(
      "Monitor the plant for signs of dryness."
    );

  } else if (humidity < 30) {

    score -= 15;

    problems.push(
      "Air humidity is low."
    );

  } else if (humidity > 90) {

    score -= 20;

    problems.push(
      "Air humidity is extremely high."
    );

    tips.push(
      "Improve ventilation and air circulation."
    );

  } else if (humidity > 80) {

    score -= 10;

    problems.push(
      "Air humidity is high."
    );

    tips.push(
      "Maintain good air circulation."
    );
  }


  // ========================================================
  // FINAL SCORE
  // ========================================================

  score =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(score)
      )
    );


  // ========================================================
  // STATUS
  // ========================================================

  let healthStatus;

  if (score >= 85) {

    healthStatus = "Healthy";

  } else if (score >= 70) {

    healthStatus = "Good";

  } else if (score >= 45) {

    healthStatus = "Needs Attention";

  } else if (score >= 25) {

    healthStatus = "Poor";

  } else {

    healthStatus = "Critical";
  }


  if (problems.length === 0) {

    tips.push(
      "Current sensor conditions look suitable. Continue regular monitoring."
    );
  }


  return {

    healthScore: score,

    healthStatus,

    visibleProblems:
      problems,

    careTips:
      tips,

    checkedAt:
      new Date(),

  };
}


// ============================================================
// RECOMMENDATION
// ============================================================

export function getPlantHealthRecommendation(
  healthResult
) {

  if (!healthResult) {

    return "Unable to determine plant health.";
  }


  const {
    healthScore,
    visibleProblems = [],
  } = healthResult;


  if (healthScore >= 85) {

    return (
      "Your plant is currently doing well. " +
      "Continue regular monitoring."
    );
  }


  if (healthScore >= 70) {

    return (
      "Your plant is generally healthy, " +
      "but keep monitoring its conditions."
    );
  }


  if (healthScore >= 45) {

    return (
      "Your plant needs some attention. " +
      visibleProblems.join(" ")
    );
  }


  if (healthScore >= 25) {

    return (
      "Your plant appears stressed. " +
      "Check watering, temperature and humidity."
    );
  }


  return (
    "Your plant is in critical condition. " +
    "Immediate inspection is recommended."
  );
}


// ============================================================
// BACKWARD COMPATIBILITY
// ============================================================

export async function predictPlantHealth(
  plant
) {

  console.log(
    "🌱 Predicting plant health..."
  );

  return analyzePlantHealth(
    plant
  );
}