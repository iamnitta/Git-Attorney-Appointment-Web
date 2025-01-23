import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true},
    lawId: { type: String, required: true},
    slotDate: { type: String, required: true},
    slotTime: { type: String, required: true},
    userData: { type: Object, required: true},
    lawyerData: { type: Object, required: true},
    fees: { type: Number, required: true},
    date: { type: String, required: true},
    isCompleted: { type: Boolean, default: false},
    cancelled: { type: Boolean, default: false}
    
})

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment',appointmentSchema)
export default appointmentModel