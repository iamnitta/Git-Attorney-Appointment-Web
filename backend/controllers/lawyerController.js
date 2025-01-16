import lawyerModel from "../models/lawyerModel.js"


const lawyerList = async (req, res) => {
    try {

        const lawyers = await lawyerModel.find({}).select(['-password','-email'])

        res.json({success:true,lawyers}) 
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {lawyerList}