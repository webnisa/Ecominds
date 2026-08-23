import { analyzePlantImage as analyzeImageService } from "../services/plantHealthService.js";

// ============================================================
// AI IMAGE ANALYSIS
// POST /api/ai/analyze-image
// ============================================================

export async function analyzePlantImage(req, res) {
  try {
    console.log("🌱 AI IMAGE REQUEST RECEIVED");

    // --------------------------------------------------------
    // Check uploaded file
    // --------------------------------------------------------

    if (!req.file) {
      console.log("❌ No image received");

      return res.status(400).json({
        success: false,
        message: "Please upload a plant image.",
      });
    }

    console.log("📦 Multer file object received");
    console.log("📸 File:", {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      path: req.file.path,
      size: req.file.size,
    });

    // --------------------------------------------------------
    // Send complete multer file object to service
    // --------------------------------------------------------

    const result = await analyzeImageService(req.file);

    console.log("🤖 AI RESULT:", result);

    return res.status(200).json({
      success: true,
      suggestion: result,
    });

  } catch (error) {
    console.error("❌ REAL IMAGE AI ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "AI image analysis failed.",
      error:
        error?.message ||
        "Unknown AI error",
    });
  }
}