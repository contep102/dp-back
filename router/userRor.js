import express from "express";
import {
  SignUp,
  SignIn,
  getCodeAuthEmail,
  authCodeEmail,
  getUser,
  getAllUser,
  sendForgotPass,
  resetPass,
} from "../controller/userCtrl.js";
const router = express.Router();

router.post("/sign-in", SignIn);
router.post("/sign-up", SignUp);
router.post("/get-code", getCodeAuthEmail);
router.post("/send-code-forgot-pass", sendForgotPass);
router.post("/reset-pass", resetPass);
router.post("/auth-code", authCodeEmail);
router.post("/getUser", getUser);
router.post("/getAllUser", getAllUser);

export default router;
