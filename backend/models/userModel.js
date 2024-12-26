import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true},
    firstName: {type: String, require: true},
    lastName: {type: String, require: true},
    password: {type: String, require: true},
    phone: {type: String, require: true, },
    dob: {type: String, require: true, },
    gender: {type: String, require: true, },
    image: {type: String, require: true, },
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel