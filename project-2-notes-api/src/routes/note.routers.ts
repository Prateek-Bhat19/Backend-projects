import { Router } from "express";
import {
    createNote,
    deleteNote,
    getAllNotes,
    getNotebyId,
    updateNote,

} from "../controllers/note.controller";

const router = Router();

router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNotebyId);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
