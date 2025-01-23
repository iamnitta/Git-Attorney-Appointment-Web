import React, { useState, useEffect } from "react";
import { appointments, lawyers } from "../../assets/assets"; // ดึงข้อมูล appointments, lawyers จากไฟล์ assets.js
import { assets } from "../../assets/assets";

const Finance = () => {
  // คำนวณผลรวมของ fees ทั้งหมด
  const totalFees = appointments.reduce(
    (sum, appointment) => sum + appointment.fees,
    0
  );

  // นับจำนวนการนัดหมายทั้งหมด
  const totalAppointments = appointments.length;

  // นับจำนวนลูกค้าทั้งหมดโดยใช้ Set เพื่อเก็บ user_id ที่ไม่ซ้ำกัน
  const uniqueClients = new Set(
    appointments.map((appointment) => appointment.user_id)
  );
  const totalClients = uniqueClients.size;

  // จัดกลุ่มข้อมูลตาม lawyer_id
  const groupedData = appointments.reduce((acc, appointment) => {
    if (!acc[appointment.lawyer_id]) {
      acc[appointment.lawyer_id] = {
        lawyer_id: appointment.lawyer_id,
        totalFees: 0,
        uniqueClients: new Set(),
        totalAppointments: 0,
      };
    }
    acc[appointment.lawyer_id].totalFees += appointment.fees;
    acc[appointment.lawyer_id].uniqueClients.add(appointment.user_id);
    acc[appointment.lawyer_id].totalAppointments += 1;
    return acc;
  }, {});

  const groupedAppointments = Object.values(groupedData);

  // แมพ lawyer_id กับชื่อทนายความ
  const lawyerMap = lawyers.reduce((acc, lawyer) => {
    acc[lawyer._id] = { name: lawyer.name, image: lawyer.image };
    return acc;
  }, {});

  // การจัดตารางข้อมูล
  const rowsPerPage = 6; // จำนวนแถวที่ต้องการแสดงในแต่ละหน้า
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน (เริ่มต้นที่ 1)
  const totalPages = Math.ceil(groupedAppointments.length / rowsPerPage); // จำนวนหน้าทั้งหมด

  // คำนวณช่วงของข้อมูลที่จะนำมาแสดงในแต่ละหน้า
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = groupedAppointments.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handlePageChange = (pageNumber) => {
    // ถ้าเปลี่ยนหน้าไปเกินจำนวนหน้า ให้รีเซ็ตเป็นหน้าสุดท้ายที่มี
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

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="p-8 w-full">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          ข้อมูลการเงิน
        </h1>
      </div>

      <div className="bg-[#F7F7F7] w-full max-w-7xl min-h-[200px] mt-2 mx-auto p-6 mb-6 rounded">
        <div className="flex flex-row justify-between mt-3 mb-3">
          <div className="bg-white w-80 h-auto rounded-lg p-4 flex justify-center items-center">
            <div className="flex flex-row">
              <img
                src={assets.Income}
                alt=""
                className="w-20 h-20 object-cover mr-4"
              />
              <div className="mr-2">
                <p className="text-dark-brown text-2xl fond-bold text-left mt-3">
                  {totalFees.toLocaleString()}
                </p>
                <p className="text-dark-brown text-lg text-left mt-1">
                  รายรับทั้งหมด (บาท)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white w-80 h-auto rounded-lg p-4 flex justify-center items-center">
            <div className="flex flex-row">
              <img
                src={assets.Customer}
                alt=""
                className="w-20 h-20 object-cover mr-4"
              />
              <div className="mr-2">
                <p className="text-dark-brown text-2xl fond-bold text-left mt-3">
                  {totalClients}
                </p>
                <p className="text-dark-brown text-lg text-left mt-1">
                  ลูกค้าทั้งหมด (ราย)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white w-80 h-auto rounded-lg p-4 flex justify-center items-center">
            <div className="flex flex-row">
              <img
                src={assets.Appointment}
                alt=""
                className="w-20 h-20 object-cover mr-4"
              />
              <div className="mr-2">
                <p className="text-dark-brown text-2xl fond-bold text-left mt-3">
                  {totalAppointments}
                </p>
                <p className="text-dark-brown text-lg text-left mt-1">
                  นัดหมายทั้งหมด (ครั้ง)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F7F7F7] w-full max-w-7xl min-h-[200px] mt-2 mx-auto p-6 mb-10 rounded">
        <div className="flex items-center w-full flex-row">
          <p className="rounded text-dark-brown text-lg font-regular mb-2 mr-4">
            ตารางข้อมูลแยกตามทนายความ
          </p>
          <p className="rounded-full text-base font-regular mb-2 bg-[#D4C7BD] text-dark-brown px-2">
            รายการ ({groupedAppointments.length})
          </p>
        </div>
        <div className="bg-[#FFFFFF] rounded overflow-hidden mt-2">
          <table className="w-full border-collapse">
            <thead className="bg-[#D4C7BD]">
              <tr>
                <th className="p-4 font-medium text-left"></th>
                <th className="p-4 font-medium text-left"></th>
                {/* รูปทนายความ */}
                <th className="p-4 font-medium text-left">ทนายความ</th>
                <th className="p-4 font-medium text-center">รายรับ</th>
                <th className="p-4 font-medium text-center">ลูกค้า</th>
                <th className="p-4 font-medium text-center">การนัดหมาย</th>
              </tr>
            </thead>
            <tbody>
              {groupedAppointments.map((item, index) => (
                <tr
                  key={`${item.lawyer_id}-${index}`}
                  className="bg-[#FFFFFF] border-b border-[#DADADA] hover:bg-gray-100"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    <img
                      src={lawyerMap[item.lawyer_id]?.image}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  {/* รูปทนายความ */}
                  <td className="p-4">{lawyerMap[item.lawyer_id]?.name}</td>
                  <td className="p-4 text-center">
                    {item.totalFees.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">{item.uniqueClients.size}</td>
                  <td className="p-4 text-center">{item.totalAppointments}</td>
                </tr>
              ))}
              {/* เติมแถวเปล่าให้ครบ 6 แถว */}
              {Array.from({ length: rowsPerPage - currentData.length }).map(
                (_, index) => (
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
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-1 rounded ${
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
            className={`px-4 py-2 mx-1 rounded ${
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

export default Finance;
