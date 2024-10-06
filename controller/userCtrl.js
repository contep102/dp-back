import User from "../model/userMdl.js";
import { hashPass, comparePass } from "../utils/pass.js";
import { createToken } from "../utils/token.js";
import Email from "../model/email.js";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { getCode } from "../utils/authcode.js";

export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ status: 210, message: "Please field all!" });
    }
    const CheckEmail = await User.findOne({ email });
    if (!CheckEmail) {
      return res.json({ status: 210, message: "Email is not exits!" });
    }
    const CheckPass = await comparePass(password, CheckEmail.password);
    if (!CheckPass) {
      return res.json({
        status: 210,
        message: "PassWord or email is not correct!",
      });
    }
    const token = await createToken(CheckEmail._id);
    return res.json({ status: 200, message: { CheckEmail, token } });
  } catch (error) {
    return res.json({ status: 400, message: "Error in signin!" });
  }
};
export const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ status: 210, message: "Please field all!" });
    }
    const CheckAuthEmail = await Email.findOne({ mail: email });
    if (!CheckAuthEmail || CheckAuthEmail.status === false) {
      return res.json({ status: 210, message: "Email is not auth" });
    }

    const CheckEmail = await User.findOne({ email });
    if (CheckEmail) {
      return res.json({ status: 210, message: "Email is exits!" });
    }

    const passHash = await hashPass(password);

    const NewUser = await User.create({
      name,
      email,
      password: passHash,
      // avatar: {
      //   public_id: myCloud.public_id,
      //   url: myCloud.secure_url,
      // },
    });
    await Email.findOneAndUpdate({ mail: email }, { status: true });
    // const newwwUser = await
    return res.json({ status: 200, message: NewUser });
  } catch (error) {
    return res.json({ status: 400, message: "Error in signup!" });
  }
};

// gửi code tới email cần xác minh
const sendMailAuthEmail = async (email, code) => {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: "Simple",
      to: email,
      subject: "Mã xác minh từ trang simple!",
      html: `
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; color: #333; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); padding: 30px;">
            <div style="text-align: center;">
              <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Xác Minh Email</h1>
              <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">Mã xác minh của bạn là:</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <p style="font-size: 24px; font-weight: bold;">${code}</p>
              </div>
              <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px;">Vui lòng sử dụng mã này để hoàn tất quy trình xác minh.</p>
            </div>
          </div>
        </body>
      `,
    };
    await transporter.sendMail(mailOptions);
    return "success";
  } catch (error) {
    return "error";
  }
};

// gửi mã code để xác minh emmail
export const getCodeAuthEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const code = getCode().toString();

    const exitEmail = await Email.findOne({ mail: email });
    if (exitEmail && exitEmail.status == false) {
      await Email.findOneAndUpdate({ mail: email }, { codeAuthEmail: code });
    } else if (exitEmail && exitEmail.status == true) {
      return res.json({ status: 210, message: "Email is exist!" });
    } else {
      await Email.create({ mail: email, codeAuthEmail: code });
    }
    const sending = await sendMailAuthEmail(email, code);
    return res.json({ status: 200, message: `Success` });
  } catch (error) {
    return res.json({ status: 400, message: "Error" });
  }
};

// xác minh mail bằng code
export const authCodeEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const ssss = await Email.findOne({ mail: email });
    if (!ssss) {
      return res.json({ status: 210, message: "Email is not exits!" });
    }
    const newcode = code.toString();
    if (newcode === ssss.codeAuthEmail) {
      const newUser = await Email.findOneAndUpdate(
        { mail: email },
        { status: true }
      );
      return res.json({ status: 200, message: "Success" });
    }
    return res.json({ status: 210, message: "Code is not correct!" });
  } catch (error) {
    return res.json({ status: 400, message: "Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ status: 400, message: "User is not exits!" });
    }
    return res.json({ status: 200, message: user });
  } catch (error) {
    return res.json({ status: 400, message: "Error" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const allUser = await User.find().sort({ createdAt: -1 });
    return res.json({ status: 200, message: allUser });
  } catch (error) {
    return res.json({ status: 400, message: "Error" });
  }
};

export const sendForgotPass = async (req, res) => {
  try {
    const { email } = req.body;
    const code = getCode().toString();
    const check = await Email.findOne({ mail: email });
    if (!check || check.status === false) {
      return res.json({ status: 210, message: "Email is not exist!" });
    }
    await sendMailAuthEmail(email, code);
    check.forgotPass = code;
    check.save();
    res.json({ status: 200 });
  } catch (error) {
    return res.json({ status: 400 });
  }
};
export const resetPass = async (req, res) => {
  try {
    const { email, code, newPass } = req.body;
    const eemail = await Email.findOne({ mail: email });
    if (eemail.forgotPass.toString() === code.toString()) {
      const passHash = await hashPass(newPass);
      eemail.password = passHash;
      return res.json({ status: 200, message: "Change password success!" });
    } else {
      return res.json({ status: 210, message: "Code is in correct!" });
    }
  } catch (error) {
    return res.json({ status: 400 });
  }
};
