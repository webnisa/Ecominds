import Plant from "../models/Plant.js";
import PlantData from "../models/PlantData.js";
import Reminder from "../models/Reminder.js";

const LOW_MOISTURE = 30;

const checkPlantReminders = async () => {
  try {
    console.log("🔔 Checking plant reminders...");

    const plants = await Plant.find({});

    for (const plant of plants) {
      try {
        const latestData = await PlantData.findOne({
          plantId: plant._id,
          userId: plant.userId,
        }).sort({
          recordedAt: -1,
        });

        if (!latestData) {
          continue;
        }

        const moisture = Number(latestData.soilMoisture);

        if (Number.isNaN(moisture)) {
          continue;
        }

        console.log(
          `🌱 ${plant.plantName} moisture: ${moisture}%`
        );

        if (moisture < LOW_MOISTURE) {
          const existingReminder = await Reminder.findOne({
            userId: plant.userId,
            plantId: plant._id,
            type: "WATERING",
            isRead: false,
          });

          if (existingReminder) {
            console.log(
              `⏭️ Reminder already exists for ${plant.plantName}`
            );

            continue;
          }

          await Reminder.create({
            userId: plant.userId,
            plantId: plant._id,
            type: "WATERING",

            title: `Water ${plant.plantName}`,

            message: `Soil moisture is ${moisture}%. Your plant may need watering.`,

            isRead: false,

            dueAt: new Date(),
          });

          console.log(
            `💧 Reminder created for ${plant.plantName}`
          );
        }
      } catch (plantError) {
        console.error(
          `❌ Error checking plant ${plant._id}:`,
          plantError.message
        );
      }
    }

    console.log("✅ Reminder check completed");
  } catch (error) {
    console.error(
      "❌ Reminder job failed:",
      error
    );
  }
};

export default checkPlantReminders;