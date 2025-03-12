import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import Select from "react-select";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments } = useContext(AdminContext);
  const { slotDateFormat, slotTimeFormat } = useContext(AppContext);
  const [sortStatus, setSortStatus] = useState("pending");
  const [selectedLawyer, setSelectedLawyer] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [statusCount, setStatusCount] = useState({}); // เก็บจำนวนสถานะของทนายความแต่ละคน
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredStatusCount, setFilteredStatusCount] = useState({}); // เก็บจำนวนสถานะของนัดหมายที่กรองแล้ว
  const rowsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  // ฟังก์ชันสำหรับการกรองนัดหมายตามทนายความที่เลือก และช่วงวันที่
  const getFilteredAppointments = () => {
    const filteredByLawyer = selectedLawyer
      ? appointments.filter(
          (item) =>
            `${item.lawyerData.firstName} ${item.lawyerData.lastName}` ===
            selectedLawyer
        )
      : appointments;

    const filteredByDate = filteredByLawyer.filter((item) => {
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

  // ฟังก์ชันสำหรับการกรองนัดหมายตามสถานะที่เลือก
  const getAppointmentsByStatus = (appointments) => {
    return sortStatus === "all"
      ? appointments
      : appointments.filter((item) => {
          if (sortStatus === "pending") {
            return !item.isCompleted && !item.cancelled;
          } else if (sortStatus === "completed") {
            return item.isCompleted && !item.cancelled;
          } else if (sortStatus === "cancelled") {
            return item.cancelled;
          }
          return true;
        });
  };

  // ฟังก์ชันสำหรับการคำนวณสถานะของนัดหมายที่กรองแล้ว
  const calculateFilteredStatusCount = (appointments) => {
    const completed = appointments.filter((item) => item.isCompleted).length;
    const pending = appointments.filter(
      (item) => !item.isCompleted && !item.cancelled
    ).length;
    const cancelled = appointments.filter((item) => item.cancelled).length;

    return {
      total: appointments.length,
      completed,
      pending,
      cancelled,
    };
  };

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  useEffect(() => {
    if (appointments.length > 0) {
      const filteredLawyers = appointments
        .filter((item) => item.lawyerData)
        .map((item) => ({
          name: `${item.lawyerData.firstName} ${item.lawyerData.lastName}`,
          id: item.lawyerData.id,
          status: item.isCompleted ? "completed" : "pending", // กำหนดสถานะ
        }));

      const uniqueLawyers = [
        ...new Set(filteredLawyers.map((lawyer) => lawyer.name)),
      ].map((name) => filteredLawyers.find((lawyer) => lawyer.name === name));

      setLawyers(uniqueLawyers);

      // เก็บจำนวนสถานะของทนายความแต่ละคน
      const lawyerStatusCount = uniqueLawyers.reduce((acc, lawyer) => {
        const allAppointments = appointments.filter(
          (item) =>
            item.lawyerData &&
            `${item.lawyerData.firstName} ${item.lawyerData.lastName}` ===
              lawyer.name
        );
        const completedCount = allAppointments.filter(
          (item) => item.isCompleted
        ).length;
        const pendingCount = allAppointments.filter(
          (item) => !item.isCompleted
        ).length;

        acc[lawyer.name] = {
          total: allAppointments.length,
          completed: completedCount,
          pending: pendingCount,
        };
        return acc;
      }, {});

      setStatusCount(lawyerStatusCount);
    }
  }, [appointments]);

  // คำนวณสถานะของนัดหมายที่กรองแล้วเมื่อมีการเปลี่ยนแปลงการกรอง
  useEffect(() => {
    const filteredAppointments = getFilteredAppointments();
    const statusCount = calculateFilteredStatusCount(filteredAppointments);
    setFilteredStatusCount(statusCount);
  }, [appointments, selectedLawyer, startDate, endDate]);

  const filteredAppointments = getAppointmentsByStatus(
    getFilteredAppointments()
  );

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);

  // กรองข้อมูลที่จะแสดงในตารางตามหน้าและจำนวนแถวที่กำหนด
  const currentAppointments = filteredAppointments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const lawyerOptions = [
    { value: "", label: "ทนายความทั้งหมด" }, // ตัวเลือก "ทั้งหมด"
    ...lawyers.map((lawyer) => ({
      value: lawyer.name,
      label: lawyer.name,
    })),
  ];

  // ฟังก์ชันสำหรับการเปลี่ยนสถานะการกรอง
  const handleSortStatusChange = (status) => {
    setSortStatus(status);
    setCurrentPage(1); // รีเซ็ตหน้าปัจจุบันเป็นหน้าแรก
  };

  // ฟังก์ชันสำหรับการเปลี่ยนทนายความที่เลือก
  const handleLawyerChange = (selectedOption) => {
    setSelectedLawyer(selectedOption ? selectedOption.value : "");
    setCurrentPage(1); // รีเซ็ตหน้าปัจจุบันเป็นหน้าแรก
  };

  // ฟังก์ชันสำหรับการเปลี่ยนวันที่เริ่มต้น
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setCurrentPage(1); // รีเซ็ตหน้าปัจจุบันเป็นหน้าแรก
  };

  // ฟังก์ชันสำหรับการเปลี่ยนวันที่สิ้นสุด
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setCurrentPage(1); // รีเซ็ตหน้าปัจจุบันเป็นหน้าแรก
  };

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

  return (
    <div className="p-8 w-full animate-fadeIn">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          การนัดหมายทั้งหมด
        </h1>
      </div>

      <div>
        <div className="flex flex-row gap-2 justify-between mb-4 mt-4">
          {/* กรองตามสถานะ */}
          <div>
            <p className="text-dark-brown mb-1">จำนวนตามสถานะ</p>
            <div className="flex gap-1">
              <button
                onClick={() => handleSortStatusChange("pending")}
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
                  {filteredStatusCount.pending}
                </span>
              </button>
              <button
                onClick={() => handleSortStatusChange("completed")}
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
                  {filteredStatusCount.completed}
                </span>
              </button>
              <button
                onClick={() => handleSortStatusChange("cancelled")}
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
                  {filteredStatusCount.cancelled}
                </span>
              </button>
              <button
                onClick={() => handleSortStatusChange("all")}
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
                  {filteredStatusCount.total}
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-row gap-2">
            {/* กรองตามทนายความ */}
            <div>
              <p className="text-dark-brown mb-1">ทนายความ</p>
              <Select
                options={lawyerOptions}
                value={lawyerOptions.find(
                  (opt) => opt.value === selectedLawyer
                )}
                onChange={handleLawyerChange}
                placeholder="เลือกทนายความ"
                className="w-60"
              />
            </div>

            {/* กรองตามช่วงวันที่ */}
            <div className="flex flex-col">
              <p className="text-dark-brown mb-1">วันที่นัดหมาย</p>

              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="p-2 border border-[#DADADA] rounded"
                  placeholder="วันที่เริ่มต้น"
                />

                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
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
                <th className="p-3 font-medium text-left"></th>
                <th className="p-3 font-medium text-left"></th>
                <th className="p-3 font-medium text-left">ทนายความ</th>
                <th className="p-3 font-medium text-left">ลูกค้า</th>
                <th className="p-3 font-medium text-left">อีเมลลูกค้า</th>
                <th className="p-3 font-medium text-left">วันที่นัดหมาย</th>
                <th className="p-3 font-medium text-left">เวลาที่นัดหมาย</th>
                <th className="p-3 font-medium text-left">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((item, index) => (
                <tr
                  key={`${item.lawyerData.lawyer_id}-${index}`}
                  className="bg-[#FFFFFF] border-b border-[#DADADA] hover:bg-gray-100"
                >
                  <td className="p-3">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="p-3">
                    <img
                      src={item.lawyerData.image}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-3">
                    {item.lawyerData.firstName} {item.lawyerData.lastName}
                  </td>
                  <td className="p-3">
                    {item.userData.firstName} {item.userData.lastName}
                  </td>
                  <td className="p-3 text-left">{item.userData.email}</td>
                  <td className="p-3 text-left">
                    {slotDateFormat(item.slotDate)}
                  </td>
                  <td className="p-3 text-left">
                    {slotTimeFormat(item.slotTime)} น.
                  </td>
                  <td className="p-3 text-left text-nowrap">
                    <span
                      className={`${
                        item.isCompleted
                          ? "text-green-800"
                          : item.cancelled
                          ? "text-red-800"
                          : "text-yellow-800"
                      }`}
                    >
                      {item.isCompleted
                        ? "ปรึกษาเสร็จสิ้น"
                        : item.cancelled
                        ? item.cancelReason
                          ? "ยกเลิกโดยทนาย"
                          : "ยกเลิกโดยลูกค้า"
                        : "รอปรึกษา"}
                    </span>
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
      </div>

      {/* Pagination */}
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
  );
};

export default AllAppointments;
