import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import lawyerRouter from './routes/lawyerRoute.js'
import userRouter from './routes/userRoute.js'

//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middleware
app.use(express.json())
app.use(cors())

//api endpoint
app.use('/api/admin', adminRouter)
app.use('/api/lawyer',lawyerRouter)
app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send('API WORKING GREATT')
})

app.listen(port, ()=> console.log("server Started",port))