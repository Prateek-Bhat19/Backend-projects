import { Router } from "express";
import { githubRedirect, githubCallBack, refreshToken, logout} from "./auth.controller";

const router = Router();

router.get("/github", githubRedirect);
router.get("/github/callback", githubCallBack);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
export default router;


