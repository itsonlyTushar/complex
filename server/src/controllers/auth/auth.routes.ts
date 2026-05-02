import { Router } from "express";
import { signupController } from "./auth.controller.js";

const router = Router();

router.options("/signup", (req, res) => {
    // Let CORS middleware handle headers, just send 204
    res.sendStatus(204);
});
router.post("/signup", signupController)

export default router