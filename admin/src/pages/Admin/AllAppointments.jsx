import React, { useContext, useEffect } from "react";
import { appointments, lawyers, users } from "../../assets/assets"; // ดึงข้อมูล appointments, lawyers จากไฟล์ assets.js
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";


const AllApointments = () => {

  const {aToken, appointments, getAllAppointments} = useContext(AdminContext)
  const {slotDateFormat,slotTimeFormat} = useContext(AppContext)


  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  },[aToken])

  return (
    <div className="p-8 w-full">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          การนัดหมายทั้งหมด
        </h1>
      </div>

      <div className="bg-[#F7F7F7] w-full max-w-9xl min-h-[200px] mt-2 mx-auto p-6 mb-10 rounded">
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
                <th className="p-4 font-medium text-left"></th>
                <th className="p-4 font-medium text-left">ลูกค้า</th>
                <th className="p-4 font-medium text-left">อีเมลลูกค้า</th>
                <th className="p-4 font-medium text-left">วันที่นัดหมาย</th>
                <th className="p-4 font-medium text-left">เวลาที่นัดหมาย</th>
                <th className="p-4 font-medium text-left">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item, index) => (
                <tr
                  key={`${item.lawyer_id}-${index}`}
                  className="bg-[#FFFFFF] border-b border-[#DADADA] hover:bg-gray-100"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    <img
                      src={item.lawyerData.image}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  {/* รูปทนายความ */}
                  <td className="p-4">
                    {item.lawyerData.firstName} {item.lawyerData.lastName}
                  </td>

                  <td className="p-4">
                    <img
                      src={item.userData.image}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  
                  <td className="p-4">
                    {item.userData.firstName} {item.userData.lastName}
                  </td>
                  <td className="p-4 text-left">{item.userData.email}</td>
                  <td className="p-4 text-left">{slotDateFormat(item.slotDate)}</td>
                  <td className="p-4 text-left">{slotTimeFormat(item.slotTime)} น.</td>
                  <td className="p-4 text-left">
                    <span className={` ${
                      item.isCompleted 
                        ? " text-green-800" 
                        : " text-yellow-800"
                    }`}>
                      {item.isCompleted ? "ปรึกษาเสร็จสิ้น" : "รอปรึกษา"}
                    </span>
                  </td>

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
