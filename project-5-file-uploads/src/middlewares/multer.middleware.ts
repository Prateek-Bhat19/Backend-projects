import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (!allowedMimeTypes.includes(file.mimetype)) {
  return cb(
    new Error("Only images and PDFs are allowed")
  );
}


  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});
