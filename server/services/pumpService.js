import PumpLog from "../models/PumpLog.js";


// ==========================================
// REQUEST PUMP WATERING
// ==========================================

export const requestPumpWatering = async ({
  userId,
  plantId,
  duration = 10,
  action = "user_approved",
}) => {

  const pumpLog = await PumpLog.create({
    userId,

    plantId,

    action,

    status: "pending",

    duration,

    triggeredBy:
      action === "automatic"
        ? "system"
        : "user",

  });


  // ==========================================
  // ESP32 COMMAND
  // ==========================================

  const command = {
    device: "plant_pump",

    plantId: plantId.toString(),

    action: "WATER",

    duration,
  };


  /*
    Later:

    command will be sent to ESP32
    using MQTT / HTTP / WebSocket.

    Example:

    ESP32 receives:

    {
      action: "WATER",
      duration: 10
    }

    Then:

    Pump ON
       ↓
    wait 10 seconds
       ↓
    Pump OFF
  */


  return {
    pumpLog,
    command,
  };
};