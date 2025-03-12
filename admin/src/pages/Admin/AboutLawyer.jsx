import React from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { useState } from 'react'

const AboutLawyer = () => {
    const { lawId } = useParams()
    const {getAllLawyers, lawyers} = useContext(AdminContext)
    const [lawyerData, setLawyerData] = useState(null)

    useEffect(() => {
        getAllLawyers()
    }, [])


    // ถ้ามีข้อมูลทนายให้เทียบ lawyers ใน context กับ lawId ที่ส่งมาถ้าค่าอันไหนที่ตรงกันเอาข้อมูลของทนายคนนั้น
    useEffect(() => {
        if(lawyers && lawyers.length > 0) {
            const law = lawyers.find(lawyer => lawyer._id === lawId)
            setLawyerData(law)
        }
    })

    console.log("lawId:", lawId)
    console.log(lawyerData)
    
    return (
      <div>
        <h2>AboutLawyer</h2>
      </div>
    )
}

export default AboutLawyer