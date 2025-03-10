import lawyerModel from "../models/lawyerModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import caseModel from "../models/caseModel.js";
import courtModel from "../models/court.js";
import { supabase } from "../config/supabase.js";
import reviewModel from "../models/review.js";

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
const appointmentsLawyer = async (req, res) => {
  try {
    const { lawId } = req.body;
    const appointments = await appointmentModel.find({ lawId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to mark appointment completed for lawyer panel
const appointmentComplete = async (req, res) => {
  try {
    const { lawId, appointmentId } = req.body;

    const appoinmentData = await appointmentModel.findById(appointmentId);

    if (appoinmentData && appoinmentData.lawId === lawId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "ปรึกษาเสร็จสิ้น" });
    } else {
      return res.json({ success: false, message: "มีข้อผิดพลาด" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to cancel appointment for lawyer panel
const appointmentCancel = async (req, res) => {
  try {
    const { lawId, appointmentId, cancelReason } = req.body;

    if (!cancelReason) {
      return res.json({success : false, message: "กรุณาระบุเหตุผลการยกเลิก"})
    }

    const appoinmentData = await appointmentModel.findById(appointmentId);

    if (appoinmentData && appoinmentData.lawId === lawId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
        cancelReason: cancelReason
      });
      return res.json({ success: true, message: "ยกเลิกเสร็จสิ้น" });
    } else {
      return res.json({ success: false, message: "มีข้อผิดพลาด" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to update fees for lawyer panel
const updateFees = async (req, res) => {
  try {
    const { lawId, appointmentId, fees } = req.body;

    console.log("fees:", fees);

    const appoinmentData = await appointmentModel.findById(appointmentId);

    if (appoinmentData && appoinmentData.lawId === lawId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { fees });
      return res.json({ success: true, message: "บันทึกค่าบริการเสร็จสิ้น" });
    } else {
      return res.json({ success: false, message: "มีข้อผิดพลาด" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get lawyer profile for lawyer Panel
const lawyerProfile = async (req, res) => {
  try {
    const { lawId } = req.body;
    const profileData = await lawyerModel.findById(lawId).select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to update lawyer profile data from lawyer panel
const updateLawyerProfile = async (req, res) => {
  try {
    const { lawId, fees_detail, bio } = req.body;

    await lawyerModel.findByIdAndUpdate(lawId, { fees_detail, bio });

    res.json({ success: true, message: "อัพเดทเสร็จสิ้น" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to add case from lawyer panel
const addCase = async (req, res) => {
  try {
    const {
      caseNumber,
      courtName,
      courtLevel,
      caseCompletionDate,
      caseTitle,
      caseCategory,
      caseClientSide,
      caseOutcome,
      lawId,
    } = req.body;
    const file = req.file;

    console.log("Destructured values:", {
      caseNumber,
      courtName,
      courtLevel,
      caseCompletionDate,
      caseTitle,
      caseCategory,
      caseClientSide,
      caseOutcome,
      lawId,
    });

    if (
      !caseNumber ||
      !courtName ||
      !courtLevel ||
      !caseCompletionDate ||
      !caseTitle ||
      !caseCategory ||
      !caseClientSide ||
      !caseOutcome
    ) {
      return res.json({ success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // ดึงข้อมูลทนาย มาเก็บไว้ทำให้รู้ว่า case นี้เป็นของทนายคนไหน
    const lawyerData = await lawyerModel.findById(lawId).select("-password");

    // อัพโหลดไฟล์ไป Supabase
    let documentUrl = null;
    if (file) {
      const fileName = `${Date.now()}.pdf`; // เปลี่ยนชื่อไฟล์ให้เป็นแค่ timestamp

      const { data, error } = await supabase.storage
        .from("document")
        .upload(fileName, file.buffer, {
          contentType: "application/pdf",
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw new Error("ไม่สามารถอัพโหลดไฟล์ได้");
      }

      // สร้าง URL แบบใหม่
      const { data: urlData } = await supabase.storage
        .from("document")
        .createSignedUrl(fileName, 60 * 60 * 24 * 365); // URL หมดอายุใน 7 วัน

      documentUrl = urlData.signedUrl;
    }

    const caseData = {
      caseNumber,
      caseTitle,
      courtName,
      courtLevel,
      caseCategory,
      caseClientSide,
      caseOutcome,
      createAt: Date.now(),
      caseCompletionDate,
      lawId,
      lawyerData,
      caseDocument: documentUrl,
    };

    const newCase = new caseModel(caseData);
    await newCase.save();

    res.json({ success: true, message: "บันทึกข้อมูลสำเร็จ" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get lawyer cases from lawyer panel
const lawyerCases = async (req, res) => {
  try {
    const { lawId } = req.body;

    const cases = await caseModel.find({ lawId });

    res.json({ success: true, cases });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get cases courts
const getCourts = async (req, res) => {
  try {
    const courts = await courtModel.find({});
    res.json({ success: true, courts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get case form user panel
const getLawyerCases = async (req, res) => {
  try {
    const { lawId } = req.query; // รับ parameter จาก URL query
    const cases = await caseModel.find({ lawId });
    res.json({ success: true, cases });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get lawyer appointment for user panel
const getAppointmentsLawyer = async (req, res) => {
  try {
    const { lawId } = req.query;
    const appointments = await appointmentModel.find({ lawId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get lawyer reviews for user panel
const getLawyerReviews = async (req, res) => {
  try {
    const { lawId } = req.query;

    const reviews = await reviewModel.find({ lawId, isConfirm: true });

    // คำนวณคะแนนเฉลี่ย
    let averageRating = 0;
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      averageRating = totalRating / reviews.length;
    }

    res.json({ success: true, reviews, averageRating });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// // API to add cancel reacson for lawyer panel
// const addCancelReason = async (req,res) => {
//   try {
//     const {lawId, appointmentId, cancelReason} = req.body

    // if (!cancelReason) {
    //   return res.json({success : false, message: "กรุณาระบุเหตุผลการยกเลิก"})
    // }

//     const appoinmentData = await appointmentModel.findById(appointmentId)

//     if(appoinmentData && appoinmentData.lawId === lawId) {
//       await appointmentModel.findByIdAndUpdate(appointmentId, {})
//     }

//   } catch (error) {
    
//   }
// }

export {
  lawyerList,
  loginLawyer,
  appointmentsLawyer,
  appointmentComplete,
  updateFees,
  lawyerProfile,
  updateLawyerProfile,
  appointmentCancel,
  addCase,
  lawyerCases,
  getCourts,
  getLawyerCases,
  getAppointmentsLawyer,
  getLawyerReviews,
};
