import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize";
import { getAllUsers, updateUserRole } from "../controllers/admin.controller";

const router = Router();

router.get("/users", authenticate, authorize(["admin"]), getAllUsers);

router.patch(
  "/users/:userId/role",
  authenticate,
  authorize(["admin"]),
  updateUserRole
);
export default router;
