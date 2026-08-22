import Device from "../models/Device.js";

export const deviceAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-device-key"];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "Device API key is required",
      });
    }

    const device = await Device.findOne({
      deviceKey: apiKey,
      isActive: true,
    });

    if (!device) {
      return res.status(401).json({
        success: false,
        message: "Invalid device API key",
      });
    }

    device.lastSeen = new Date();

    await device.save();

    req.device = device;

    next();
  } catch (error) {
    console.error(
      "Device authentication error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Device authentication failed",
    });
  }
};