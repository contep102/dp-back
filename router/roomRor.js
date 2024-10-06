import express from "express";
import { createRoom, getAllRoom } from "../controller/roomCtrl.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create-room", authMiddleware, createRoom);
router.post("/get-all-room", getAllRoom);

export default router;
