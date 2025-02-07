import lawyerModel from "../models/lawyerModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const lawyerList = async (req, res) => {
  try {
    const lawyers = await lawyerModel.find({}).select(["-password", "-email"]);

    res.json({ success: true, lawyers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for lawyer Login
const loginLawyer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lawyer = await lawyerModel.findOne({ email });

    if (!lawyer) {
      return res.json({ success: false, message: "ไม่พบบัญชีทนายในระบบ" });
    }

    const isMatch = await bcrypt.compare(password, lawyer.password);

    if (isMatch) {
      const token = jwt.sign({ id: lawyer._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "รหัสผ่านไม่ถูกต้อง" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { lawyerList, loginLawyer };
