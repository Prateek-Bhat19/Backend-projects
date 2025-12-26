import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize";
import {
  createNote,
  getMyNotes,
  deleteNote,
} from "../controllers/note.controller";
import { noteOwnership } from "../middlewares/ownership";

const router = Router();

router.post("/", authenticate, authorize(['user', 'admin']), createNote);

router.get("/", authenticate, authorize(['user', 'admin']), getMyNotes);

router.delete("/:id", authenticate, authorize(['admin']),noteOwnership, deleteNote);

export default router;
