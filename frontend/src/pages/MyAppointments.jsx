import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {


  const { backendUrl, token, getLawyersData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([])
  const months = [' ', 'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']

  //จัดรูปแบบวัน
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  //จัดรูปแบบเวลา
  const slotTimeFormat = (slotTime) => {
    const [startTime] = slotTime.split(' ')
    const endHour = parseInt(startTime) + 1;
    return `${startTime} - ${endHour}:00`
  }
  
  const [status, setStatus] = useState("scheduled");

  const getUserAppointments = async () => {

    try {
      
      const {data} = await axios.get(backendUrl + '/api/user/appointments',{headers:{token}})
      if(data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      
      const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment', {appointmentId}, {headers:{token}})
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getLawyersData()
      }else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  useEffect(() => {
    if(token) {
      getUserAppointments()
    }
  },[token])


  return (
    <div className="bg-light-brown p-4 md:p-6">
      <p className="flex justify-center items-center text-center bg-dark-brown bg-clip-text text-transparent text-2xl md:text-2xl font-medium mb-10">
        การนัดหมายของฉัน
      </p>

      <div className="flex items-center lg:justify-start justify-center gap-2 pb-2 mb-4">
        <button
          onClick={() => setStatus("scheduled")}
          className={`text-dark-brown rounded-full px-8 py-1 border border-dark-brown font-medium text-lg hover:bg-dark-brown hover:text-white ${
            status === "scheduled"
              ? "bg-dark-brown rounded-full px-8 py-1 text-white"
              : ""
          }`}
        >
          นัดหมายแล้ว
        </button>
        <button
          onClick={() => setStatus("completed")}
          className={`text-dark-brown rounded-full px-8 py-1 border border-dark-brown font-medium text-lg hover:bg-dark-brown hover:text-white ${
            status === "completed"
              ? "bg-dark-brown rounded-full px-8 py-1 text-white"
              : ""
          }`}
        >
          เสร็จสิ้นแล้ว
        </button>
      </div>

      <div className="space-y-4 mb-10">
        {appointments.filter(item => !item.cancelled).map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 relative"
          >
            <div
              className={`absolute top-6 right-6 px-3 py-1 text-base rounded-full font-medium ${
                status === "scheduled" ? " text-primary" : " text-green-800"
              }`}
            >
              {status === "scheduled" ? "นัดหมายแล้ว" : "เสร็จสิ้นแล้ว"}
            </div>

            <div className="bg-brown-lawyerpic rounded-full w-20 lg:w-32 h-20 lg:h-32 mx-0 lg:mx-0">
              <img
                src={item.lawyerData.image}
                alt=""
                className="w-full h-full rounded-full object-cover bg-gray-200"
              />
            </div>

            <div className="flex-1 w-full md:w-auto">
              <div className="flex flex-col gap-2 lg:flex-row lg:gap-2 items-start lg:items-center mb-2">
                <p className="text-lg font-medium text-dark-brown">
                  ทนาย {item.lawyerData.firstName} {item.lawyerData.lastName}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.lawyerData.speciality.map((spec, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-primary to-dark-brown text-white rounded-full px-3 py-1 text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2 text-gray-600 mt-4">
                <div className="flex items-center gap-4">
                  <img
                    src={assets.Calendar}
                    alt="calendar icon"
                    className="w-5 h-5"
                  />

                  <p className="text-dark-brown font-medium">{slotDateFormat(item.slotDate)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <img src={assets.Time} alt="clock icon" className="w-5 h-5" />

                  <p className="text-dark-brown font-medium">{slotTimeFormat(item.slotTime)} น.</p>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={assets.Location}
                    alt="location icon"
                    className="w-5 h-5"
                  />

                  <p className="text-dark-brown font-medium">
                    สำนักงานกฎหมายทนายนอร์ท
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm md:text-base font-medium mt-6 text-dark-brown">
                    รายละเอียดเบื้องต้น
                  </p>
                  <p className="text-sm md:text-base font-legular">
                    {item.user_topic}
                  </p>

                  <a
                    href="#"
                    className="text-primary underline text-sm flex items-center"
                  >
                    <i className="icon-file-pdf"></i>ตัวอย่างข้อความ.pdf
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-auto justify-end">
              <button onClick={() => cancelAppointment(item._id)} className="h-10 px-4 py-2 bg-[#A17F6B] text-white text-sm rounded hover:bg-[#8B6B59] transition w-40">
                ยกเลิกการนัดหมาย
              </button>
              <button className="h-10 px-4 py-2 bg-[#DADADA] text-white text-sm rounded hover:bg-gray-400 transition w-40">
                รีวิวการนัดหมาย
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
