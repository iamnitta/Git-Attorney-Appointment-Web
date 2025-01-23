import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema({
    // ส่วนที่แอดมินต้องกรอกตอนสร้างบัญชี
    email: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: String, required: true},
    dob: {type: Date, required: true},
    gender: {type: String, required: true},
    image: {type: String, require: true, default:""},

    // ส่วนที่ทนายจะมากรอกเพิ่มเติมภายหลัง
    speciality: [{type: String}],
    education: [{
        degree: {type: String},
        institution: {type: String},
        enrollmentYear: {type: String},
        graduationYear: {type: String}
    }],
    is_thaibar: {type: Boolean, default: false},
    work_experience: [{
        position: {type: String},
        company: {type: String},
        startDate: {type: String},
        endDate: {type: String},
    }],
    bio: {type: String, default: ""},
    fees_detail: {type: String, default: ""},
    license_number: {type: String, default: ""},
    lawyerNationalId: {type: String, default: ""},
    available_slots: [{
        day: {type: String},         // วันที่ เช่น "2024-03-20"
        startTime: {type: String},         // เวลา เช่น "10:00"
        endTime: {type: String,},  // สถานะ: available, booked
        status: {type: String, enum: ['ว่าง', 'จองแล้ว'], default: 'ว่าง'}
    }],
    slots_booked: {type: Object, default: {}},
},{minimize:false})

const lawyerModel = mongoose.models.lawyer || mongoose.model('lawyer', lawyerSchema)

export default lawyerModel