import mongoose from "mongoose";

const courtSchema = new mongoose.Schema({
    courtName: { type: String, required: true},
    courtLevel: { type: String, required: true, enum: ['ศาลชั้นต้น','ศาลอุธรณ์','ศาลฎีกา']},
    courtProvince: { type: String, required: true},
})

const courtModel = mongoose.models.court || mongoose.model('court',courtSchema)
export default courtModel