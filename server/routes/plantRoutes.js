import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  addPlant,
  getPlants,
  getPlant,
  updatePlant,
  deletePlant,
} from "../controllers/plantController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// CREATE UPLOADS/PLANTS FOLDER
// ==========================================

const uploadDir = "uploads/plants";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ==========================================
// MULTER STORAGE
// ==========================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ==========================================
// MULTER
// ==========================================

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed"
        )
      );
    }
  },
});

// ==========================================
// ADD PLANT
// ==========================================

router.post(
  "/",
  requireAuth,
  upload.single("image"),
  addPlant
);

// ==========================================
// GET ALL PLANTS
// ==========================================

router.get(
  "/",
  requireAuth,
  getPlants
);

// ==========================================
// GET ONE PLANT
// ==========================================

router.get(
  "/:plantId",
  requireAuth,
  getPlant
);

// ==========================================
// UPDATE PLANT
// ==========================================

router.put(
  "/:plantId",
  requireAuth,
  upload.single("image"),
  updatePlant
);

// ==========================================
// DELETE PLANT
// ==========================================

router.delete(
  "/:plantId",
  requireAuth,
  deletePlant
);

export default router;