import ContestComing from "../model/contestComingMdl.js";
import ContestFinished from "../model/contestFinishedMdl.js";
import ContestProgress from "../model/contestProgressMdl.js";
import Task from "../model/taskMdl.js";
import InfoTest from "../model/InfoTest.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export const createContest = async (req, res) => {
  try {
    const { id } = req.user;

    const {
      Thoi_Gian_Bat_Dau_Dang_Ky,
      Thoi_Gian_Ket_Thuc_Dang_Ky,
      Thoi_Gian_Bat_Dau_Thi,
      Thoi_Gian_Ket_Thuc_Thi,
      Ten_Contest,
      Description,
    } = req.body;
    const Admin = id;
    // console.log(
    //   Admin,
    //   Thoi_Gian_Bat_Dau_Dang_Ky,
    //   Thoi_Gian_Ket_Thuc_Dang_Ky,
    //   Thoi_Gian_Bat_Dau_Thi,
    //   Thoi_Gian_Ket_Thuc_Thi,
    //   Ten_Contest,
    //   Description
    // );
    const checkContesti = await ContestComing.findOne({
      Ten_Contest: Ten_Contest,
    });
    const checkContestii = await ContestProgress.findOne({
      TenContest: Ten_Contest,
    });
    const checkContestiii = await ContestFinished.findOne({
      Ten_Contest: Ten_Contest,
    });
    if (checkContesti || checkContestii || checkContestiii) {
      return res.json({ status: 210, message: "Name contest is exits!" });
    }
    const contest = await ContestComing.create({
      Thoi_Gian_Bat_Dau_Dang_Ky,
      Thoi_Gian_Ket_Thuc_Dang_Ky,
      Thoi_Gian_Bat_Dau_Thi,
      Thoi_Gian_Ket_Thuc_Thi,
      Ten_Contest,
      Description,
      Admin,
    });
    return res.json({ status: 200, message: contest });
  } catch (error) {
    return res.json({ status: 400, message: error });
  }
};
export const updateContest = async (req, res) => {
  try {
    const {
      Thoi_Gian_Bat_Dau_Dang_Ky,
      Thoi_Gian_Ket_Thuc_Dang_Ky,
      Thoi_Gian_Bat_Dau_Thi,
      Thoi_Gian_Ket_Thuc_Thi,
      Ten_Contest,
      Description,
      Contest_Id,
    } = req.body;
    const Admin = req.user._id;
    const contest = await ContestComing.findByIdAndUpdate(
      Contest_Id,
      {
        Thoi_Gian_Bat_Dau_Dang_Ky,
        Thoi_Gian_Ket_Thuc_Dang_Ky,
        Thoi_Gian_Bat_Dau_Thi,
        Thoi_Gian_Ket_Thuc_Thi,
        Ten_Contest,
        Description,
        Admin,
      },
      {
        returnOriginal: false,
      }
    );
    return res.json({ status: 200, message: contest });
  } catch (error) {
    return res.json({ status: 400 });
  }
};
export const deleteAllTaskInContest = async (req, res) => {
  try {
    const { ContestId } = req.body;
    const newUp = await ContestComing.findByIdAndUpdate(ContestId, {
      Bo_Cau_Hoi: [],
    });
    return res.status(200).json("ok");
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const addUserToResContest = async (req, res) => {
  try {
    const { userId, contestId } = req.body;
    const newUp = await ContestComing.findByIdAndUpdate(
      contestId,
      { $push: { Thanh_Vien_Dang_Ky: userId } },
      { returnOriginal: false }
    );
    return res.json({ status: 200, message: "Add user succefully" });
  } catch (error) {
    return res.json({ status: 400 });
  }
};
export const deleteUserToResContest = async (req, res) => {
  try {
    const { userId, contestId } = req.body;

    // Tìm contest theo contestId
    const contest = await ContestComing.findById(contestId);
    if (!contest) {
      return res.json({ status: 404, message: "Contest not found" });
    }

    const userIndex = contest.Thanh_Vien_Dang_Ky.indexOf(userId);
    if (userIndex !== -1) {
      contest.Thanh_Vien_Dang_Ky.splice(userIndex, 1);
      await contest.save(); // Lưu thay đổi
      return res.json({
        status: 200,
        message: "User removed successfully",
        contest,
      });
    } else {
      return res.json({ status: 210, message: "User not found in contest" });
    }
  } catch (error) {
    return res.json({ status: 400 });
  }
};

export const getContest = async (req, res) => {
  try {
    const { idContest } = req.body;
    const findComingContest = await ContestComing.findById(idContest);
    const findProgressContest = await ContestProgress.findById(idContest);
    const findFinishedContest = await ContestFinished.findById(idContest);
    if (!findComingContest && !findProgressContest && !findFinishedContest) {
      return res.json({ status: 210, message: "Contest is not exits!" });
    }
    if (findComingContest) {
      return res.json({ status: 200, message: findComingContest });
    }
    if (findProgressContest) {
      return res.json({ status: 200, message: findProgressContest });
    }
    if (findFinishedContest) {
      return res.json({ status: 200, message: findFinishedContest });
    }
  } catch (error) {
    return res.json({ status: 400 });
  }
};
export const getContestComing = async (req, res) => {
  try {
    const data = await ContestComing.find().populate("Admin");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getContestComingById = async (req, res) => {
  try {
    const { userId } = req.body;
    const neww = await ContestComing.find({ Admin: userId });
    return res.json({ status: 200, message: neww });
  } catch (error) {
    return res.json({ status: 400 });
  }
};
export const getContestProById = async (req, res) => {
  try {
    const { userId } = req.body;
    const neww = await ContestProgress.find({ admin: userId });
    return res.json({ status: 200, message: neww });
  } catch (error) {
    return res.json({ status: 400 });
  }
};
export const getContestFiById = async (req, res) => {
  try {
    const { userId } = req.body;
    const neww = await ContestFinished.find({ admin: userId });
    return res.json({ status: 200, message: neww });
  } catch (error) {
    return res.json({ status: 400 });
  }
};
export const getContestProgress = async (req, res) => {
  try {
    const data = await ContestProgress.find().populate("admin");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const uploadTask = async (req, res) => {
  try {
    const { contestId, task, a, b, c, d, cauTraLoi } = req.body;

    const newUp = await Task.create({
      contestId: contestId,
      task: task,
      a,
      b,
      c,
      d,
      answer: cauTraLoi,
    });

    const newUpContest = await ContestComing.findByIdAndUpdate(
      contestId,
      { $push: { Bo_Cau_Hoi: newUp._id } },
      { returnOriginal: false }
    );
    const newUpContest2 = await ContestComing.findByIdAndUpdate(
      contestId,
      { $push: { Bo_Cau_Tra_Loi: cauTraLoi } },
      { returnOriginal: false }
    );

    return res.status(200).json(newUpContest);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getContestProgressId = async (req, res) => {
  try {
    const { contestId } = req.body;
    const newD = await ContestProgress.findById(contestId);
    if (!newD) return res.status(200).json("");
    return res.status(200).json(newD);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getContestProgressIdAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;
    const data = await ContestProgress.find({ admin: adminId });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.json({ status: 210, message: "Task is not exits!" });
    }
    return res.json({ status: 200, message: task });
  } catch (error) {
    return res.json({ status: 400 });
  }
};
export const deleteTask = async (req, res) => {
  try {
    const { nameContest, TaskId } = req.body;
    const newUp = await ContestComing.findOneAndUpdate(
      { Ten_Contest: nameContest },
      {
        $pull: {
          Bo_Cau_Hoi: TaskId,
        },
      },
      { returnOriginal: false }
    );
    const deleteTask = await Task.findOneAndDelete({
      Ten_Contest: nameContest,
    });
    return res.status(200).json(newUp);
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const deleteAllTask = async (req, res) => {
  const { contestId } = req.body;
  try {
    const newr = await ContestComing.findById(contestId);
    const ww = newr.Bo_Cau_Hoi;
    for (let i = 0; i < ww.length; ++i) {
      await Task.findByIdAndDelete(ww[i]);
    }
    newr.Bo_Cau_Hoi = [];
    newr.save();
    return res.json({ status: 200 });
  } catch (error) {
    return res.json({ status: 400 });
  }
};

export const submitResult = async (req, res) => {
  try {
    const { MangTraLoi, ContestId, OutTab } = req.body;
    const ThiSinh = req.user._id;
    const ct = await ContestProgress.findById(ContestId);

    const MangKetQua = ct.Mang_Cau_Tra_Loi;
    let core = 0;
    let mangsai = [];
    for (let i = 0; i < MangKetQua.length; ++i) {
      if (MangKetQua[i] === MangTraLoi[i]) core = core + 1;
      else mangsai.push((i + 1).toString());
    }

    let seconds = 0,
      minutes = 0,
      hours = 0;
    for (let i = 0; i < ct.Thanh_Vien_Tham_Gia.length; ++i) {
      if (ct.Thanh_Vien_Tham_Gia[i].userId.toString() === ThiSinh.toString()) {
        const ner = new Date(ct.Thanh_Vien_Tham_Gia[i].thoiGianThamGia);
        const cur = new Date();
        const diss = cur - ner;

        seconds = Math.floor(diss / 1000);
        minutes = Math.floor(seconds / 60);
        hours = Math.floor(minutes / 60);

        break;
      }
    }

    // Format time
    const formattedSeconds = seconds.toString().padStart(2, "0").slice(0, 2);
    const formattedMinutes = minutes.toString().padStart(2, "0").slice(0, 2);
    const formattedHours = hours.toString().padStart(2, "0").slice(0, 2);

    const uyt = `${core}/${MangKetQua.length}`;

    const info = await InfoTest.create({
      Thi_Sinh: ThiSinh,
      Contest_Id: ContestId,
      So_Lan_Thoat_Tab: OutTab,
      So_Thoi_Gian_Lam_Xong: `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
      Cac_Cau_Sai: mangsai,
      So_Diem: uyt,
    });

    ct.Thanh_Vien_Nop_Bai.push({ userId: ThiSinh });
    await ct.save();

    return res.json({ status: 200, message: info });
  } catch (error) {
    console.log(error);
    return res.json({ status: 400, message: error });
  }
};

export const StartExam = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user._id;

    // Tìm contest
    const contest = await ContestProgress.findById(id);

    if (!contest) {
      return res.json({ status: 210, message: "Contest does not exist!" });
    }

    // Kiểm tra xem người dùng có đăng ký không
    let check1 = false;
    for (let i = 0; i < contest.Thanh_Vien_Dang_Ky.length; ++i) {
      const member = contest.Thanh_Vien_Dang_Ky[i];
      // Chuyển ObjectId sang chuỗi trước khi so sánh
      if (member && member.toString() === userId.toString()) {
        check1 = true;
        break;
      }
    }

    if (!check1) {
      return res.json({ status: 210, message: "You are not registered!" });
    }

    // Kiểm tra xem người dùng đã nộp bài hay chưa
    let check2 = false;
    if (contest.Thanh_Vien_Nop_Bai && contest.Thanh_Vien_Nop_Bai.length > 0) {
      for (let i = 0; i < contest.Thanh_Vien_Nop_Bai.length; ++i) {
        const submittedUser = contest.Thanh_Vien_Nop_Bai[i];
        if (
          submittedUser &&
          submittedUser.userId &&
          submittedUser.userId.toString() === userId.toString()
        ) {
          check2 = true;
          break;
        }
      }
    }

    if (check2) {
      return res.json({
        status: 205,
        message: "You have already submitted the test!",
      });
    }

    // Kiểm tra xem người dùng đã tham gia hay chưa
    let check3 = false;
    if (contest.Thanh_Vien_Tham_Gia && contest.Thanh_Vien_Tham_Gia.length > 0) {
      for (let i = 0; i < contest.Thanh_Vien_Tham_Gia.length; ++i) {
        const participatedUser = contest.Thanh_Vien_Tham_Gia[i];
        if (
          participatedUser &&
          participatedUser.userId &&
          participatedUser.userId.toString() === userId.toString()
        ) {
          check3 = true;
          break;
        }
      }
    }

    if (!check3) {
      contest.Thanh_Vien_Tham_Gia.push({ userId });
      await contest.save();
    }

    return res.json({
      status: 200,
      message: contest.Mang_Cau_Hoi,
      timeEnd: contest.Thoi_Gian_Ket_Thuc,
    });
  } catch (error) {
    return res.json({ status: 400, error: error.message });
  }
};

export const deleteContestComing = async (req, res) => {
  try {
    const { userId, contestId } = req.body;
    const dataContest = await ContestComing.findById(contestId);
    if (dataContest.Admin.toString() !== userId) {
      return res.status(400).json("You not is require!");
    }
    const dataDeleteContestComing = await ContestComing.findByIdAndDelete(
      contestId
    );
    return res.status(200).json("Ok");
  } catch (error) {
    return res.status(400).json(error);
  }
};
export const getInfo = async (req, res) => {
  try {
    const { idC } = req.body;
    const dataTest = await InfoTest.find({
      Contest_Id: idC,
    }).populate("Thi_Sinh");
    console.log(dataTest);
    return res.json({ status: 200, message: dataTest });
  } catch (error) {
    return res.json({ status: 400 });
  }
};
