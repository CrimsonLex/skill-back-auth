import { Request, Response, Router } from "express";
import {registerCtrl ,loginCtrl, checkSession } from "../controllers/auth.controller"
import { checkJwt } from "../middleware/session";

const router = Router();
router.post("/register", registerCtrl);
router.post("/login", loginCtrl);
router.get("/verify", checkJwt, checkSession)

export { router };