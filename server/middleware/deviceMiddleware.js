import Device from "../models/Device.js";

export const verifyDevice = async (req, res, next) => {
  try {
    const deviceId = req.headers["x-device-id"];
    const deviceKey = req.headers["x-device-key"];

    if (!deviceId || !deviceKey) {
      return res.status(401).json({
        success: false,
        message: "Device credentials are required",
      });
    }

    const device = await Device.findOne({
      deviceId,
      deviceKey,
      isActive: true,
    });

    if (!device) {
      return res.status(401).json({
        success: false,
        message: "Invalid or inactive device",
      });
    }

    // Update last connection time
    device.lastSeen = new Date();

    await device.save();

    // Make device available to controller
    req.device = device;

    next();
  } catch (error) {
    console.error("Device authentication error:", error);

    res.status(500).json({
      success: false,
      message: "Device authentication failed",
    });
  }
};