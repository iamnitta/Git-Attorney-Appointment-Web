import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true},
    firstName: {type: String, require: true},
    lastName: {type: String, require: true},
    password: {type: String, require: true},
    phone: {type: String, require: true},
    dob: {type: Date, require: true},
    gender: {type: String, require: true},
    speciality: [{type: String}],
    education: [{
        degree: {type: String},
        institution: {type: String},
        enrollmentYear: {type: String},
        graduationYear: {type: String}
    }],
    is_thaibar: {type: Boolean},
    work_experience: [{
        position: {type: String},
        company: {type: String},
        startDate: {type: String},
        endDate: {type: String},
    }],
    bio: {type: String},
    fees_detail: {type: String},
    license_number: {type: String},
    image: {type: String, require: true, default:""},
    avaliable_slots: {type:Object, default:{}}
},{minimize:false})

const lawyerModel = mongoose.models.lawyer || mongoose.model('lawyer', lawyerSchema)

export default lawyerModel