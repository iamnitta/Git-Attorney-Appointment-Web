import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AiFillStar } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf"; // เพิ่มการนำเข้า
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useNavigate } from "react-router-dom";

// ตั้งค่า worker โดยใช้ CDN ที่ถูกต้อง
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const MyAppointments = () => {
  const { backendUrl, token, getLawyersData } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState(false); //จัดการ Pop Up
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [status, setStatus] = useState("scheduled");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
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
  const navigate = useNavigate();

  //Popup ยืนยันยกเลิกการนัดหมาย
  const handleCancelClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowCancelPopup(true);
  };

  const handleConfirmCancel = () => {
    if (selectedAppointmentId) {
      cancelAppointment(selectedAppointmentId);
      setShowCancelPopup(false);
      setSelectedAppointmentId(null);
    }
  };

  const handleClosePopup = () => {
    setShowCancelPopup(false);
    setSelectedAppointmentId(null);
  };

  //จัดการไฟล์
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [numPages, setNumPages] = useState(null);

  //ฟังก์ชันเปิดปิด Pop Up
  const openPopup = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPopup(true);
  };
  const closePopup = () => {
    setShowPopup(false);
    setRating(0);
  };

  const submitReview = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/add-review",
        {
          appointmentId: selectedAppointment._id,
          lawId: selectedAppointment.lawyerData._id,
          rating,
          comment,
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        closePopup();
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

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
      <p className="flex bg-dark-brown bg-clip-text text-transparent text-2xl md:text-2xl font-medium mb-6">
        การนัดหมายของฉัน
      </p>

      <div className="flex items-center lg:justify-start justify-center gap-2 pb-2 mb-4 w-full">
        <button
          onClick={() => setStatus("scheduled")}
          className={`text-dark-brown rounded-full px-4 py-1 border border-dark-brown font-medium text-lg hover:bg-dark-brown hover:text-white md:w-fit w-fit ${
            status === "scheduled"
              ? "bg-dark-brown rounded-full px-4 py-1 text-white"
              : ""
          }`}
        >
          รอปรึกษา
        </button>
        <button
          onClick={() => setStatus("completed")}
          className={`text-dark-brown rounded-full px-4 py-1 border border-dark-brown font-medium text-lg hover:bg-dark-brown hover:text-white md:w-fit w-fit ${
            status === "completed"
              ? "bg-dark-brown rounded-full px-4 py-1 text-white"
              : ""
          }`}
        >
          ปรึกษาเสร็จสิ้น
        </button>

        <button
          onClick={() => setStatus("cancel")}
          className={`text-dark-brown rounded-full px-4 py-1 border border-dark-brown font-medium text-lg hover:bg-dark-brown hover:text-white md:w-fit w-fit ${
            status === "cancel"
              ? "bg-dark-brown rounded-full px-4 py-1 text-white"
              : ""
          }`}
        >
          ยกเลิก
        </button>
      </div>

      <div className="space-y-4 mb-10">
        {appointments
          .filter((item) =>
            status === "cancel"
              ? item.cancelled
              : !item.cancelled &&
                (status === "completed" ? item.isCompleted : !item.isCompleted)
          )
          .map((item, index) => (
            <div
              key={`${item._id}-${index}`} // ใช้ key ที่ไม่ซ้ำกัน
              className="bg-white border-2 border-[#E6E6E6] rounded-lg p-4 md:p-6 flex flex-col md:flex-col gap-4 md:gap-6 relative animate-fadeIn"
            >
              {/* สถานะ, เหตุผล */}
              <div className="flex flex-row gap-4 md:justify-start justify-end">
                <div
                  className={`px-4 rounded-full font-medium w-fit ${
                    status === "scheduled"
                      ? "text-primary bg-primary bg-opacity-10 border border-primary"
                      : status === "cancel"
                      ? "text-[#C5211D] bg-[#C5211D] bg-opacity-10 border border-[#C5211D]"
                      : "text-[#008529] bg-[#008529] bg-opacity-10 border border-[#008529]"
                  }`}
                >
                  {status === "scheduled"
                    ? "รอปรึกษา"
                    : status === "cancel"
                    ? item.cancelReason
                      ? "ยกเลิกโดยทนาย"
                      : "ยกเลิกโดยลูกค้า"
                    : "ปรึกษาเสร็จสิ้น"}
                </div>

                {/* เพิ่มส่วนแสดงเหตุผลการยกเลิก */}
                {/* {status === "cancel" && item.cancelReason && (
                  <div className="text-base font-medium text-[#757575]">
                    ขออภัยเนื่องจากทนาย {item.cancelReason} กรุณานัดหมายใหม่
                  </div>
                )} */}
              </div>

              {/* รูป, ข้อมูล */}
              <div className="flex md:flex-row flex-col md:gap-10 gap-2">
                <div className="bg-brown-lawyerpic rounded-full w-20 lg:w-32 h-20 lg:h-32 mx-0 lg:mx-0">
                  <img
                    src={item.lawyerData.image}
                    alt=""
                    className="w-full h-full rounded-full object-cover bg-gray-200"
                  />
                </div>

                <div>
                  <div className="flex flex-col gap-2 lg:flex-row lg:gap-2 items-start lg:items-center mb-2">
                    <p className="text-lg font-medium text-dark-brown">
                      ทนาย {item.lawyerData.firstName}{" "}
                      {item.lawyerData.lastName}
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
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:ml-20 md:mt-0 mt-4">
                  <p className="text-base md:text-lg font-medium text-dark-brown">
                    รายละเอียด
                  </p>
                  <p className="text-sm md:text-base font-legular text-dark-brown">
                    หัวข้อที่ต้องการปรึกษา{" "}
                    <span className="font-medium">{item.user_topic}</span>
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

              <div>
                <hr className="text-[#E6E6E6] mt-4"></hr>
              </div>

              <div className="flex md:flex-row flex-col justify-between md:gap-0 gap-4">
                {/* เพิ่มส่วนแสดงเหตุผลการยกเลิก */}
                {status === "cancel" && item.cancelReason ? (
                  <div className="text-base font-medium text-[#757575] flex-grow">
                    ขออภัยเนื่องจากทนาย {item.cancelReason} กรุณานัดหมายใหม่
                  </div>
                ) : (
                  <div className="flex-grow"></div>
                )}

                <div className="flex gap-2 mt-auto justify-end">
                  {status === "scheduled" && (
                    <button
                      onClick={() => handleCancelClick(item._id)}
                      className="h-10 px-4 py-2 bg-[#A17F6B] text-white text-sm rounded hover:bg-[#8B6B59] transition w-40"
                    >
                      ยกเลิกการนัดหมาย
                    </button>
                  )}

                  {status === "cancel" && (
                    <button
                      onClick={() =>
                        navigate(`/appointment/${item.lawyerData._id}`)
                      }
                      className="h-10 px-4 py-2 bg-[#A17F6B] text-white text-sm rounded hover:bg-[#8B6B59] transition w-40"
                    >
                      นัดหมายเวลาใหม่
                    </button>
                  )}
                  {status !== "cancel" && status !== "scheduled" && (
                    <button
                      className={`h-10 px-4 py-2 text-white text-sm rounded w-48 ${
                        status === "scheduled" || item.isReviewed
                          ? "bg-[#DADADA] cursor-not-allowed"
                          : "bg-[#A17F6B] hover:bg-[#8B6B59] transition"
                      }`}
                      onClick={
                        status === "scheduled" || item.isReviewed
                          ? null
                          : () => openPopup(item)
                      }
                      disabled={status === "scheduled" || item.isReviewed}
                    >
                      {item.isReviewed
                        ? "แสดงความคิดเห็นแล้ว"
                        : "แสดงความคิดเห็น"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* เพิ่ม Modal PDF ตรงนี้ */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg lg:w-[800px] w-[380px] h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-8">
              <h2 className="text-xl font-medium text-dark-brown">
                เอกสารเบื้องต้น
              </h2>
              <img
                onClick={() => setShowPdfModal(false)}
                src={assets.Close_2}
                alt="ปิด"
                className="w-7 h-7 cursor-pointer"
              />
            </div>

            <div className="mb-6">
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

      {/* Pop Up สำหรับยืนยันยกเลิกการนัดหมาย */}
      {showCancelPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg lg:w-[500px] w-[380px] animate-popupCenter">
            <div className="flex flex-col items-center gap-4">
              <img
                src={assets.Caution_Icon}
                alt="Caution Icon"
                className="w-10 h-10 cursor-pointer"
              />
              <p className="text-dark-brown font-medium">
                ยืนยัน{" "}
                <span className="text-[#C5211D] text-xl">ยกเลิก</span>{" "}
                การนัดหมายนี้
              </p>
            </div>

            <div className="flex flex-row justify-center mt-8 gap-2">
              <button
                onClick={handleClosePopup}
                className="px-8 py-1 border border-primary text-primary rounded-full hover:bg-primary hover:text-white"
              >
                ปิด
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-6 py-1 bg-primary text-white rounded-full hover:bg-[#927663]"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop Up สำหรับแสดงความคิดเห็นการนัดหมาย */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white pl-4 pr-4 pb-4 rounded-lg lg:max-w-[600px] lg:w-full w-[380px] h-auto md:h-auto overflow-y-auto animate-popupCenter">
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
                      ทนาย {selectedAppointment.lawyerData.firstName}{" "}
                      {selectedAppointment.lawyerData.lastName}
                    </p>
                    <div className="flex gap-2 items-center mt-1 lg:mt-0">
                      <div className="flex flex-col lg:flex-row gap-1">
                        <p className="text-sm text-gray-600 whitespace-nowrap">
                          ความเชี่ยวชาญ
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {selectedAppointment.lawyerData.speciality.map(
                            (spec, idx) => (
                              <span
                                key={idx}
                                className="bg-gradient-to-r from-primary to-dark-brown text-white px-2 py-0.5 rounded-full text-xs"
                              >
                                {spec}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row lg:flex-col gap-2 lg:gap-1 mt-1 lg:mt-0">
                    <p className="text-sm text-dark-brown font-medium">
                      ค่าบริการ
                    </p>
                    <p className="text-primary text-sm">
                      ขั้นต่ำ {selectedAppointment.lawyerData.fees_detail} บาท
                      ต่อ 30 นาที
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
