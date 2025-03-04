import express from 'express'
import { addLawyer, allLawyers, allReviews, apppointmentsAdmin, cancelReview, confirmReview, loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'


const adminRouter = express.Router()

adminRouter.post('/add-lawyer',authAdmin,upload.single('image'),addLawyer)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-lawyers',authAdmin,allLawyers)
adminRouter.get('/appointments', authAdmin, apppointmentsAdmin)

adminRouter.get('/all-review',authAdmin, allReviews)
adminRouter.post('/confirm-review',authAdmin,confirmReview)
adminRouter.post('/cancel-review',authAdmin,cancelReview)

export default adminRouter