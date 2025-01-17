import React from "react";
import { appointments, lawyers, users } from "../../assets/assets"; // ดึงข้อมูล appointments, lawyers จากไฟล์ assets.js

// map lawyer_id กับข้อมูลทนายความ
const lawyerMap = lawyers.reduce((acc, lawyer) => {
  acc[lawyer._id] = { name: lawyer.name, image: lawyer.image };
  return acc;
}, {});

// map user_id กับข้อมูลลูกค้า
const userMap = users.reduce((acc, user) => {
  acc[user._id] = { name: user.name, email: user.email, image: user.image };
  return acc;
}, {});

const AllApointments = () => {
  return (
    <div className="p-8 w-full">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          การนัดหมายทั้งหมด
        </h1>
      </div>

      <div className="bg-[#F7F7F7] w-full max-w-7xl min-h-[200px] mt-2 mx-auto p-6 mb-10 rounded">
        <div className="flex items-center w-full flex-row">
          <p className="rounded text-dark-brown text-lg font-regular mb-2 mr-4">
            การนัดหมายทั้งหมด ({appointments.length})
          </p>
        </div>
        <div className="bg-[#FFFFFF] rounded overflow-hidden mt-2">
          <table className="w-full border-collapse">
            <thead className="bg-[#D4C7BD]">
              <tr>
                <th className="p-4 font-medium text-left"></th>
                <th className="p-4 font-medium text-left"></th>
                <th className="p-4 font-medium text-left">ทนายความ</th>
                <th className="p-4 font-medium text-left">ลูกค้า</th>
                <th className="p-4 font-medium text-left">อีเมลลูกค้า</th>
                <th className="p-4 font-medium text-left">วันที่นัดหมาย</th>
                <th className="p-4 font-medium text-left">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr
                  key={appointment.lawyer_id}
                  className="bg-[#FFFFFF] border-b border-[#DADADA] hover:bg-gray-100"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    <img
                      src={lawyerMap[appointment.lawyer_id]?.image}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  {/* รูปทนายความ */}
                  <td className="p-4">
                    {lawyerMap[appointment.lawyer_id]?.name}
                  </td>
                  <td className="p-4">
                    {userMap[appointment.user_id]?.name}
                  </td>
                  <td className="p-4 text-left">{userMap[appointment.user_id]?.email}</td>
                  <td className="p-4 text-left">{appointment.slotDate}</td>
                  <td className="p-4 text-left">{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllApointments;
