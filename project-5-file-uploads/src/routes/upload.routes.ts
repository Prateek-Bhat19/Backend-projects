import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { uploadFile, deleteFile } from "../controllers/upload.controller";

const router = Router();

router.post("/", authenticate, upload.single("file"), uploadFile);

router.delete("/:id", authenticate, deleteFile);

export default router;