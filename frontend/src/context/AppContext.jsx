import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify';


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [lawyers, setLawyers] = useState([])
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userData,setUserData] = useState(false)
    const [cases, setCases] = useState([])
    const [appointments, setAppointments] = useState([])

    const months = [' ', 'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']

    //จัดรูปแบบวัน
    const slotDateFormat = (slotDate) => {
      const dateArray = slotDate.split('-')
      return dateArray[2] + " " + months[Number(dateArray[1])] + " " + dateArray[0]
    }

    const getLawyersData = async () => {
        try {

            const {data} = await axios.get(backendUrl + '/api/lawyer/list')
            if(data.success) {
                setLawyers(data.lawyers)
            }else {
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            
        }
    }

    const loadUserProfileData = async () => {
        try {
            
            const {data} = await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
            if(data.success) {
                setUserData(data.userData)
            }else {
                toast.error(data.message)
            }


        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getCases = async (lawId) => {
        try {
            console.log(lawId)
            const { data } = await axios.get(backendUrl + '/api/lawyer/cases-list', 
                {params: { lawId }})
            if (data.success) {
                setCases(data.cases)
                console.log(data.cases)
            } 
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getAppoinetments = async (lawId) =>{
        try {
            const {data} = await axios.get(backendUrl + '/api/lawyer/appointments-list', {params:{lawId}})
            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        lawyers,getLawyersData,
        token,setToken,
        backendUrl,
        userData,setUserData,
        loadUserProfileData,
        cases,getCases,
        slotDateFormat,
        appointments,getAppoinetments
    }

    useEffect(() => {
        getLawyersData()
    },[])

    useEffect(()=> {
        if(token){
            loadUserProfileData()
        }else {
            setUserData(false)
        }
    },[token])

    

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider