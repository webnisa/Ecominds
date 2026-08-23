import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  analyzePlantImage,
  predictHealth,
} from "../controllers/aiController.js";

import {
  requireAuth,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

// ============================================================
// AI IMAGE UPLOAD DIRECTORY
// ============================================================

const uploadDir =
  path.join(
    process.cwd(),
    "uploads",
    "ai-plants"
  );

if (
  !fs.existsSync(uploadDir)
) {
  fs.mkdirSync(
    uploadDir,
    {
      recursive: true,
    }
  );
}

// ============================================================
// MULTER STORAGE
// ============================================================

const storage =
  multer.diskStorage({
    destination:
      (req, file, cb) => {
        cb(
          null,
          uploadDir
        );
      },

    filename:
      (req, file, cb) => {
        const extension =
          path.extname(
            file.originalname
          ).toLowerCase() ||
          ".jpg";

        const filename =
          `${Date.now()}-${Math.round(
            Math.random() * 100000000
          )}${extension}`;

        cb(
          null,
          filename
        );
      },
  });

// ============================================================
// MULTER
// ============================================================

const upload =
  multer({
    storage,

    limits: {
      fileSize:
        10 * 1024 * 1024,
    },

    fileFilter:
      (req, file, cb) => {
        if (
          file.mimetype &&
          file.mimetype.startsWith(
            "image/"
          )
        ) {
          cb(
            null,
            true
          );
        } else {
          cb(
            new Error(
              "Only image files are allowed."
            )
          );
        }
      },
  });

// ============================================================
// IMAGE AI
// POST /api/ai/analyze-image
// ============================================================

router.post(
  "/analyze-image",

  requireAuth,

  upload.single("image"),

  analyzePlantImage
);

// ============================================================
// SENSOR AI
// POST /api/ai/predict-health/:plantId
// ============================================================

router.post(
  "/predict-health/:plantId",

  requireAuth,

  predictHealth
);

export default router;