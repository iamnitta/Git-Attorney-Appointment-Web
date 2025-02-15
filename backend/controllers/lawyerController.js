import lawyerModel from "../models/lawyerModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

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

// API to get lawyer appointment for lawyer panel
const appointmentsLawyer = async (req,res) => {
  try {

    const {lawId} = req.body
    const appointments = await appointmentModel.find({ lawId })

    res.json({ success: true, appointments})
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to mark appointment completed for lawyer panel
const appointmentComplete = async (req, res) => {
  try {
    
    const { lawId, appointmentId} = req.body

    const appoinmentData = await appointmentModel.findById(appointmentId)

    if(appoinmentData && appoinmentData.lawId === lawId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
      return res.json({success:true, message: 'ปรึกษาเสร็จสิ้น'})
    }else {
      return res.json({success:false, message: 'มีข้อผิดพลาด'})
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to update fees for lawyer panel
const updateFees = async (req,res) => {
  try {
    
    const {lawId, appointmentId, fees} = req.body

    console.log('fees:', fees)

    const appoinmentData = await appointmentModel.findById(appointmentId)

    if(appoinmentData && appoinmentData.lawId === lawId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {fees})
      return res.json({success:true, message: 'บันทึกค่าบริการเสร็จสิ้น'})
    }else {
      return res.json({success:false, message: 'มีข้อผิดพลาด'})
    }
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to get lawyer profile for lawyer Panel
const lawyerProfile = async (req,res) => {
  try {

    const {lawId} = req.body
    const profileData = await lawyerModel.findById(lawId).select('-password')

    res.json({success:true, profileData})
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to update lawyer profile data from lawyer panel
const updateLawyerProfile = async (req,res) => {
  try {

    const { lawId, fees_detail} = req.body

    await lawyerModel.findByIdAndUpdate(lawId, {fees_detail})

    res.json({success:true, message:'อัพเดทเสร็จสิ้น'})
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
export { lawyerList, loginLawyer, appointmentsLawyer, appointmentComplete, updateFees, lawyerProfile,updateLawyerProfile };
