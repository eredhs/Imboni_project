import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 500,
    fileSize: 10 * 1024 * 1024,
  },
});
