import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const MyAppointments = () => {
  const { lawyers } = useContext(AppContext);
  const [status, setStatus] = useState("scheduled");

  return (
    <div className="bg-light-brown p-4 md:p-6">
      <p className="bg-primary text-white rounded-lg text-base md:text-lg font-medium mb-4 md:mb-6 px-4 md:px-6 py-2 w-fit">
        การนัดหมายของฉัน
      </p>

      <div className="flex items-center justify-start space-x-4 border-gray-300 pb-2 mb-4">
        <button
          onClick={() => setStatus("scheduled")}
          className={`text-dark-brown font-medium ${
            status === "scheduled" ? "border-b-2 border-[#A17F6B]" : ""
          }`}
        >
          นัดหมายแล้ว
        </button>
        <button
          onClick={() => setStatus("completed")}
          className={`text-dark-brown font-medium ${
            status === "completed"
              ? "border-b-2 border-[#A17F6B] text-brown"
              : ""
          }`}
        >
          เสร็จสิ้นแล้ว
        </button>
      </div>

      <div className="space-y-4">
        {lawyers.slice(0, 2).map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 relative"
          >
            <div
              className={`absolute top-6 right-6 px-3 py-1 text-base rounded-full font-medium ${
                status === "scheduled"
                  ? " text-primary"
                  : " text-green-800"
              }`}
            >
              {status === "scheduled" ? "นัดหมายแล้ว" : "เสร็จสิ้นแล้ว"}
            </div>

            <div className="bg-brown-lawyerpic rounded-full w-24 md:w-32 h-24 md:h-32 mx-auto md:mx-0">
              <img
                src={item.image}
                alt=""
                className="w-full h-full rounded-full object-cover bg-gray-200"
              />
            </div>

            <div className="flex-1 w-full md:w-auto">
              <div className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
                <p className="text-lg font-medium">{item.name}</p>
                <span className="bg-brown-lawyerpic px-3 py-1 rounded-md text-sm">
                  {item.speciality}
                </span>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-4">
                  <img
                    src={assets.Calendar}
                    alt="calendar icon"
                    className="w-5 h-5"
                  />
                  <p>20/01/2024</p>
                </div>

                <div className="flex items-center gap-4">
                  <img src={assets.Time} alt="clock icon" className="w-5 h-5" />
                  <p>8.30</p>
                </div>
                <div className="flex items-start gap-4">
                  <img
                    src={assets.Location}
                    alt="location icon"
                    className="w-5 h-5 mt-1"
                  />
                  <p className="text-sm md:text-base">
                    สำนักงานกฎหมายทนายนอร์ท
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm md:text-base font-medium mt-6">
                    รายละเอียดเบื้องต้น
                  </p>
                  <p className="text-sm md:text-base font-legular">
                    ต้องการปรึกษาเกี่ยวกับเรื่องหมิ่นประมาทค่ะ
                  </p>

                  <a
                    href="#"
                    className="text-primary underline text-sm flex items-center"
                  >
                    <i className="icon-file-pdf"></i>ตัวอย่างข้อความ.pdf
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-auto justify-end">
              <button className="h-10 px-4 py-2 bg-[#A17F6B] text-white rounded hover:bg-[#8B6B59] transition w-full md:w-auto">
                ยกเลิกการนัดหมาย
              </button>
              <button className="h-10 px-4 py-2 bg-[#DADADA] text-white rounded hover:bg-gray-400 transition w-full md:w-auto">
                รีวิวการนัดหมาย
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
