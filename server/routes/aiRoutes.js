import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  analyzePlantImage,
} from "../controllers/aiController.js";

const router = express.Router();


// ============================================================
// UPLOAD DIRECTORY
// ============================================================

const uploadDir =
  path.join(
    process.cwd(),
    "uploads",
    "ai-plants"
  );


if (!fs.existsSync(uploadDir)) {

  fs.mkdirSync(
    uploadDir,
    {
      recursive: true,
    }
  );
}


// ============================================================
// MULTER
// ============================================================

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        uploadDir
      );
    },


    filename: (
      req,
      file,
      cb
    ) => {

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


const upload =
  multer({

    storage,

    limits: {
      fileSize:
        10 * 1024 * 1024,
    },

    fileFilter: (
      req,
      file,
      cb
    ) => {

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
// ANALYZE IMAGE
// ============================================================

router.post(
  "/analyze-image",
  upload.single("image"),
  analyzePlantImage
);


export default router;