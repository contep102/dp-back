import Room from "../model/roomMdl.js";

export const createRoom = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, topic, limit, intro } = req.body;
    if (!name || !topic || !limit || !intro) {
      return res.json({ status: 210, message: "Please fill all fields!" });
    }

    const newRoom = await Room.create({ name, topic, limit, intro, admin: id });
    return res.json({ status: 200, message: newRoom });
  } catch (error) {
    return res.json({ status: 400, message: error });
  }
};
export const getAllRoom = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const rooms = await Room.find()
      .populate("admin", "avatar")
      .populate({
        path: "history",
        options: { limit: 4, sort: { $natural: -1 } },
        populate: { path: "avatar" },
      })
      .skip(skip)
      .limit(limit);

    if (!rooms) {
      return res.json({ status: 210 });
    }
    return res.json({ status: 200, message: rooms });
  } catch (error) {
    return res.json({ status: 400, message: error });
  }
};
