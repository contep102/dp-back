import ContestComing from "../model/contestComingMdl.js";
import ContestProgress from "../model/contestProgressMdl.js";
import ContestFinished from "../model/contestFinishedMdl.js";
import Task from "../model/taskMdl.js";
export const autoContestComing = async () => {
  try {
    const currentTime = new Date();

    const ex = await ContestComing.find({
      Thoi_Gian_Bat_Dau_Thi: { $lte: currentTime },
      Thoi_Gian_Ket_Thuc_Thi: { $gte: currentTime },
    });

    let mang = [];
    for (let i = 0; i < ex.length; ++i) {
      mang.push(ex[i]._id);
    }
    let idContest = mang;
    if (mang.length !== 0) {
      console.log("change2");

      let dg = [];
      for (let i = 0; i < idContest.length; ++i) {
        const contestCo = await ContestComing.findById(idContest[i]);

        const newContestProgress = await ContestProgress.create({
          Thoi_Gian_Thi: contestCo.Thoi_Gian_Bat_Dau_Thi,
          Thoi_Gian_Ket_Thuc: contestCo.Thoi_Gian_Ket_Thuc_Thi,
          Thanh_Vien_Dang_Ky: contestCo.Thanh_Vien_Dang_Ky,
          Mang_Cau_Tra_Loi: contestCo.Bo_Cau_Tra_Loi,
          TenContest: contestCo.Ten_Contest,
          Mang_Cau_Hoi: contestCo.Bo_Cau_Hoi,
          admin: contestCo.Admin,
          Description: contestCo.Description,
        });
        await ContestComing.findByIdAndDelete(idContest[i]);
      }
    }
  } catch (error) {
    console.log("e");
  }
};
export const autoContestProgress = async () => {
  try {
    const currentTime = new Date();

    const ex = await ContestProgress.find({
      Thoi_Gian_Ket_Thuc: { $lte: currentTime },
    });
    let mang = [];
    for (let i = 0; i < ex.length; ++i) {
      mang.push(ex[i]._id);
    }
    if (mang.length !== 0) {
      console.log("change1");
      const idContest = mang;
      for (let i = 0; i < idContest.length; ++i) {
        const contestCo = await ContestProgress.findById(idContest[i]);
        const newContestFinishedd = await ContestFinished.create({
          Thoi_Gian_Bat_Dau_Thi: contestCo.Thoi_Gian_Thi,
          Thoi_Gian_Ket_Thuc_Thi: contestCo.Thoi_Gian_Ket_Thuc,
          Thanh_Vien_Dang_Ky: contestCo.Thanh_Vien_Dang_Ky,
          Thanh_Vien_Tham_Gia: contestCo.Thanh_Vien_Tham_Gia,
          Ten_Contest: contestCo.TenContest,
          So_Bai_Nop: contestCo.So_Bai_Nop,
          Mang_Cau_Tra_Loi: contestCo.Mang_Cau_Tra_Loi,
          Mang_Cau_Hoi: contestCo.Mang_Cau_Hoi,
          admin: contestCo.admin,
          Description: contestCo.Description,
          IdCtPr: contestCo._id.toString(),
        });
        await ContestProgress.findByIdAndDelete(idContest[i]);
      }
    }
  } catch (error) {
    console.log("a");
  }
};
