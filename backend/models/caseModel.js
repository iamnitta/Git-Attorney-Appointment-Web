import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
    caseNumber: { type: String, required: true},
    caseTitle: { type: String, required: true},
    courtName: { type: String, required: true},
    courtLevel: { type: String, required: true},
    caseCategory: { type: String, required: true},
    caseClientSide: { type: String, required: true},
    caseOutcome: { type: String, required: true},
    createAt: { type: Date, required: true},
    caseCompletionDate: { type: String, required: true},
    lawId: { type: String, required: true},
    lawyerData: { type: Object, required: true},
    caseDocument: {
        type: String // URL จาก Supabase
    }
    
})

const caseModel = mongoose.models.case || mongoose.model('case',caseSchema)
export default caseModel