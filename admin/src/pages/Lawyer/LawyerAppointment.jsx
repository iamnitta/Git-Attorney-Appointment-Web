import React, { useContext, useEffect, useState } from "react";
import { LawyerContext } from "../../context/LawyerContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const LawyerAppointment = () => {
  const {
    lawyerToken,
    appointments,
    getAppointments,
    completeAppointment,
    updateAppointmentFees,
  } = useContext(LawyerContext);

  const { slotDateFormat, slotTimeFormat } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [fees, setFees] = useState(0);
  const [sortStatus, setSortStatus] = useState("all"); // 'all', 'pending', 'completed'
  

  // จัดการ popup
  const handleOpenPopup = (appointment) => {
    setSelectedAppointment(appointment);
    setFees(Number(appointment.lawyerData.fees_detail));
    setShowPopup(true);
  };

  // ฟังก์ชันสำหรับคำนวนจำนวนต่างๆ
  const getAppointmentStats = () => {
    const allAppointments = appointments.filter((item) => !item.cancelled);
    const completed = allAppointments.filter((item) => item.isCompleted).length;
    const pending = allAppointments.filter((item) => !item.isCompleted).length;
    const totalFees = allAppointments
      .filter((item) => item.isCompleted)
      .reduce((sum, item) => sum + (Number(item.fees) || 0), 0);

    return {
      total: allAppointments.length,
      completed,
      pending,
      totalFees,
    };
  };

  // ฟังก์ชันสำหรับ filter appointments ตาม status
  const getFilteredAppointments = () => {
    const nonCancelledAppointments = appointments.filter(
      (item) => !item.cancelled
    );

    switch (sortStatus) {
      case "pending":
        return nonCancelledAppointments.filter((item) => !item.isCompleted);
      case "completed":
        return nonCancelledAppointments.filter((item) => item.isCompleted);
      default:
        return nonCancelledAppointments;
    }
  };

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

      <div className="flex items-center">
        <p className="text-xl text-gray-600 mr-4">ทั้งหมด</p>
        <p className="text-xl font-medium text-dark-brown">
          {getAppointmentStats().total}
        </p>
      </div>

      <div className="bg-[#F7F7F7] w-full max-w-9xl min-h-[200px] mt-2 mx-auto p-6 mb-10 rounded ">
        <div className="flex flex-col gap-4 mb-6">
          {/* ก้อนแรก */}
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-6">
              <div className="bg-white px-6 py-3 rounded-lg flex items-center justify-between gap-3">
                <p className="text-xl text-gray-600 ">รอปรึกษา</p>
                <p className="text-xl font-medium text-dark-brown">
                  {getAppointmentStats().pending}
                </p>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg flex items-center justify-between gap-3">
                <p className="text-xl text-gray-600">ปรึกษาเสร็จสิ้น</p>
                <p className="text-xl font-medium text-dark-brown">
                  {getAppointmentStats().completed}
                </p>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg flex items-center justify-between gap-3">
                <p className="text-xl text-gray-600">ค่าบริการที่ได้รับ</p>
                <p className="text-xl font-medium text-dark-brown">
                  {getAppointmentStats().totalFees} บาท
                </p>
              </div>
            </div>

            {/* ก้อนที่สอง */}
            <div className="flex gap-2">
              <button
                onClick={() => setSortStatus("all")}
                className={`px-4 py-2 rounded-lg ${
                  sortStatus === "all"
                    ? "bg-dark-brown text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setSortStatus("pending")}
                className={`px-4 py-2 rounded-lg ${
                  sortStatus === "pending"
                    ? "bg-dark-brown text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                รอปรึกษา
              </button>
              <button
                onClick={() => setSortStatus("completed")}
                className={`px-4 py-2 rounded-lg ${
                  sortStatus === "completed"
                    ? "bg-dark-brown text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                ปรึกษาเสร็จสิ้น
              </button>
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
                <th className="p-4 font-medium text-left">อีเมล</th>
                <th className="p-4 font-medium text-left">เบอร์โทร</th>
                <th className="p-4 font-medium text-left">วันที่นัดหมาย</th>
                <th className="p-4 font-medium text-left">เวลาที่นัดหมาย</th>
                <th className="p-4 font-medium text-left">ค่าบริการ</th>
                <th className="p-4 font-medium text-left">สถานะ</th>
                <th className="p-4 font-medium text-left">รายละเอียด</th>
                <th className="p-4 font-medium text-left"></th>
              </tr>
            </thead>
            <tbody>
              {[...getFilteredAppointments()]
                .filter((item) => !item.cancelled)
                .reverse()
                .map((item, index) => (
                  <tr key={index} className="border-b border-[#D4C7BD]">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{item.userData.firstName}</td>
                    <td className="p-4">{item.userData.lastName}</td>
                    <td className="p-4">{item.userData.email}</td>
                    <td className="p-4">{item.userData.phone}</td>
                    <td className="p-4">{slotDateFormat(item.slotDate)}</td>
                    <td className="p-4">{slotTimeFormat(item.slotTime)}</td>
                    <td className="p-4">{item.fees}</td>
                    <td className="p-4 text-left">
                      <span
                        className={` ${
                          item.isCompleted
                            ? " text-green-800"
                            : " text-yellow-800"
                        }`}
                      >
                        {item.isCompleted ? "ปรึกษาเสร็จสิ้น" : "รอปรึกษา"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="underline text-primary hover:text-dark-brown">
                        คลิก
                      </button>
                    </td>
                    <td className="p-4">
                      {!item.isCompleted ? (
                        <button
                          onClick={() => completeAppointment(item._id)}
                          className="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-900"
                        >
                          เสร็จสิ้น
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenPopup(item)}
                          className="bg-dark-brown text-white px-4 py-2 rounded-full hover:bg-[#2C1810]"
                        >
                          ใส่ค่าบริการ
                        </button>
                      )}
                    </td>
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
                      <p className="font-medium mb-1">
                        {selectedAppointment.userData.firstName}{" "}
                        {selectedAppointment.userData.lastName}
                      </p>
                      <p className="text-gray-600">
                        {selectedAppointment.userData.email}
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
                      <p className="font-medium mb-1">
                        ทนาย {selectedAppointment.lawyerData.firstName}{" "}
                        {selectedAppointment.lawyerData.lastName}
                      </p>
                      <div className="flex items-center ">
                        <p className="text-gray-600">ค่าบริการขั้นต่ำ</p>
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
      </div>
    </div>
  );
};

export default LawyerAppointment;
