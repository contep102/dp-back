import express from "express";
import {
  addUserToResContest,
  createContest,
  deleteAllTaskInContest,
  deleteTask,
  deleteUserToResContest,
  getContest,
  getContestComing,
  getTask,
  StartExam,
  submitResult,
  updateContest,
  uploadTask,
  getContestProgress,
  getContestProgressId,
  getContestComingById,
  deleteContestComing,
  getContestProgressIdAdmin,
  getInfo,
  getContestProById,
  getContestFiById,
  deleteAllTask,
} from "../controller/contestCtrl.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create-contest", authMiddleware, createContest);
router.post("/add-user-register", addUserToResContest);
router.post("/delete-user-register", deleteUserToResContest);
router.post("/get-contest", getContest);
router.post("/update-contest", authMiddleware, updateContest);
router.post("/get-contest-coming", getContestComing);
router.post("/get-contest-progress", getContestProgress);
router.post("/get-contest-progress-id", getContestProgressId);
router.post("/upload-task", uploadTask);
router.post("/delete-task", deleteTask);
router.post("/submit-result", authMiddleware, submitResult);
router.post("/get-task", getTask);
router.post("/start-exam", authMiddleware, StartExam);
router.post("/deleteAllTaskInContest", deleteAllTask);
router.post("/get-contest-coming-id", getContestComingById);
router.post("/delete-contest-coming-id", deleteContestComing);
router.post("/get-contest-progress-id-admin", getContestProgressIdAdmin);
router.post("/get-info-test", getInfo);
router.post("/get-ct-cm-id", getContestComingById);
router.post("/get-ct-pr-id", getContestProById);
router.post("/get-ct-fi-id", getContestFiById);

export default router;
