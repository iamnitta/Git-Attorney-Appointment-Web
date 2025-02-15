import { createContext, useState } from "react";
import axios from "axios"
import { toast } from "react-toastify"


export const LawyerContext = createContext()

const LawyerContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [lawyerToken, setLawyerToken] = useState(localStorage.getItem('lawyerToken')?localStorage.getItem('lawyerToken'):'')
    const [appointments, setAppointments] = useState([])
    const [profileData, setProfileData] = useState(false)

    const getAppointments = async () => {
        try {

            const {data} = await axios.get(backendUrl + '/api/lawyer/appointments', {headers:{lawyerToken}})
            if (data.success) {
                setAppointments(data.appointments.reverse())
                console.log(data.appointments.reverse())
            }else {
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {

            const {data} = await axios.post(backendUrl + '/api/lawyer/complete-appointment',{appointmentId},{headers:{lawyerToken}})
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            }else {
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const updateAppointmentFees = async (appointmentId,fees) => {
        try {

            const {data} = await axios.post(backendUrl + '/api/lawyer/update-fees', {appointmentId,fees}, {headers:{lawyerToken}})
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            }else {
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getProfileData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/lawyer/profile',{headers:{lawyerToken}})
            if (data.success) {
                setProfileData(data.profileData)
                console.log(data.profileData)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const value = {
        lawyerToken,setLawyerToken,
        backendUrl,
        appointments,setAppointments,
        getAppointments,
        completeAppointment,
        updateAppointmentFees,
        profileData,setProfileData,
        getProfileData
    }

    return (
        <LawyerContext.Provider value={value}>
            {props.children}
        </LawyerContext.Provider>
    )
}

export default LawyerContextProvider