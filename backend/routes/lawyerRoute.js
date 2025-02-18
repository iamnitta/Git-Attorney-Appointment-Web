import express from 'express'
import { appointmentCancel, appointmentComplete, appointmentsLawyer, lawyerList, lawyerProfile, loginLawyer, updateFees, updateLawyerProfile } from '../controllers/lawyerController.js'
import authLawyer from '../middlewares/authLawyer.js'

const lawyerRouter = express.Router()

lawyerRouter.get('/list',lawyerList)
lawyerRouter.post('/login',loginLawyer)
lawyerRouter.get('/appointments', authLawyer, appointmentsLawyer)
lawyerRouter.post('/complete-appointment',authLawyer,appointmentComplete)
lawyerRouter.post('/update-fees',authLawyer,updateFees)
lawyerRouter.get('/profile',authLawyer,lawyerProfile)
lawyerRouter.post('/update-profile', authLawyer, updateLawyerProfile)
lawyerRouter.post('/cancel-appointment',authLawyer,appointmentCancel)

export default lawyerRouter