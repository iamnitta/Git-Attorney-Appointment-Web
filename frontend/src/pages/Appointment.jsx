import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import th from "date-fns/locale/th";
registerLocale("th", th);

const Appointment = () => {
  const { lawId } = useParams();
  const { lawyers } = useContext(AppContext);


  const [lawInfo, setLawInfo] = useState(null);
  const [lawSlots, setLawSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTimes] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchLawInfo = async () => {
    const lawInfo = lawyers.find((law) => law._id === lawId);
    setLawInfo(lawInfo);
    console.log(lawInfo);
  };

  const getAvailableSlots = async (selectedDate) => {
    setLawSlots([]);
    let today = new Date();
    let currentDate = new Date(selectedDate);
    let endTime = new Date(selectedDate);
    endTime.setHours(18, 0, 0, 0);

    if (today.getDate() === currentDate.getDate()) {
      currentDate.setHours(
        currentDate.getHours() > 8 ? currentDate.getHours() + 1 : 8
      );
      currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
    } else {
      currentDate.setHours(8);
      currentDate.setMinutes(0);
    }

    let timeSlots = [];

    while (currentDate < endTime) {
      if (currentDate.getHours() === 12) {
        currentDate.setHours(13, 0, 0);
        continue;
      }

      let formattedTime = currentDate.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      timeSlots.push({
        datetime: new Date(currentDate),
        time: formattedTime,
      });

      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    setLawSlots([timeSlots]);
    setSlotIndex(0);

    console.log(timeSlots)
    
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    getAvailableSlots(date);
  };

  // เพิ่มฟังก์ชันสำหรับกรองวันที่
  const filterWeekdays = (date) => {
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day !== 0  && date >= today;
  };

  useEffect(() => {
    fetchLawInfo();
  }, [lawyers, lawId]);

  useEffect(() => {
    if (lawInfo) {
      getAvailableSlots(selectedDate);
    }
  }, [lawInfo]);

  console.log(lawSlots)

  return (
    lawInfo && (
      <div className="bg-light-brown p-4">
        <p className="text-center text-2xl font-medium pb-2">นัดหมายทนายความ</p>
        <p>เกี่ยวกับทนายความ</p>

        <div className="flex">
          {/* Lawyer Details */}
          <div className="bg-light-brown p-4 rounded w-full  border-2 border-brown-lawyerpic">
            <div className="flex flex-col items-center">
              {/* ส่วนรูปและข้อมูลหลัก */}
              <div className="flex flex-col sm:flex-row items-center w-full">
                <div className="w-[220px] h-[220px] object-cover bg-white rounded-md flex justify-center items-center">
                  <img
                    className="w-[200px] h-[200px] object-cover bg-brown-lawyerpic rounded-full"
                    src={lawInfo.image}
                    alt=""
                  />
                </div>

                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <p className="font-medium">{lawInfo.name}</p>
                  <p>ประสบการณ์ทำงาน {lawInfo.experience} ปี</p>
                  <div className="flex items-center gap-2">
                    <p>ความเชี่ยวชาญ: </p>
                    <p className="font-prompt text-xs bg-brown-lawyerpic text-black rounded-full px-2 py-1">
                      {lawInfo.speciality}
                    </p>
                  </div>
                  <p>การศึกษา: {lawInfo.education}</p>
                </div>
              </div>

              {/* ส่วนแนะนำตัวและราคา */}
              <div className="w-full mt-4">
                <p className="text-left">แนะนำตัว: {lawInfo.about}</p>
                <p className="text-left font-medium mt-2">
                  ราคา: {lawInfo.fees} บาท
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Booking */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
          <h2 className="text-2xl font-medium mb-6">จองเวลานัดหมาย</h2>

          {/* Calendar Section */}
          <div className="mb-8">
            <h3 className="text-lg mb-4 text-gray-700">เลือกวันที่</h3>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              locale="th"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              filterDate={filterWeekdays}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-brown-lawyerpic"
              customInput={
                <input className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-brown-lawyerpic cursor-pointer" />
              }
            />
          </div>

          {/* Time Slots Section */}
          <div className="mb-8">
            <h3 className="text-lg mb-4 text-gray-700">เลือกเวลา</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {lawSlots.length &&
                lawSlots[slotIndex].map((item, index) => (
                  <div
                    onClick={() => setSlotTimes(item.time)}
                    className={`text-center py-3 px-4 rounded-lg cursor-pointer transition-all duration-200
              ${
                item.time === slotTime
                  ? "bg-brown-lawyerpic text-white shadow-md transform scale-105"
                  : "border border-gray-200 hover:border-brown-lawyerpic hover:shadow-sm"
              }`}
                    key={index}
                  >
                    <p className="text-sm">{item.time.toLowerCase()}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            className="w-full sm:w-auto bg-brown-lawyerpic text-white rounded-lg px-8 py-3 font-medium
    hover:bg-opacity-90 transition-all duration-200 shadow-md"
          >
            ยืนยันการนัดหมาย
          </button>
        </div>
      </div>
    )
  );
};

export default Appointment;
