import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AiFillStar } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf"; // เพิ่มการนำเข้า
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// ตั้งค่า worker โดยใช้ CDN ที่ถูกต้อง
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const MyAppointments = () => {
  const { backendUrl, token, getLawyersData } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState(false); //จัดการ Pop Up
  const [status, setStatus] = useState("scheduled");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('')
  const [appointments, setAppointments] = useState([]);
  const months = [
    " ",
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];


  //จัดการไฟล์
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [numPages, setNumPages] = useState(null);

  //ฟังก์ชันเปิดปิด Pop Up
  const openPopup = (appointment) => {
    setSelectedAppointment(appointment)
    setShowPopup(true)
  };
  const closePopup = () => {
    setShowPopup(false)
    setRating(0)
  };

  const submitReview = async () => {
    try {
      const {data} = await axios.post(backendUrl + '/api/user/add-review', {appointmentId: selectedAppointment._id, lawId: selectedAppointment.lawyerData._id, rating, comment},{headers: {token}})

      if (data.success) {
        toast.success(data.message)
        closePopup()
        getUserAppointments()
      }else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  }

  //ฟังก์ชันให้คะแนน
  const handleRating = (rate) => {
    setRating(rate);
  };

  // จัดการหน้าไฟล์
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  //จัดรูปแบบวัน
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  //จัดรูปแบบเวลา
  const slotTimeFormat = (slotTime) => {
    const [startTime] = slotTime.split(" ");
    const hour = parseInt(startTime);
    if (startTime.endsWith(":30")) {
      return `${hour}:30 - ${hour + 1}:00`;
    }
    return `${hour}:00 - ${hour}:30`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getLawyersData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="bg-white p-4 md:p-6 animate-fadeIn">
      <p className="flex justify-center items-center text-center bg-dark-brown bg-clip-text text-transparent text-2xl md:text-2xl font-medium mb-10">
        การนัดหมายของฉัน
      </p>

      <div className="flex items-center lg:justify-start justify-center gap-2 pb-2 mb-4 md:w-2/4 w-full">
        <button
          onClick={() => setStatus("scheduled")}
          className={`text-dark-brown rounded-full px-8 py-1 border border-dark-brown font-medium text-lg hover:bg-dark-brown hover:text-white md:w-1/3 w-full ${
            status === "scheduled"
              ? "bg-dark-brown rounded-full px-8 py-1 text-white"
              : ""
          }`}
        >
          รอปรึกษา
        </button>
        <button
          onClick={() => setStatus("completed")}
          className={`text-dark-brown rounded-full px-8 py-1 border border-dark-brown font-medium text-lg hover:bg-dark-brown hover:text-white md:w-1/3 w-full ${
            status === "completed"
              ? "bg-dark-brown rounded-full px-8 py-1 text-white"
              : ""
          }`}
        >
          ปรึกษาเสร็จสิ้น
        </button>
      </div>

      <div className="space-y-4 mb-10">
        {appointments
          .filter(
            (item) =>
              !item.cancelled &&
              (status === "completed" ? item.isCompleted : !item.isCompleted)
          )
          .map((item, index) => (
            <div
              key={`${item._id}-${index}`} // ใช้ key ที่ไม่ซ้ำกัน
              className="bg-light-brown rounded-lg p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 relative animate-fadeIn"
            >
              <div
                className={`absolute top-6 right-6 px-3 py-1 text-base rounded-full font-medium ${
                  status === "scheduled" ? " text-primary" : " text-green-800"
                }`}
              >
                {status === "scheduled" ? "รอปรึกษา" : "ปรึกษาเสร็จสิ้น"}
              </div>

              <div className="bg-brown-lawyerpic rounded-full w-20 lg:w-32 h-20 lg:h-32 mx-0 lg:mx-0 ">
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

                    <p className="text-dark-brown font-medium">
                      {slotDateFormat(item.slotDate)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={assets.Time}
                      alt="clock icon"
                      className="w-5 h-5"
                    />

                    <p className="text-dark-brown font-medium">
                      {slotTimeFormat(item.slotTime)} น.
                    </p>
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
                    <p className="text-base md:text-lg font-medium mt-6 text-dark-brown">
                      รายละเอียด
                    </p>
                    <p className="text-sm md:text-base font-legular">
                      {item.user_topic}
                    </p>

                    <button
                      onClick={() => {
                        console.log("documentUrl:", item.documentUrl);
                        setSelectedAppointment(item);
                        setShowPdfModal(true);
                      }}
                      className="underline text-primary hover:text-dark-brown text-left"
                    >
                      เอกสารเบื้องต้น
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-auto justify-end">
                {status === "scheduled" && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="h-10 px-4 py-2 bg-[#A17F6B] text-white text-sm rounded hover:bg-[#8B6B59] transition w-40"
                  >
                    ยกเลิกการนัดหมาย
                  </button>
                )}
                <button
                  className={`h-10 px-4 py-2 text-white text-sm rounded w-48 ${
                    status === "scheduled" || item.isReviewed
                      ? "bg-[#DADADA] cursor-not-allowed"
                      : "bg-[#A17F6B] hover:bg-[#8B6B59] transition"
                  }`}
                  onClick={status === "scheduled" || item.isReviewed ? null : () => openPopup(item)}
                  disabled={status === "scheduled" || item.isReviewed}
                >
                  {item.isReviewed ? "แสดงความคิดเห็นแล้ว" : "แสดงความคิดเห็น"}
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* เพิ่ม Modal PDF ตรงนี้ */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[800px] h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-8">
              <h2 className="text-3xl font-medium text-dark-brown">
                รายละเอียดการปรึกษา
              </h2>
              <img
                onClick={() => setShowPdfModal(false)}
                src={assets.Close_2}
                alt="ปิด"
                className="w-7 h-7 cursor-pointer"
              />
            </div>
            {/* เพิ่มส่วนแสดงเรื่องที่ต้องการปรึกษา */}
            <div className="mb-6">
              <h3 className="text-xl mb-4">เรื่องที่ต้องการปรึกษา</h3>
              <div className="bg-[#F9F5F3] p-6 rounded border border-[#D4C7BD]">
                <p>{selectedAppointment?.user_topic || "ไม่มีรายละเอียด"}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl mb-4">เอกสารเบื้องต้น</h3>
              <div className="border border-[#D4C7BD] rounded-lg p-4 bg-[#F9F5F3] overflow-x-auto">
                <div className="max-w-[750px] mx-auto">
                  {selectedAppointment?.documentUrl ? (
                    <Document
                      file={selectedAppointment.documentUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      className="pdf-document"
                    >
                      {Array.from(new Array(numPages), (el, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          width={700}
                          className="mb-4"
                        />
                      ))}
                    </Document>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      ไม่พบเอกสาร
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pop Up สำหรับแสดงความคิดเห็นการนัดหมาย */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white pl-4 pr-4 pb-4 rounded-lg max-w-[600px] w-full h-auto md:h-auto overflow-y-auto animate-popup mx-2">
            <div className="sticky top-0 bg-white z-10 pt-4 flex flex-row justify-between">
              <h2 className="text-lg font-medium text-dark-brown mb-4">
                แสดงความคิดเห็น
              </h2>

              <img
                onClick={closePopup}
                src={assets.Close_2}
                alt="ปิด PopUp"
                className="w-7 h-7 cursor-pointer"
              />
            </div>

            <p className="text-dark-brown font-medium mb-2">
              ทนายความที่ให้บริการ
            </p>

            <div className="flex items-center gap-4 p-4 bg-light-brown rounded-lg mb-4 border border-primary">
              <img
                // src={lawInfo.image}
                src={selectedAppointment.lawyerData.image}
                alt="lawyer"
                className="w-12 h-12 rounded-full"
              />
              <div className="w-full">
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-dark-brown">
                       ทนาย {selectedAppointment.lawyerData.firstName} {selectedAppointment.lawyerData.lastName} 
                    </p>
                    <div className="flex gap-2 items-center mt-1 lg:mt-0">
                      <div className="flex flex-col lg:flex-row gap-1">
                        <p className="text-sm text-gray-600 whitespace-nowrap">
                          ความเชี่ยวชาญ
                        </p>
                        <div className="flex flex-wrap gap-1">
                           {selectedAppointment.lawyerData.speciality.map((spec, idx) => (
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
                      ขั้นต่ำ {selectedAppointment.lawyerData.fees_detail} บาท ต่อ 30 นาที
                    </p>
                    {/* <p className="text-primary">ขั้นต่ำ {lawInfo.fees_detail} บาท/ชั่วโมง</p> */}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-dark-brown font-medium mt-8">ให้คะแนน</p>

            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <AiFillStar
                  key={star}
                  size={30}
                  className={`cursor-pointer ${
                    star <= rating ? "text-primary" : "text-[#DADADA]"
                  }`}
                  onClick={() => handleRating(star)}
                />
              ))}
            </div>

            <p className="text-dark-brown font-medium mt-6">
              ความคิดเห็นต่อทนายความของเรา
            </p>
            <textarea
              className="w-full mt-2 px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="โปรดระบุความคิดเห็นต่อการให้บริการของทนายความ"
            />

            <div className="mt-6">
              <button
                onClick={submitReview}
                className="px-4 py-1 bg-dark-brown text-white rounded"
              >
                ส่งความคิดเห็น
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default MyAppointments;
