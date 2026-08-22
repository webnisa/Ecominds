import PlantData from "../models/PlantData.js";


// ==========================================
// ANALYZE PLANT HEALTH
// ==========================================

export const analyzePlantHealth = async ({
  plantId,
  userId,
}) => {
  try {

    const history =
      await PlantData.find({
        plantId,
        userId,
      })
        .sort({
          recordedAt: -1,
        })
        .limit(7);


    if (history.length === 0) {

      return {
        healthScore: 0,

        status: "unknown",

        riskLevel: "unknown",

        analysis:
          "Not enough sensor data available.",

        recommendation:
          "Wait for sensor data to be collected.",

        factors: {},

        dataPointsUsed: 0,
      };
    }


    // Reverse for oldest → newest
    const data =
      [...history].reverse();


    // ==========================================
    // LATEST VALUES
    // ==========================================

    const latest =
      data[data.length - 1];


    const moisture =
      Number(latest.soilMoisture);

    const temperature =
      Number(latest.temperature);

    const humidity =
      Number(latest.humidity);


    // ==========================================
    // SCORE
    // ==========================================

    let score = 100;

    const problems = [];

    let moistureFactor = "Normal";
    let temperatureFactor = "Normal";
    let humidityFactor = "Normal";
    let wateringFactor = "Normal";


    // ==========================================
    // MOISTURE ANALYSIS
    // ==========================================

    if (moisture < 20) {

      score -= 35;

      moistureFactor =
        "Very low soil moisture";

      problems.push(
        "soil moisture is very low"
      );

    } else if (moisture < 30) {

      score -= 20;

      moistureFactor =
        "Low soil moisture";

      problems.push(
        "soil moisture is low"
      );

    } else if (moisture > 85) {

      score -= 35;

      moistureFactor =
        "Very high soil moisture";

      problems.push(
        "soil may be overwatered"
      );

    } else if (moisture > 75) {

      score -= 15;

      moistureFactor =
        "High soil moisture";

    }


    // ==========================================
    // TEMPERATURE
    // ==========================================

    if (temperature > 40) {

      score -= 25;

      temperatureFactor =
        "Very high temperature";

      problems.push(
        "temperature is very high"
      );

    } else if (temperature > 35) {

      score -= 10;

      temperatureFactor =
        "High temperature";

    } else if (temperature < 10) {

      score -= 20;

      temperatureFactor =
        "Very low temperature";

      problems.push(
        "temperature is very low"
      );
    }


    // ==========================================
    // HUMIDITY
    // ==========================================

    if (humidity < 25) {

      score -= 15;

      humidityFactor =
        "Low humidity";

      problems.push(
        "humidity is low"
      );

    } else if (humidity > 90) {

      score -= 15;

      humidityFactor =
        "Very high humidity";

    }


    // ==========================================
    // NO WATER FOR MULTIPLE DAYS
    // ==========================================

    let dryDays = 0;

    for (let i = data.length - 1; i >= 0; i--) {

      if (
        Number(data[i].soilMoisture) < 30
      ) {

        dryDays++;

      } else {

        break;

      }
    }


    if (dryDays >= 4) {

      score -= 25;

      wateringFactor =
        `${dryDays} consecutive days of low moisture`;

      problems.push(
        `plant has had low moisture for ${dryDays} consecutive days`
      );

    } else if (dryDays >= 2) {

      score -= 10;

      wateringFactor =
        `${dryDays} consecutive days of low moisture`;

    }


    // ==========================================
    // OVERWATERING TREND
    // ==========================================

    let wetDays = 0;

    for (let i = data.length - 1; i >= 0; i--) {

      if (
        Number(data[i].soilMoisture) > 85
      ) {

        wetDays++;

      } else {

        break;

      }
    }


    if (wetDays >= 3) {

      score -= 20;

      wateringFactor =
        `${wetDays} consecutive days of very high moisture`;

      problems.push(
        "soil has remained excessively wet"
      );
    }


    // ==========================================
    // LIMIT SCORE
    // ==========================================

    score =
      Math.max(
        0,
        Math.min(100, score)
      );


    // ==========================================
    // STATUS
    // ==========================================

    let status;
    let riskLevel;

    if (score >= 75) {

      status = "healthy";
      riskLevel = "low";

    } else if (score >= 50) {

      status = "warning";
      riskLevel = "medium";

    } else {

      status = "critical";
      riskLevel = "high";
    }


    // ==========================================
    // ANALYSIS
    // ==========================================

    let analysis;

    if (problems.length === 0) {

      analysis =
        "Current sensor conditions look stable. The plant appears healthy.";

    } else {

      analysis =
        `The latest sensor history indicates that ${problems.join(
          ", "
        )}.`;
    }


    // ==========================================
    // RECOMMENDATION
    // ==========================================

    let recommendation;

    if (dryDays >= 4) {

      recommendation =
        "Water the plant as soon as possible. If low moisture continues, the plant may become severely stressed.";

    } else if (moisture < 20) {

      recommendation =
        "The plant likely needs water soon. Check the soil and water if required.";

    } else if (wetDays >= 3 || moisture > 85) {

      recommendation =
        "Do not add more water for now. Check drainage and allow the soil to dry.";

    } else if (temperature > 40) {

      recommendation =
        "Move the plant away from excessive heat and monitor its condition.";

    } else {

      recommendation =
        "Continue regular plant care and monitor the sensor readings.";
    }


    return {

      healthScore: score,

      status,

      riskLevel,

      analysis,

      recommendation,

      factors: {

        moisture:
          moistureFactor,

        temperature:
          temperatureFactor,

        humidity:
          humidityFactor,

        watering:
          wateringFactor,

      },

      dataPointsUsed:
        data.length,
    };

  } catch (error) {

    console.error(
      "Plant health analysis error:",
      error
    );

    throw error;
  }
};