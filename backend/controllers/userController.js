import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import {v2 as cloudinary} from 'cloudinary'

// API to register user
const registerUser = async (req,res) => {
    try {

        const { firstName, lastName, email, password, dob, phone, gender,nationalId } = req.body

        if(!firstName || !lastName || !email || !password || !dob || !phone || !gender ||!nationalId) {
            return res.json({success:false, message:'ข้อมูลไม่ครบถ้วน'})
        }

        // validating phone number format 
        if (!validator.isMobilePhone(phone, 'th-TH')) {
            return res.json({success:false, message:'กรุณาใส่เบอร์โทรศัพท์ที่ถูกต้อง'})
        }        
        

        // เช็คเลขบัตรประชาชน 13 หลัก
        if(nationalId.length !== 13) {
            return res.json({success:false, message:'กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก'})
        }

        // ตรวจสอบเลขบัตรประชาชนซ้ำ
        const existingNationalId = await userModel.findOne({ nationalId });
        if (existingNationalId) {
            return res.json({success:false, message:'เลขบัตรประชาชนนี้เคยใช้สมัครแล้ว'});
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:'กรุณาใส่อีเมลที่ถูกต้อง'})
        }

        // ตรวจสอบอีเมลซ้ำ
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({success:false, message:'อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาใช้อีเมลอื่น'});
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({success:false, message:'กรุณาใส่รหัสผ่านไม่น้อยกว่า 8 ตัว'})
        }



         // ตรวจสอบอายุ
         const birthDate = new Date(dob);
         const today = new Date();
         let age = today.getFullYear() - birthDate.getFullYear();
         const monthDiff = today.getMonth() - birthDate.getMonth();
         
         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
             age--;
         }
 
         if (age < 18) {
             return res.json({success:false, message:'ต้องมีอายุอย่างน้อย 18 ปี เพื่อใช้งานบริการนี้'})
         }         

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const userData = {
            firstName,
            lastName,
            email,
            password : hashedPassword,
            dob,
            phone,
            gender,
            nationalId
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

        res.json({success:true, token})

        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

//API  for user login 

const loginUser = async (req,res) => {
    try {
        const {email,password} = req.body
        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success:false, message:'ไม่พบบัญชีผู้ใช้งานในระบบ'})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if (isMatch) {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true, token})
        }else {
            res.json({success:false, message:'รหัสผ่านไม่ถูกต้อง'})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API to get profile

const getProfile = async (req,res) => {
    try {
        
        const {userId} = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true,userData})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// API to update user profile
const updateProfile = async (req,res) => {
    try {

        const {userId, firstName, lastName, dob, phone, gender } = req.body
        const imageFile = req.file

        if(!firstName || !lastName || !dob || !phone || !gender ) {
            return res.json({success:false, message:'ข้อมูลไม่ครบถ้วน'})
        }

        await userModel.findByIdAndUpdate(userId, {firstName,lastName,dob,phone,gender })


        if (imageFile) {
            
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }


        // validating phone number format 
            if (!validator.isMobilePhone(phone, 'th-TH')) {
            return res.json({success:false, message:'กรุณาใส่เบอร์โทรศัพท์ที่ถูกต้อง'})
        }  
    
         // ตรวจสอบอายุ
         const birthDate = new Date(dob);
         const today = new Date();
         let age = today.getFullYear() - birthDate.getFullYear();
         const monthDiff = today.getMonth() - birthDate.getMonth();
         
         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
             age--;
         }
 
         if (age < 18) {
             return res.json({success:false, message:'ต้องมีอายุอย่างน้อย 18 ปี เพื่อใช้งานบริการนี้'})
         }    


        res.json({success:true,message:'อัพเดทโปรเสร็จสิ้น'})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {registerUser, loginUser, getProfile, updateProfile}