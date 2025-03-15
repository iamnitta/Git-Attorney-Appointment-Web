import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true},
    comment: { type: String,},
    createAt: { type: Date, required: true},
    userId: { type: String, required: true},
    lawId: { type: String, required: true},
    appointmentId: { type: String, required: true},
    isCancelled: { type: Boolean, required: true, default: false},
    isConfirm: { type: Boolean, required: true, default: false},
    userData: { type: Object, require: true},
    lawyerData: {type: Object, require: true},
    appointmentData: {type: Object, require: true}
    
})

const reviewModel = mongoose.models.review || mongoose.model('review',reviewSchema)
export default reviewModel