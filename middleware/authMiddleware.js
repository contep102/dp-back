import jwt from "jsonwebtoken";
import User from "../model/userMdl.js";

export const authMiddleware = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const inf = jwt.verify(token, process.env.JWT_SECRET);

      const decode = await User.findById(inf.id).select("-password");
      req.user = decode;
      next();
    } catch (error) {
      return res.json({ status: 400, message: error });
    }
  } else {
    return res.json({ status: 210, message: "Not authorize" });
  }
};
