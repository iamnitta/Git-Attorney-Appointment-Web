import express from 'express'
import { addCase, appointmentCancel, appointmentComplete, appointmentsLawyer, getAppointmentsLawyer, getCourts, getLawyerCases, getLawyerReviews, lawyerCases, lawyerList, lawyerProfile, loginLawyer, updateFees, updateLawyerProfile } from '../controllers/lawyerController.js'
import authLawyer from '../middlewares/authLawyer.js'
import upload from '../middlewares/multer.js'
import uploadPdf from '../middlewares/multerPdf.js'

const lawyerRouter = express.Router()

lawyerRouter.get('/list',lawyerList)
lawyerRouter.post('/login',loginLawyer)
lawyerRouter.get('/appointments', authLawyer, appointmentsLawyer)
lawyerRouter.post('/complete-appointment',authLawyer,appointmentComplete)
lawyerRouter.post('/update-fees',authLawyer,updateFees)
lawyerRouter.get('/profile',authLawyer,lawyerProfile)
lawyerRouter.post('/update-profile', authLawyer, updateLawyerProfile)
lawyerRouter.post('/cancel-appointment',authLawyer,appointmentCancel)
lawyerRouter.post('/add-case',uploadPdf.single('file'), authLawyer,addCase)
lawyerRouter.get('/cases', authLawyer,lawyerCases)
lawyerRouter.get('/courts', authLawyer,getCourts)

lawyerRouter.get('/cases-list',getLawyerCases)
lawyerRouter.get('/appointments-list',getAppointmentsLawyer)

lawyerRouter.get('/comment-list',getLawyerReviews)

export default lawyerRouter