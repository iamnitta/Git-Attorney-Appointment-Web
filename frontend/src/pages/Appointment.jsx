import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { assets } from "../assets/assets"; //เพิ่ม
import th from "date-fns/locale/th";
import Feedback from "../components/Feedback";
import { toast } from "react-toastify";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("th", th);

const Appointment = () => {
  const { lawId } = useParams();
  const { lawyers, backendUrl, token, getLawyersData } = useContext(AppContext);
  const [tab, setTab] = useState("about");

  const navigate = useNavigate();

  const [lawInfo, setLawInfo] = useState(null);
  const [lawSlots, setLawSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTimes] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false); //จัดการ Pop Up
  const [user_topic, setUser_topic] = useState("");

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
    // แปลงวันที่เลือกเป็นภาษาไทย
    const dayOfWeek = selectedDate.getDay();
    const dayNames = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];
    const currentDayName = dayNames[dayOfWeek];

    // หาช่วงเวลาที่ทนายว่างในวันที่เลือก
    const availableSlot = lawInfo.available_slots.find(
      (slot) => slot.day === currentDayName
    );

    if (!availableSlot) {
      return; // ถ้าไม่มีเวลาว่างในวันนี้
    }

    // แปลงเวลาเริ่มและสิ้นสุดเป็น Date object
    // เริ่มจาก split ค่าเอา start กับ  end  ออกมา
    let currentDate = new Date(selectedDate);
    const [startHour, startMinute] = availableSlot.startTime.split(":");
    const [endHour, endMinute] = availableSlot.endTime.split(":");

    // นำเวลาเริ่มต้นที่ว่าง ที่ทำการแปลงมาเมื่อกี้มาใส่ให้กับ currentDate
    currentDate.setHours(parseInt(startHour), parseInt(startMinute), 0);

    // นำเวลาสุดท้ายที่ว่าง ที่ทำการแปลงมาเมื่อกี้มาใส่ให้กับ endTime
    let endTime = new Date(selectedDate);
    endTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

    let timeSlots = [];
    // เอามาเช็คเวลาว่าเกินเวลาปัจจุบันไหม
    const now = new Date();

    while (currentDate < endTime) {
      let formattedTime = currentDate.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      let day = currentDate.getDate();
      let month = currentDate.getMonth() + 1;
      let year = currentDate.getFullYear();

      const slotDate = day + "_" + month + "_" + year;
      const slotTime = formattedTime;

      const isSlotAvailable =
        lawInfo.slots_booked[slotDate] &&
        lawInfo.slots_booked[slotDate].includes(slotTime)
          ? false
          : true;

      const isTimeValid =
        selectedDate.getDate() !== now.getDate() || currentDate > now;

      if (isSlotAvailable && isTimeValid) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
      }

      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    setLawSlots([timeSlots]);
    setSlotIndex(0);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    getAvailableSlots(date);
  };

  // เพิ่มฟังก์ชันสำหรับกรองวันที่
  const filterWeekdays = (date) => {
    const dayNames = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];
    const dayName = dayNames[date.getDay()];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // เช็คว่ามีวันนี้ในตารางเวลาว่างของทนายไหม
    const hasAvailableSlot = lawInfo.available_slots.some(
      (slot) => slot.day === dayName
    );

    return date >= today && hasAvailableSlot;
  };

  //สร้างฟังก์ชันหาวันที่ว่างที่ใกล้ที่สุด
  const getNextAvailableDate = (lawInfo) => {
    const today = new Date();
    let checkDate = new Date(today);

    // วนหาวันที่ว่างถัดไป
    while (true) {
      const dayNames = [
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัสบดี",
        "ศุกร์",
        "เสาร์",
      ];
      const dayName = dayNames[checkDate.getDay()];

      // เช็คว่าวันนี้ทนายว่างไหม
      const hasAvailableSlot = lawInfo.available_slots.some(
        (slot) => slot.day === dayName
      );

      if (hasAvailableSlot) {
        return checkDate;
      }

      // ถ้าไม่ว่าง เพิ่มไปอีก 1 วัน
      checkDate.setDate(checkDate.getDate() + 1);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("เข้าสู่ระบบ เพื่อทำการจองนัดหมายทนาย");
      return navigate("/login");
    }

    try {
      const date = lawSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { lawId, slotDate, slotTime, user_topic },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getLawyersData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  //คำนวนเวลาให้เวลาแสดงในสรุปเช่น 12:30 - 13:00
  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    let endMinutes = minutes + 30;
    let endHours = hours;

    if (endMinutes >= 60) {
      endMinutes -= 60;
      endHours += 1;
    }

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    fetchLawInfo();
  }, [lawyers, lawId]);

  useEffect(() => {
    if (lawInfo) {
      const nextAvailable = getNextAvailableDate(lawInfo);
      setSelectedDate(nextAvailable);
      getAvailableSlots(nextAvailable);
    }
  }, [lawInfo]);

  console.log(lawSlots);

  return (
    lawInfo && (
      <div className="bg-white p-4 animate-fadeIn">
        <div className="mb-8 lg:w-[95%] mx-auto">
          <h1 className="text-2xl font-medium text-dark-brown">
            นัดหมายทนายความ
          </h1>
        </div>

        <div
          className="p-4 shadow-lg lg:w-[95%] mx-auto bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${assets.Background})`,
          }}
        >
          <div className="bg-white rounded-lg shadow-lg lg:p-6 lg:h-auto w-full -mb-20">
            <div className="flex flex-col lg:flex-row w-full">
              {/* Lawyer Details */}
              <div className="bg-white p-4 rounded w-full border-brown-lawyerpic">
                <div className="flex flex-col items-center lg:w-[780px]">
                  {/* ส่วนรูปและข้อมูลหลัก */}
                  <div className="flex flex-col sm:flex-row items-center w-full gap-6">
                    <div className="lg:w-[220px] lg:h-[220px] w-[120px] h-[120px] object-cover bg-white rounded-md flex justify-center items-center">
                      <img
                        className="lg:w-[200px] lg:h-[200px] w-[120px] h-[120px] object-cover bg-brown-lawyerpic rounded-full"
                        src={lawInfo.image}
                        alt=""
                      />
                    </div>

                    <div className="lg:mt-4">
                      <div className="gap-4 flex flex-col">
                        {lawInfo.is_thaibar && (
                          <div className="flex flex-row items-center gap-2">
                            <p className="text-dark-brown border border-dark-brown rounded-full px-4">
                              เนติบัณฑิต
                            </p>
                          </div>
                        )}
                        <p className="font-medium lg:text-2xl text-xl text-dark-brown">
                          ทนาย {lawInfo.firstName} {lawInfo.lastName}
                        </p>
                      </div>
                      <p className="font-regular mt-5">
                        เลขที่ใบอนุญาตว่าความ {lawInfo.license_number}
                      </p>{" "}
                      <div className="flex items-center gap-2 mt-5">
                        <p className="whitespace-nowrap">ความเชี่ยวชาญ</p>
                        <div className="flex flex-wrap gap-2">
                          {lawInfo.speciality.map((spec, idx) => (
                            <p
                              key={idx}
                              className="font-prompt text-xs bg-gradient-to-r from-primary to-dark-brown text-white rounded-full px-2 py-1"
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
                    <p className="text-left font-medium text-dark-brown">
                      แนะนำตัว/ข้อมูลเพิ่มเติม
                    </p>
                    <p className="mt-2 lg:w-full">{lawInfo.bio}</p>
                  </div>
                </div>
              </div>

              {/* ก้อนทางขวา ค่าบริการ วันเวลาของทนาย */}
              <div className="flex flex-col lg:w-1/2 p-4 border border-dark-brown bg-white rounded-lg lg:mr-6 mt-4 h-full lg:ml-0 ml-2 mr-2 lg:mb-0 mb-2">
                <div className="flex-grow">
                  <p className="text-left font-medium ml-4 mt-4 text-dark-brown">
                    ค่าบริการ
                  </p>
                  <p className="mt-2 ml-4 text-sm">{lawInfo.fees_detail}</p>{" "}
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
                    className="mt-4 mx-auto bg-dark-brown text-white w-full rounded h-10 hover:brightness-75 transition-all duration-300"
                  >
                    จองเวลานัดหมาย
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ส่วนรายละเอียดคดี */}
        <div className="flex flex-col justify-center bg-light-brown mt-32 rounded-lg items-center lg:p-6 p-2 mx-auto shadow-lg lg:w-[95%]">
          <div className="flex flex-col sm:flex-row justify-between w-full">
            <div className="flex flex-row items-center mt-4 mb-4 ml-8 mr-8">
              <img
                className="w-8 h-8 mr-4 rounded-full"
                src={assets.Consult_1}
                alt="จำนวนการให้คำปรึกษา"
              />
              <p className="flex-1 lg:text-center text-dark-brown">
                ให้คำปรึกษามาแล้ว{" "}
                <span className="text-white bg-primary rounded-full px-6">
                  10
                </span>{" "}
                ครั้ง
              </p>{" "}
              {/* เพิ่มการดึงค่ามาแสดง */}
            </div>

            <div className="flex flex-row items-center mt-4 mb-4 ml-8 mr-8">
              <img
                className="w-8 h-8 mr-4 rounded-full"
                src={assets.Case}
                alt="จำนวนคดี"
              />
              <p className="flex-1 lg:text-center text-dark-brown">
                {" "}
                ว่าความมาแล้ว{" "}
                <span className="text-white bg-primary rounded-full px-6">
                  5
                </span>{" "}
                คดี
              </p>{" "}
              {/* เพิ่มการดึงค่ามาแสดง */}
            </div>

            <div className="flex flex-row items-center mt-4 mb-4 ml-8 mr-8">
              <img
                className="w-8 h-8 mr-4 rounded-full"
                src={assets.Win_1}
                alt="จำนวนคดีที่ชนะ"
              />
              <p className="flex-1 lg:text-center text-dark-brown">
                ชนะคิดเป็นร้อยละ{" "}
                <span className="text-white bg-primary rounded-full px-4">
                  75%
                </span>
              </p>{" "}
              {/* เพิ่มการดึงค่ามาแสดง */}
            </div>
          </div>

          <a
            href="/case"
            className="lg:px-8 px-6 mt-6 lg:mt-10 ml-4 mb-4 lg:text-base text-sm border text-dark-brown mr-4 rounded-full h-10 hover:bg-dark-brown hover:text-white flex items-center justify-center"
          >
            ดูรายละเอียดการว่าความ
          </a>
        </div>

        <div className="mt-20 border-b border-solid border-[#DADADA] mx-auto lg:w-[95%]">
          <button
            onClick={() => setTab("about")}
            className={`py-2 px-5 mr-5 text-dark-brown font-semibold ${
              tab === "about" && "border-b border-solid border-dark-brown"
            }`}
          >
            ข้อมูลส่วนตัว
          </button>
          <button
            onClick={() => setTab("reviews")}
            className={`py-2 px-5 mr-5 text-dark-brown font-semibold ${
              tab === "reviews" && "border-b border-solid border-dark-brown"
            }`}
          >
            ความคิดเห็น
          </button>
        </div>

        {tab === "about" && (
          <>
            {/* ประวัติการศึกษา */}
            <div className="bg-[#F7F7F7] mt-5 rounded-lg mx-auto lg:w-[95%] animate-fadeIn">
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
            <div className="bg-[#F7F7F7] mt-5 rounded-lg mx-auto lg:w-[95%] animate-fadeIn">
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
          </>
        )}

        {/* Pop Up สำหรับจองเวลานัดหมาย */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-white pl-4 pr-4 pb-4 rounded-lg max-w-[600px] w-full h-[80%] md:h-auto overflow-y-auto animate-popup mx-2">
              <div className="sticky top-0 bg-white z-10 pt-4 flex flex-row justify-between">
                <h2 className="text-lg font-medium text-dark-brown mb-4">
                  จองเวลานัดหมาย
                </h2>

                <img
                  onClick={closePopup}
                  src={assets.Close_2}
                  alt="ปิด PopUp"
                  className="w-7 h-7 cursor-pointer"
                />
              </div>

              {/* ส่วนแสดงข้อมูลทนายและค่าบริการ */}
              <div className="flex items-center gap-4 p-4 bg-light-brown rounded-lg mb-4 border border-primary">
                <img
                  src={lawInfo.image}
                  alt="lawyer"
                  className="w-12 h-12 rounded-full"
                />
                <div className="w-full">
                  <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-dark-brown">
                        ทนาย {lawInfo.firstName} {lawInfo.lastName}
                      </p>
                      <div className="flex gap-2 items-center mt-1 lg:mt-0">
                        <div className="flex flex-col lg:flex-row gap-1">
                          <p className="text-sm text-gray-600 whitespace-nowrap">
                            ความเชี่ยวชาญ
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {lawInfo.speciality.map((spec, idx) => (
                              <span
                                key={idx}
                                className="bg-gradient-to-r from-primary to-dark-brown text-white px-2 py-0.5 rounded-full text-xs"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row lg:flex-col gap-2 lg:gap-1 mt-1 lg:mt-0">
                      <p className="text-sm text-dark-brown font-medium">
                        ค่าบริการ
                      </p>
                      <p className="text-primary text-sm">
                        ขั้นต่ำ 500 บาท ต่อ 30 นาที
                      </p>
                      {/* <p className="text-primary">ขั้นต่ำ {lawInfo.fees_detail} บาท/ชั่วโมง</p> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 h-auto">
                <div>
                  <div>
                    <div className="flex flex-row gap-2 mb-2">
                      <p className="text-dark-brown font-medium">เลือกวัน</p>
                      <img src={assets.Calendar} alt="" className="w-5 h-5" />
                    </div>
                    {/* ปฏิทิน */}
                    <div className="w-full custom-datepicker">
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
                      maxHeight: 274.8,
                      minHeight: 274.8,
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

              {/* <div>
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
              </div> */}

              <div className="flex flex-row mt-6">
                <p className="font-medium text-sm bg-gradient-to-r from-dark-brown to-primary text-white px-4 py-1 rounded-l w-2/4 lg:w-1/4 flex items-center justify-center">
                  สรุปการนัดหมาย
                </p>
                <p className="text-primary font-legular text-sm px-4 py-1 bg-light-brown w-3/4 rounded-r">
                  {selectedDate && (
                    <>
                      วันที่{" "}
                      {selectedDate.toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })}
                    </>
                  )}
                  {slotTime &&
                    ` เวลา ${slotTime} - ${calculateEndTime(slotTime)} น.`}
                </p>
              </div>

              <div>
                <p className="text-dark-brown font-medium mt-6">
                  เรื่องที่ต้องการปรึกษา
                </p>
                <input
                  className="w-full mt-2 px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
                  type="text"
                  value={user_topic}
                  onChange={(e) => setUser_topic(e.target.value)}
                  placeholder="โปรดระบุเรื่องที่คุณต้องการปรึกษาเบื้องต้น"
                />
              </div>

              <div>
                <p className="text-dark-brown font-medium mt-6">
                  อัปโหลดเอกสารเบื้องต้น
                </p>
                <div className="w-full h-10 border border-[#DADADA] rounded mt-2"></div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={bookAppointment}
                  className="px-4 py-1 bg-dark-brown text-white rounded"
                >
                  ยืนยันการนัดหมาย
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "reviews" && <Feedback/>}
      </div>
    )
  );
};

export default Appointment;
