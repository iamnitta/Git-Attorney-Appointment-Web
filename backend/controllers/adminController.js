 import validator from "validator"
 import bcrypt from 'bcrypt'
 import { v2 as clodinary } from "cloudinary"
 import lawyerModel from "../models/lawyerModel.js"
 import jwt from 'jsonwebtoken'


//API for adding lawyer

const addLawyer = async (req,res) => {
    try {
        const {email, firstName, lastName, password, phone, dob, gender} = req.body
        const imageFile = req.file
        console.log('--------------------------')
        console.log({email, firstName, lastName, password, phone, dob, gender}, imageFile);

        //checking for all data to add lawyer
        if(!email || !firstName || !lastName || !password || !phone || !dob || !gender){
            return res.json({success:false,message: 'กรุณากรอกข้อมูลให้ครบถ้วน'})
        }

        //validating email format
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"กรุณาใส่อีเมลที่ถูกต้อง"})
        }

        //validating lawyer password
        if (password.length < 8 ) {
            return res.json({success:false, message:'กรุณาใส่รหัสผ่านอย่างน้อย 8 ตัวอักษร'})
        }

        //hashing lawyer password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //upload image to cloudinary
        const imageUpload = await clodinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const lawyerData = {
            email,
            firstName,
            lastName,
            password: hashedPassword,
            phone,
            dob,
            gender,
            image: imageUrl
        }

        const newLawyer = new lawyerModel(lawyerData)
        await newLawyer.save()

        res.json({success:true,message:'เพิ่มทนายสำเร็จ'})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API For admin login

const loginAdmin = async (req,res) => {
    try {
        const {email,password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true, token})

        } else {
            res.json({success:false,message:"ข้อมูลไม่ถูกต้อง"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API to get all lawyers list for admin panel

const allLawyers = async (req,res) => {
    try {
        const lawyers = await lawyerModel.find({}).select('-password')
        res.json({success:true, lawyers})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {addLawyer,loginAdmin,allLawyers}

