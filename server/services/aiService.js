// ==========================================
// AI SERVICE
// ==========================================

export const generatePlantPrediction = async ({
  plant,
  readings,
  basicAnalysis,
}) => {
  try {
    /*
      Abhi hum AI provider ko directly connect nahi kar rahe.

      Ye function future mein:
      OpenAI / Gemini / other AI API
      ko call karega.

      Filhaal basic analysis ko structured
      prediction mein convert kar raha hai.
    */

    if (!readings || readings.length === 0) {
      return {
        healthStatus: "insufficient_data",

        healthScore: null,

        riskLevel: "unknown",

        prediction:
          "Not enough plant data available for prediction.",

        recommendation:
          "Continue collecting plant sensor data.",
      };
    }


    // ------------------------------------------
    // Calculate moisture trend
    // ------------------------------------------

    const moistureValues = readings
      .map((item) => item.soilMoisture)
      .filter(
        (value) =>
          value !== undefined &&
          value !== null
      );


    let moistureTrend = "stable";


    if (moistureValues.length >= 2) {

      const first =
        moistureValues[0];

      const last =
        moistureValues[
          moistureValues.length - 1
        ];


      if (last < first - 10) {
        moistureTrend = "decreasing";
      }

      if (last > first + 10) {
        moistureTrend = "increasing";
      }
    }


    // ------------------------------------------
    // Calculate prediction
    // ------------------------------------------

    let prediction =
      "Plant conditions appear stable.";


    if (
      basicAnalysis.healthStatus ===
      "at_risk"
    ) {
      prediction =
        "The plant may be at risk if the current environmental conditions continue.";
    }


    if (
      moistureTrend === "decreasing"
    ) {
      prediction =
        "Soil moisture is decreasing. Continued low moisture may cause water stress.";
    }


    if (
      moistureTrend === "increasing"
    ) {
      prediction =
        "Soil moisture is increasing. Monitor the plant to avoid excessive watering.";
    }


    // ------------------------------------------
    // Recommendation
    // ------------------------------------------

    let recommendation =
      "Continue monitoring the plant regularly.";


    if (
      basicAnalysis.risks?.includes(
        "dehydration"
      )
    ) {
      recommendation =
        "Check soil moisture and water the plant if required.";
    }


    if (
      basicAnalysis.risks?.includes(
        "overwatering"
      )
    ) {
      recommendation =
        "Avoid additional watering and check soil drainage.";
    }


    return {

      plantId: plant._id,

      plantName: plant.plantName,

      healthStatus:
        basicAnalysis.healthStatus,

      healthScore:
        basicAnalysis.healthScore,

      riskLevel:
        basicAnalysis.healthStatus ===
        "at_risk"
          ? "high"
          : basicAnalysis.healthStatus ===
            "needs_attention"
          ? "medium"
          : "low",

      moistureTrend,

      prediction,

      recommendation,

      analyzedReadings:
        readings.length,

    };

  } catch (error) {

    console.error(
      "AI service error:",
      error
    );

    throw error;
  }
};