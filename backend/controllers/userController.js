import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import appointmentModel from "../models/appointmentModel.js";
import lawyerModel from "../models/lawyerModel.js";
import { supabase } from "../config/supabase.js";
import reviewModel from "../models/review.js";
import caseModel from "../models/caseModel.js";

// API to register user
const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      dob,
      phone,
      gender,
      nationalId,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !dob ||
      !phone ||
      !gender ||
      !nationalId
    ) {
      return res.json({ success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // ตรวจสอบอายุ
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      return res.json({
        success: false,
        message: "ต้องมีอายุอย่างน้อย 18 ปี เพื่อเข้าใช้งานระบบ",
      });
    }

    // validating phone number format
    if (!validator.isMobilePhone(phone, "th-TH")) {
      return res.json({
        success: false,
        message: "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง",
      });
    }

    // เช็คเลขบัตรประชาชน 13 หลัก
    if (nationalId.length !== 13) {
      return res.json({
        success: false,
        message: "กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก",
      });
    }

    // ตรวจสอบเลขบัตรประชาชนซ้ำ
    const existingNationalId = await userModel.findOne({ nationalId });
    if (existingNationalId) {
      return res.json({
        success: false,
        message:
          "เลขบัตรประชาชนนี้ถูกใช้งานในระบบแล้ว กรุณาใช้เลขบัตรประชาชนอื่น",
      });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "กรุณากรอกอีเมลที่ถูกต้อง" });
    }

    // ตรวจสอบอีเมลซ้ำ
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่น",
      });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "กรุณากรอกรหัสผ่านที่ไม่น้อยกว่า 8 ตัวอักษร",
      });
    }

    if (password !== confirmPassword) {
      return res.json({ success: false, message: "รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง"})
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dob,
      phone,
      gender,
      nationalId,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API  for user login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "ไม่พบบัญชีผู้ใช้งานในระบบ" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "รหัสผ่านไม่ถูกต้อง" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get profile

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, firstName, lastName, dob, phone, gender } = req.body;
    const imageFile = req.file;

    if (!firstName || !lastName || !dob || !phone || !gender) {
      return res.json({ success: false, message: "ข้อมูลไม่ครบถ้วน" });
    }

    await userModel.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      dob,
      phone,
      gender,
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    // validating phone number format
    if (!validator.isMobilePhone(phone, "th-TH")) {
      return res.json({
        success: false,
        message: "กรุณาใส่เบอร์โทรศัพท์ที่ถูกต้อง",
      });
    }

    // ตรวจสอบอายุ
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      return res.json({
        success: false,
        message: "ต้องมีอายุอย่างน้อย 18 ปี เพื่อใช้งานบริการนี้",
      });
    }

    res.json({ success: true, message: "อัพเดทโปรไฟล์เสร็จสิ้น" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book apointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, lawId, slotDate, slotTime, user_topic } = req.body;
    const file = req.file; // รับไฟล์จาก multer

    if (!slotDate || !slotTime || !user_topic) {
      return res.json({ success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const lawyerData = await lawyerModel.findById(lawId).select("-password");

    let slots_booked = lawyerData.slots_booked;

    // checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "เวลาไม่ว่าง" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete lawyerData.slots_booked;

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
        .createSignedUrl(fileName, 60 * 60 * 24 * 365);

      documentUrl = urlData.signedUrl;
    }

    const appointmentData = {
      userId,
      lawId,
      userData,
      lawyerData,
      slotTime,
      slotDate,
      user_topic,
      documentUrl: documentUrl, // เพิ่ม URL จาก Supabase
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in lawyerData
    await lawyerModel.findByIdAndUpdate(lawId, { slots_booked });

    res.json({ success: true, message: "นัดหมายสำเร็จ" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Api to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "ไม่มีสิทธิ์" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing lawyer slot

    const { lawId, slotDate, slotTime } = appointmentData;

    const lawyerData = await lawyerModel.findById(lawId);

    let slots_booked = lawyerData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await lawyerModel.findByIdAndUpdate(lawId, { slots_booked });

    res.json({ success: true, message: "ยกเลิกการนัดหมายเสร็จสิ้น" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to add review
const addReview = async (req, res) => {
  try {
    const { userId, lawId, appointmentId, rating, comment } = req.body;

    console.log("Review data:", {
      userId,
      lawId,
      appointmentId,
      rating,
      comment,
    });

    if (!userId || !lawId || !appointmentId || !rating) {
      return res.json({ success: false, message: "กรุณาให้คะแนนความคิดเห็น" });
    }

    // ตรวจสอบว่าการนัดหมายนี้เป็นของผู้ใช้นี้จริงหรือไม่
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "ไม่พบข้อมูลการนัดหมาย" });
    }

    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "ไม่มีสิทธิ์เพิ่มรีวิวนี้" });
    }

    // อัปเดตสถานะ isReviewed ของการนัดหมาย
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isReviewed: true,
    });

    // ดึงข้อมูล user และ lawyer มาเก็บไว้
    const userData = await userModel.findById(userId).select("-password");
    const lawyerData = await lawyerModel.findById(lawId).select("-password");

    const reviewData = {
      rating,
      comment,
      createAt: new Date(),
      userId,
      lawId,
      appointmentId,
      userData: userData,
      lawyerData: lawyerData,
      appointmentData: appointmentData,
    };

    const newReview = new reviewModel(reviewData);
    await newReview.save();

    res.json({ success: true, message: "แสดงความคิดเห็นสำเร็จ" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get lawyer reviews for user panel
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({ isConfirm: true });

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

//API to get all cases from user panel
const getallCases = async (req, res) => {
  try {
    const cases = await caseModel.find();

    res.json({ success: true, cases });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  addReview,
  getAllReviews,
  getallCases,
};
