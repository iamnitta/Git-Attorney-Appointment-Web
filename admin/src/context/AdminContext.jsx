import axios from "axios";
import { createContext, useState } from "react";
import {toast} from 'react-toastify'


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [lawyers,setLawyers] = useState([])
    const [appointments, setAppointments] = useState([])
    const [reviews, setReviews] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllLawyers = async () => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/all-lawyers' , {}, {headers:{aToken}})

            if (data.success) {
                setLawyers(data.lawyers)
                console.log(data.lawyers)
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    const getAllAppointments = async () => {
        try {

            const {data} = await axios.get(backendUrl + '/api/admin/appointments',{headers:{aToken}})

            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            }else {
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllReviews = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/all-review', {headers:{aToken}})

            if(data.success) {
                setReviews(data.reviews)
                console.log(data.reviews)
            }else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const confirmReviews = async (reviewId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/confirm-review', {reviewId}, {headers:{aToken}})

            if (data.success) {
                toast.success(data.message)
                console.log(data.message)
                getAllReviews()
            }else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    
    const cancelReviews = async (reviewId) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin//cancel-review', {reviewId}, {headers:{aToken}})

            if (data.success) {
                toast.success(data.message)
                console.log(data.message)
                getAllReviews()
            }else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        aToken,setAToken,
        backendUrl,lawyers,
        getAllLawyers,
        appointments,setAppointments,
        getAllAppointments,
        reviews,setReviews,
        getAllReviews,
        confirmReviews,cancelReviews
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider