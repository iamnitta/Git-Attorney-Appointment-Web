import React, { useContext, useEffect, useState } from "react";
import { LawyerContext } from "../../context/LawyerContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// ตั้งค่า worker โดยใช้ CDN ที่ถูกต้อง
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const LawyerAppointment = () => {
  const {
    lawyerToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    updateAppointmentFees,
  } = useContext(LawyerContext);

  const { slotDateFormat, slotTimeFormat } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [fees, setFees] = useState(0);
  const [sortStatus, setSortStatus] = useState("pending"); // 'all', 'pending', 'completed'
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const rowsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  // จัดการ popup
  const handleOpenPopup = (appointment) => {
    setSelectedAppointment(appointment);
    setFees(Number(appointment.lawyerData.fees_detail));
    setShowPopup(true);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // ฟังก์ชันสำหรับคำนวนจำนวนต่างๆ
  const getAppointmentStatus = () => {
    const filteredByDate = appointments.filter((item) => {
      const [day, month, year] = item.slotDate.split("_").map(Number);
      const appointmentDate = new Date(year, month - 1, day);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start) {
        start.setHours(0, 0, 0, 0); // ตั้งค่าเวลาเป็น 00:00:00
      }
      if (end) {
        end.setHours(23, 59, 59, 999); // ตั้งค่าเวลาเป็น 23:59:59
      }

      if (start && end) {
        return appointmentDate >= start && appointmentDate <= end;
      } else if (start) {
        return appointmentDate >= start;
      } else if (end) {
        return appointmentDate <= end;
      } else {
        return true;
      }
    });

    const completed = filteredByDate.filter((item) => item.isCompleted).length;
    const pending = filteredByDate.filter(
      (item) => !item.isCompleted && !item.cancelled
    ).length;
    const cancelled = filteredByDate.filter((item) => item.cancelled).length;
    const totalFees = filteredByDate
      .filter((item) => item.isCompleted)
      .reduce((sum, item) => sum + (Number(item.fees) || 0), 0);

    return {
      total: filteredByDate.length,
      completed,
      pending,
      cancelled,
      totalFees,
    };
  };

  // // ฟังก์ชันสำหรับ filter appointments ตาม status
  // const getFilteredAppointments = () => {
  //   const nonCancelledAppointments = appointments.filter(
  //     (item) => !item.cancelled
  //   );

  //   switch (sortStatus) {
  //     case "pending":
  //       return nonCancelledAppointments.filter((item) => !item.isCompleted);
  //     case "completed":
  //       return nonCancelledAppointments.filter((item) => item.isCompleted);
  //     default:
  //       return nonCancelledAppointments;
  //   }
  // };

  const getFilteredAppointments = () => {
    const filteredByStatus = appointments.filter((item) => {
      switch (sortStatus) {
        case "pending":
          return !item.isCompleted && !item.cancelled;
        case "completed":
          return item.isCompleted && !item.cancelled;
        case "cancelled":
          return item.cancelled;
        default:
          return true;
      }
    });

    const filteredByDate = filteredByStatus.filter((item) => {
      const [day, month, year] = item.slotDate.split("_").map(Number);
      const appointmentDate = new Date(year, month - 1, day);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start) {
        start.setHours(0, 0, 0, 0); // ตั้งค่าเวลาเป็น 00:00:00
      }
      if (end) {
        end.setHours(23, 59, 59, 999); // ตั้งค่าเวลาเป็น 23:59:59
      }

      if (start && end) {
        return appointmentDate >= start && appointmentDate <= end;
      } else if (start) {
        return appointmentDate >= start;
      } else if (end) {
        return appointmentDate <= end;
      } else {
        return true;
      }
    });

    return filteredByDate.reverse();
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      setCurrentPage(1);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            i === currentPage
              ? "bg-[#D4C7BD] text-dark-brown"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const formatPhoneNumber = (phone) => {
    const value = phone.replace(/\D/g, ""); // กรองให้เหลือแค่ตัวเลข
    const formattedValue = value
      .replace(/^(\d{3})(?=\d)/, "$1-") // จับ 3 ตัวแรก
      .replace(/^(\d{3}-\d{3})(?=\d)/, "$1-"); // จับ 3 ตัวถัดไป
    return formattedValue;
  };

  const filteredAppointments = getFilteredAppointments();

  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
  const currentAppointments = filteredAppointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    if (lawyerToken) {
      getAppointments();
    }
  }, [lawyerToken]);

  return (
    <div className="p-8 w-full">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          การนัดหมายทั้งหมด
        </h1>
      </div>

      <div>
        <div className="flex flex-col gap-4 mb-6">
          {/* กรองตามสถานะ */}
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-row gap-4">
              <div>
                <p className="text-dark-brown mb-1">จำนวนตามสถานะ</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortStatus("pending")}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      sortStatus === "pending"
                        ? "bg-dark-brown text-white"
                        : "bg-[#DADADA]"
                    }`}
                  >
                    รอปรึกษา
                    <span
                      className={`ml-2 rounded-full px-2 text-sm ${
                        sortStatus === "pending"
                          ? "bg-white text-dark-brown"
                          : "bg-[#9B9B9B] text-[#DADADA]"
                      }`}
                    >
                      {getAppointmentStatus().pending}
                    </span>
                  </button>
                  <button
                    onClick={() => setSortStatus("completed")}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      sortStatus === "completed"
                        ? "bg-[#397D54] text-white"
                        : "bg-[#DADADA]"
                    }`}
                  >
                    ปรึกษาเสร็จสิ้น
                    <span
                      className={`ml-2 rounded-full px-2 text-sm ${
                        sortStatus === "completed"
                          ? "bg-white text-[#397D54]"
                          : "bg-[#9B9B9B] text-[#DADADA]"
                      }`}
                    >
                      {getAppointmentStatus().completed}
                    </span>
                  </button>
                  <button
                    onClick={() => setSortStatus("cancelled")}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      sortStatus === "cancelled"
                        ? "bg-[#C5211D] text-white"
                        : "bg-[#DADADA]"
                    }`}
                  >
                    ยกเลิก
                    <span
                      className={`ml-2 rounded-full px-2 text-sm ${
                        sortStatus === "cancelled"
                          ? "bg-white text-[#C5211D]"
                          : "bg-[#9B9B9B] text-[#DADADA]"
                      }`}
                    >
                      {getAppointmentStatus().cancelled}
                    </span>
                  </button>
                  <button
                    onClick={() => setSortStatus("all")}
                    className={`px-4 py-2 rounded-lg ${
                      sortStatus === "all"
                        ? "bg-dark-brown text-white"
                        : "bg-[#DADADA]"
                    }`}
                  >
                    ทั้งหมด{" "}
                    <span
                      className={`ml-2 rounded-full px-2 text-sm ${
                        sortStatus === "all"
                          ? "bg-white text-dark-brown"
                          : "bg-[#9B9B9B] text-[#DADADA]"
                      }`}
                    >
                      {getAppointmentStatus().total}
                    </span>
                  </button>
                </div>
              </div>

              {/* ค่าบริการที่ได้รับ */}
              <div>
                <p className="text-dark-brown mb-1">ค่าบริการที่ได้รับ</p>
                <div className="w-52">
                  <p className="px-4 py-2 rounded-lg flex items-center bg-white text-dark-brown">
                    {getAppointmentStatus().totalFees.toLocaleString()} บาท
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-dark-brown mb-1">วันที่นัดหมาย</p>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1); // รีเซ็ตหน้าปัจจุบันเป็นหน้าแรก
                  }}
                  className="p-2 border border-[#DADADA] rounded"
                  placeholder="วันที่เริ่มต้น"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1); // รีเซ็ตหน้าปัจจุบันเป็นหน้าแรก
                  }}
                  className="p-2 border border-[#DADADA] rounded"
                  placeholder="วันที่สิ้นสุด"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded overflow-hidden mt-2">
          <table className="w-full border-collapse">
            <thead className="bg-[#D4C7BD]">
              <tr>
                <th className="p-4 font-medium text-left"></th>
                <th className="p-4 font-medium text-left">ชื่อ</th>
                <th className="p-4 font-medium text-left">นามสกุล</th>
                <th className="p-4 font-medium text-left">วันที่นัดหมาย</th>
                <th className="p-4 font-medium text-left">เวลาที่นัดหมาย</th>
                <th className="p-4 font-medium text-left">ค่าบริการ</th>
                <th className="p-4 font-medium text-left">สถานะ</th>
                <th className="p-4 font-medium text-left">รายละเอียด</th>
                <th className="p-4 font-medium text-left"></th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((item, index) => (
                <tr key={index} className="border-b border-[#D4C7BD]">
                  <td className="p-4">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="p-4">{item.userData.firstName}</td>
                  <td className="p-4">{item.userData.lastName}</td>
                  <td className="p-4">{slotDateFormat(item.slotDate)}</td>
                  <td className="p-4">{slotTimeFormat(item.slotTime)}</td>
                  <td className="p-4">{item.fees}</td>
                  <td className="p-4 text-left">
                    <span
                      className={` ${
                        item.isCompleted
                          ? " text-green-800"
                          : item.cancelled
                          ? " text-red-800"
                          : " text-yellow-800"
                      }`}
                    >
                      {item.isCompleted
                        ? "ปรึกษาเสร็จสิ้น"
                        : item.cancelled
                        ? "ยกเลิก"
                        : "รอปรึกษา"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => {
                        console.log("documentUrl:", item.documentUrl);
                        setSelectedAppointment(item);
                        setShowPdfModal(true);
                      }}
                      className="underline text-primary hover:text-dark-brown"
                    >
                      คลิก
                    </button>
                  </td>
                  <td className="p-4">
                    {!item.isCompleted && !item.cancelled ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="border border-[#C5211D] text-[#C5211D] px-4 py-1 rounded-full hover:bg-[#C5211D] hover:text-white"
                        >
                          ยกเลิก
                        </button>
                        <button
                          onClick={() => completeAppointment(item._id)}
                          className="bg-green-700 text-white px-4 py-1 rounded-full hover:bg-green-900"
                        >
                          เสร็จสิ้น
                        </button>
                      </div>
                    ) : (
                      !item.cancelled && (
                        <button
                          onClick={() => handleOpenPopup(item)}
                          className="bg-dark-brown text-white px-4 py-1 rounded-full hover:bg-[#2C1810]"
                        >
                          ใส่ค่าบริการ
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
              {/* เติมแถวเปล่าให้ครบ 6 แถว */}
              {Array.from({
                length: rowsPerPage - currentAppointments.length,
              }).map((_, index) => (
                <tr
                  key={`empty-${index}`}
                  className="bg-[#FFFFFF] border-b border-[#DADADA]"
                  style={{ height: "65px" }}
                >
                  <td className="p-3">&nbsp;</td>
                  <td className="p-3">&nbsp;</td>
                  <td className="p-3">&nbsp;</td>
                  <td className="p-3">&nbsp;</td>
                  <td className="p-3">&nbsp;</td>
                  <td className="p-3">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*  Popup */}
        {showPopup && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-[500px]">
              <div className="flex flex-row justify-between mb-4">
                <h2 className="text-2xl font-medium text-dark-brown">
                  บันทึกค่าบริการ
                </h2>
                <img
                  onClick={() => setShowPopup(false)}
                  src={assets.Close_2}
                  alt="ปิด PopUp"
                  className="w-7 h-7 cursor-pointer"
                />
              </div>

              {/*  สถานะการนัดหมาย วันเดือนปี เวลา */}

              <div className=" rounded-lg bg-light-brown p-6">
                <div className="mb-6 ">
                  <div className="flex items-center mb-3">
                    <p className="text-lg text-dark-brown font-medium">
                      การนัดหมาย
                    </p>
                    <span className="ml-2 px-3 py-1 bg-green-700 text-white rounded-full text-xs ">
                      ปรึกษาเสร็จสิ้น
                    </span>
                  </div>
                  <p className="text-gray-600 text-primary">
                    {slotDateFormat(selectedAppointment.slotDate)} |{" "}
                    {slotTimeFormat(selectedAppointment.slotTime)}
                  </p>
                </div>

                {/* ลูกค้า */}
                <div className="mb-6">
                  <p className="text-lg mb-2 text-dark-brown font-medium">
                    ลูกค้า
                  </p>
                  <div className="flex items-center">
                    <img
                      src={selectedAppointment.userData.image}
                      alt="Profile"
                      className="w-16 h-16 rounded-full mr-5 object-cover"
                    />
                    <div>
                      <p className="font-medium mb-1 text-dark-brown">
                        {selectedAppointment.userData.firstName}{" "}
                        {selectedAppointment.userData.lastName}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {selectedAppointment.userData.email} |{" "}
                        {formatPhoneNumber(selectedAppointment.userData.phone)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ทนาย */}
                <div className="mb-6">
                  <p className="text-lg mb-2 text-dark-brown font-medium">
                    ทนายความ
                  </p>
                  <div className="flex items-center">
                    <img
                      src={selectedAppointment.lawyerData.image}
                      alt="Lawyer Profile"
                      className="w-16 h-16 rounded-full mr-5"
                    />
                    <div>
                      <p className="font-medium mb-1 text-dark-brown">
                        ทนาย {selectedAppointment.lawyerData.firstName}{" "}
                        {selectedAppointment.lawyerData.lastName}
                      </p>
                      <div className="flex items-center ">
                        <p className="text-gray-600 text-sm">
                          ค่าบริการขั้นต่ำ
                        </p>
                        <span className="ml-2 px-3 py-1 bg-gradient-to-r from-primary to-dark-brown text-white rounded-full text-xs">
                          {selectedAppointment.lawyerData.fees_detail} บาท/30
                          นาที
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ค่าบริการ */}
              <div className="mb-6 ">
                <div className="flex items-center mt-4 ">
                  <p className="text-lg mr-4">ค่าบริการ</p>
                  <input
                    type="number"
                    value={fees}
                    onChange={(e) => setFees(Number(e.target.value))}
                    className="w-32 p-2 rounded-lg text-left bg-[#F7F7F7] border border-[#E5E5E5]"
                  />
                  <p className="ml-4">บาท</p>
                </div>
              </div>

              {/* ปุ่ม confirm */}
              <button
                onClick={() => {
                  updateAppointmentFees(selectedAppointment._id, fees);
                  setShowPopup(false);
                  console.log(fees);
                }}
                className="px-4 bg-dark-brown text-white py-2 rounded-lg hover:bg-[#2C1810]  block"
              >
                บันทึกค่าบริการ
              </button>
            </div>
          </div>
        )}
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

        <div className="flex justify-end mt-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-1 rounded text-dark-brown ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {"<"}
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 mx-1 rounded text-dark-brown ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LawyerAppointment;
