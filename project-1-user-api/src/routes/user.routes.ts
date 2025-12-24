import { Router } from "express";
import { createUser, getUserbyId, updateUser, deleteUser, getAllUsers } from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserbyId);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;