import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="bg-light-brown pb-12">
      <p className="text-center text-2xl font-medium py-4 text-dark-brown">
        ติดต่อเรา
      </p>

      <div className="text-center">
        <p className="text-xl font-medium py-4 mb-12">สำนักงานกฎหมายทนายนอร์ท</p>

        <div className="flex flex-col lg:flex-row justify-between items-start px-4 lg:px-0">
          <div className="flex flex-col lg:ml-28">

            <div className="flex items-center">
              <img
                src={assets.Location}
                alt="Office"
                className="w-7 h-auto rounded-lg"
              />
              <p className="text-lg font-medium ml-2 text-dark-brown transform hover:-translate-y-1 transition duration-300">ที่ตั้งสำนักงาน</p>
            </div>

            <div className="flex flex-col items-start ml-9 mb-12">
              <p>เลขที่ 109/10 หมู่ 4 ตำบลทับมา</p>
              <p>อำเภอเมือง จังหวัดระยอง 21000</p>
            </div>

            <div className="flex items-center">
              <img
                src={assets.Phone}
                alt="Phone"
                className="w-7 h-auto rounded-lg"
              />
              <p className="text-lg font-medium ml-2 text-dark-brown transform hover:-translate-y-1 transition duration-300">เบอร์โทรติดต่อ</p>
            </div>

            <div className="flex flex-col items-start ml-9 mb-12">
              <p>098-887-8916</p>
            </div>

            <div className="flex items-center">
              <img
                src={assets.Line}
                alt="Line"
                className="w-7 h-auto rounded-lg"
              />
              <p className="text-lg font-medium ml-2 text-dark-brown transform hover:-translate-y-1 transition duration-300">Line ID</p>
            </div>

            <div className="flex flex-col items-start ml-9">
              <p>att.northlaw</p>
            </div>
          </div>

          <img
            src={assets.Office}
            alt="Office"
            className="w-full sm:w-64 lg:w-96 h-auto mx-auto rounded-lg mt-8 lg:mt-0 transform hover:scale-105 transition duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;