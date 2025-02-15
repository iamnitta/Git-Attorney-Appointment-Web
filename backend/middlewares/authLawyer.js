import jwt from 'jsonwebtoken'

//user authentication middleware

const authLawyer = async (req,res,next) => {
    try {
        const {lawyertoken} = req.headers
        if (!lawyertoken) {
            return res.json({success:false,message:'ไม่มีสิทธิ์ในการเข้าถึง กรุณาล็อคอินใหม่อีกครั้ง'})
        }

        const token_decode = jwt.verify(lawyertoken,process.env.JWT_SECRET)
        req.body.lawId = token_decode.id
        next()
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export default authLawyer