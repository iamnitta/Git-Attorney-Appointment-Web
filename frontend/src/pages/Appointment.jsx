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
registerLocale("th", th);

const Appointment = () => {
  const { lawId } = useParams();
  const { lawyers, backendUrl, token, getLawyersData } = useContext(AppContext);

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
    const [hours, minutes] = startTime.split(':').map(Number);
    let endMinutes = minutes + 30;
    let endHours = hours;
    
    if (endMinutes >= 60) {
      endMinutes -= 60;
      endHours += 1;
    }
    
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
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
                  alt="ปิด PopUp"
                  className="w-7 h-7 cursor-pointer"
                />
              </div>

              {/* เพิ่มส่วนแสดงข้อมูลทนายและค่าบริการ */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                <img
                  src={lawInfo.image}
                  alt="lawyer"
                  className="w-12 h-12 rounded-full"
                />
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">
                      ทนาย {lawInfo.firstName} {lawInfo.lastName}
                    </p>
                    <p className="text-sm text-gray-600">ค่าบริการ</p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex gap-2 items-center">
                      <p className="text-sm text-gray-600">ความเชี่ยวชาญ:</p>
                      {lawInfo.speciality.map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-brown-lawyerpic px-2 py-0.5 rounded-full text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                    <p className="text-primary"> 199 บาท/ชั่วโมง</p>
                    {/* <p className="text-primary">ขั้นต่ำ {lawInfo.fees_detail} บาท/ชั่วโมง</p> */}
                  </div>
                </div>
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
                      maxHeight: 242.3,
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

              <div>
                <p className="text-dark-brown font-medium mt-6">
                  สรุปการนัดหมาย
                </p>
                <p className="text-primary font-legular text-sm mt-2">
                  {selectedDate && (
                    <>
                      วันที่ {selectedDate.toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric'
                      })}
                    </>
                  )}
                  {slotTime && ` เวลา ${slotTime} - ${calculateEndTime(slotTime)} น.`}
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
              </div>

              <div className="flex justify-center mt-10">
                <button
                  onClick={bookAppointment}
                  className="border border-dark-brown text-dark-brown px-4 py-1 rounded hover:bg-dark-brown hover:text-white"
                >
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
      </div>
    )
  );
};

export default Appointment;
