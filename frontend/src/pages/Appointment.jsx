import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { assets } from "../assets/assets"; //เพิ่ม
import th from "date-fns/locale/th";
import Feedback from "../components/Feedback";
registerLocale("th", th);

const Appointment = () => {
  const { lawId } = useParams();
  const { lawyers } = useContext(AppContext);

  const [lawInfo, setLawInfo] = useState(null);
  const [lawSlots, setLawSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTimes] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false); //จัดการ Pop Up

  //ฟังก์ชันเปิดปิด Pop Up
  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

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

    console.log(timeSlots);
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
    return day !== 0 && date >= today;
  };

  useEffect(() => {
    fetchLawInfo();
  }, [lawyers, lawId]);

  useEffect(() => {
    if (lawInfo) {
      getAvailableSlots(selectedDate);
    }
  }, [lawInfo]);

  console.log(lawSlots);

  return (
    lawInfo && (
      <div className="bg-light-brown p-4">
        <p className="text-center text-dark-brown text-2xl font-medium pb-2">
          นัดหมายทนายความ
        </p>

        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex flex-col lg:flex-row w-full">
            {/* Lawyer Details */}
            <div className="bg-light-brown p-4 rounded w-full border-brown-lawyerpic">
              <div className="flex flex-col items-center lg:w-[780px]">
                {/* ส่วนรูปและข้อมูลหลัก */}
                <div className="flex flex-col sm:flex-row items-center w-full gap-6">
                  <div className="w-[220px] h-[220px] object-cover bg-white rounded-md flex justify-center items-center">
                    <img
                      className="w-[200px] h-[200px] object-cover bg-brown-lawyerpic rounded-full"
                      src={lawInfo.image}
                      alt=""
                    />
                  </div>

                  <div className="mt-4 sm:mt-0 sm:ml-4">
                    <div className="flex flex-col lg:flex-row lg:items-center">
                      <p className="font-medium text-2xl">
                        ทนาย {lawInfo.firstName} {lawInfo.lastName}
                      </p>
                      {lawInfo.is_thaibar && (
                        <div className="flex flex-row lg:flex-row items-center">
                          <img
                            src={assets.Is_Thaibar}
                            alt="Profile"
                            className="w-4 h-4 lg:ml-4 mr-1"
                          />
                          <p>เนติบัณฑิต</p>
                        </div>
                      )}
                    </div>
                    <p className="font-regular text-primary">
                      ทนายความ สำนักงานกฎหมายทนายนอร์ท
                    </p>
                    {/*<p>ประสบการณ์ทำงาน {lawInfo.experience} ปี</p>*/}
                    <p className="font-regular mt-5">
                      เลขที่ใบอนุญาตว่าความ {lawInfo.license_number}
                    </p>{" "}
                    <div className="flex items-center gap-2 mt-5">
                      <p>ความเชี่ยวชาญ</p>
                      <div className="flex flex-wrap gap-2">
                        {lawInfo.speciality.map((spec, idx) => (
                          <p
                            key={idx}
                            className="font-prompt text-xs bg-brown-lawyerpic text-black rounded-full px-2 py-1"
                          >
                            {spec}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ส่วนแนะนำตัว */}
                <div className="w-full mt-10">
                  <p className="text-left font-medium ml-4 lg:ml-0">
                    แนะนำตัว/ข้อมูลเพิ่มเติม
                  </p>
                  <p className="mt-2 lg:w-full ml-4 lg:ml-0">{lawInfo.bio}</p>
                  {/*<p className="text-left font-medium mt-2">
                  ราคา {lawInfo.fees} บาท
                </p> */}
                </div>
              </div>
            </div>
          </div>

          {/* ก้อนทางขวา ค่าบริการ วันเวลาของทนาย */}
          <div className="flex flex-col lg:w-1/2 p-4 bg-white rounded-lg lg:mr-6 mt-4 h-full">
            <div className="flex-grow">
              <p className="text-left font-medium ml-4 mt-4 text-dark-brown">
                ค่าบริการ
              </p>
              <p className="mt-2 ml-4 text-sm">{lawInfo.fees_detail}</p>{" "}
              {/* ต้องแก้ fees เป็น string */}
              {/* วันเวลาของทนาย */}
              <p className="text-left font-medium ml-4 mt-8 text-dark-brown">
                เวลาให้บริการ
              </p>
              {lawInfo.available_slots && lawInfo.available_slots.length > 0
                ? lawInfo.available_slots.map((slot, index) => (
                    <ul key={index} className="mt-3 ml-4">
                      <li className="flex items-center justify-between mb-2">
                        <p className="text-sm leading-6">{slot.day}</p>
                        <p className="text-sm leading-6">
                          {slot.startTime} - {slot.endTime} น.
                        </p>
                      </li>
                    </ul>
                  ))
                : null}
              {/* ปุ่มจองเวลานัดหมาย */}
              <button
                onClick={openPopup}
                className="mt-4 mx-auto bg-primary text-white w-full rounded h-10"
              >
                จองเวลานัดหมาย
              </button>
            </div>
          </div>
        </div>

        {/* ส่วนรายละเอียดคดี */}
        <div className="flex flex-col bg-[#F7F7F7] mt-10 rounded-lg items-center">
          <div className="flex flex-col sm:flex-row justify-between w-full">
            <div className="flex flex-row items-center mt-4 mb-4 ml-8 mr-8">
              <img
                className="w-8 h-8 mr-4 rounded-full"
                src={assets.Consult}
                alt="จำนวนการให้คำปรึกษา"
              />
              <p className="flex-1 lg:text-center">ให้คำปรึกษามาแล้ว ครั้ง</p>{" "}
              {/* เพิ่มการดึงค่ามาแสดง */}
            </div>

            <div className="flex flex-row items-center mt-4 mb-4 ml-8 mr-8">
              <img
                className="w-8 h-8 mr-4 rounded-full"
                src={assets.Case}
                alt="จำนวนคดี"
              />
              <p className="flex-1 lg:text-center"> ว่าความมาแล้ว คดี</p>{" "}
              {/* เพิ่มการดึงค่ามาแสดง */}
            </div>

            <div className="flex flex-row items-center mt-4 mb-4 ml-8 mr-8">
              <img
                className="w-8 h-8 mr-4 rounded-full"
                src={assets.Win}
                alt="จำนวนคดีที่ชนะ"
              />
              <p className="flex-1 lg:text-center">ชนะคิดเป็นร้อยละ</p>{" "}
              {/* เพิ่มการดึงค่ามาแสดง */}
            </div>
          </div>

          <button className="lg:w-1/3 px-6 py-2 mt-4 ml-4 mb-4 border text-dark-brown mr-4 rounded-full h-10">
            ดูรายละเอียดการว่าความ
          </button>
        </div>

        {/* ประวัติการศึกษา */}
        <div className="bg-[#F7F7F7] mt-5 rounded-lg">
          <div className="flex ml-4 lg:ml-20 mt-5 mr-4">
            <p className="font-medium text-dark-brown mt-5 mb-5">
              ประวัติการศึกษา
            </p>
          </div>

          <ul className="ml-4 lg:ml-20">
            {lawInfo.education.map((edu, index) => (
              <li key={index} className="flex flex-col mt-5">
                <div className="flex flex-col gap-1">
                  <span className="text-primary">
                    {edu.enrollmentYear}-{edu.graduationYear}
                  </span>
                </div>

                <div className="flex flex-col lg:flex-row gap-1 lg:gap-20 mt-1 mb-10">
                  <p className="lg:w-1/3">{edu.degree}</p>
                  <p>{edu.institution}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ประวัติการทำงาน */}
        <div className="bg-[#F7F7F7] mt-5 rounded-lg">
          <div className="flex ml-4 lg:ml-20 mt-5 mr-4">
            <p className="font-medium text-dark-brown mt-5 mb-5">
              ประวัติการทำงาน
            </p>
          </div>

          <ul className="ml-4 lg:ml-20">
            {lawInfo.work_experience.map((work, index) => (
              <li key={index} className="flex flex-col mt-5">
                <div className="flex flex-col gap-1">
                  <span className="text-primary">
                    {work.startDate} - {work.endDate}
                  </span>
                </div>

                <div className="flex flex-col lg:flex-row gap-1 lg:gap-20 mt-1 mb-10">
                  <p className="w-1/3">{work.position}</p>
                  <p>{work.company}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pop Up สำหรับจองเวลานัดหมาย */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-[600px] w-full">
              <div className="flex flex-row justify-between">
                <h2 className="text-lg font-medium text-dark-brown mb-4">
                  จองเวลานัดหมาย
                </h2>
                <img
                  onClick={closePopup}
                  src={assets.Cross_button}
                  alt="ยกเลิก"
                  className="w-7 h-7 cursor-pointer"
                />
              </div>

              <div className="flex flex-row gap-6 h-auto">
                <div>
                  <div>
                    <div className="flex flex-row gap-2 mb-2">
                      <p className="text-dark-brown font-medium">เลือกวัน</p>
                      <img src={assets.Calendar} alt="" className="w-5 h-5" />
                    </div>
                    {/* ปฏิทิน */}
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      locale="th"
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      filterDate={filterWeekdays}
                      inline
                    />
                  </div>
                </div>

                <div className="w-full">
                  {/* เวลา */}
                  <div className="flex flex-row gap-2 mb-2">
                    <p className="text-dark-brown font-medium">เลือกเวลา</p>
                    <img src={assets.Time} alt="" className="w-5 h-5" />
                  </div>
                  <div
                    className="flex flex-col items-center gap-2 border border-[#DADADA] rounded p-2 overflow-y-auto scrollbar-visible"
                    style={{
                      maxHeight: 242.3
                    }}
                  >
                    {lawSlots.length &&
                      lawSlots[slotIndex].map((item, index) => (
                        <div
                          onClick={() => setSlotTimes(item.time)}
                          className={`text-center py-3 px-4 w-3/4 rounded cursor-pointer transition-all duration-200
              ${
                item.time === slotTime
                  ? "bg-primary text-white"
                  : "border border-dark-brown text-dark-brown hover:bg-primary hover:text-white"
              }`}
                          key={index}
                        >
                          <p className="text-sm">{item.time.toLowerCase()}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-dark-brown font-medium mt-6">
                  เลือกจำนวนชั่วโมง
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <button className="px-8 py-1 border border-primary text-primary rounded-md hover:bg-primary hover:text-white">
                    30 นาที
                  </button>
                  <button className="px-8 py-1 border border-primary text-primary rounded-md hover:bg-primary hover:text-white">
                    1 ชั่วโมง
                  </button>
                  <button className="px-8 py-1 border border-primary text-primary rounded-md hover:bg-primary hover:text-white">
                    2 ชั่วโมง
                  </button>
                  <button className="px-8 py-1 border border-primary text-primary rounded-md hover:bg-primary hover:text-white">
                    3 ชั่วโมง
                  </button>
                </div>
              </div>

              <div>
                <p className="text-dark-brown font-medium mt-6">
                  สรุปการนัดหมาย
                </p>
                <p className="text-primary font-legular text-sm mt-2">
                  วันที่ 17/12/2024 เวลา 8.00-8.30 น.
                </p>
              </div>

              <div>
                <p className="text-dark-brown font-medium mt-6">
                  เรื่องที่ต้องการปรึกษา
                </p>
                <input
                  className="w-full mt-2 px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
                  type="text"
                  placeholder="โปรดระบุเรื่องที่คุณต้องการปรึกษาเบื้องต้น"
                />
              </div>

              <div>
                <p className="text-dark-brown font-medium mt-6">
                  อัปโหลดเอกสารเบื้องต้น
                </p>
              </div>

              <div className="flex justify-center mt-10">
                <button className="border border-dark-brown text-dark-brown px-4 py-1 rounded hover:bg-dark-brown hover:text-white">
                  จองเวลานัดหมาย
                </button>
              </div>
            </div>
          </div>
        )}

        {/* รีวิวทั้งหมด */}
        <div>
          <Feedback />
        </div>

        {/* Appointment Booking */}
        {/* <div className="bg-white p-6 rounded-lg mt-4">
          <h2 className="text-2xl font-medium mb-6">จองเวลานัดหมาย</h2> */}

        {/* Calendar Section */}
        {/* <div className="mb-8">
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
          </div> */}

        {/* Time Slots Section */}
        {/* <div className="mb-8">
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
          </div> */}

        {/* Confirm Button */}
        {/* <button
            className="w-full sm:w-auto bg-brown-lawyerpic text-white rounded-lg px-8 py-3 font-medium
    hover:bg-opacity-90 transition-all duration-200"
          >
            ยืนยันการนัดหมาย
          </button>
        </div> */}
      </div>
    )
  );
};

export default Appointment;
