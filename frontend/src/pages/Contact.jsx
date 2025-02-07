import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="bg-white pb-12">
      <div className="container px-4 m-auto pt-5 lg:px-0">
        <div
          className="flex flex-col bg-cover bg-center justify-center items-center rounded-lg mb-10"
          style={{
            backgroundImage: `url(${assets.Background})`,
            height: "200px",
          }}
        >
          <p className="text-2xl font-medium py-2 text-white">ติดต่อเรา</p>
          <p className="text-xl font-medium py-2 text-brown-lawyerpic">
            สำนักงานกฎหมายทนายนอร์ท
          </p>
        </div>
      </div>

      <div className="text-center lg:bg-light-brown container px-4 m-auto pt-5 lg:px-0 py-4 rounded-lg mb-20">
        <div className="flex flex-col lg:flex-row justify-between items-start px-4 lg:px-0">
          <div className="flex flex-col lg:ml-28 mt-10">
            <div className="flex items-center">
              <img
                src={assets.Location}
                alt="Office"
                className="w-7 h-auto rounded-lg"
              />
              <p className="text-lg font-medium ml-2 text-dark-brown transform hover:-translate-y-1 transition duration-300">
                ที่ตั้งสำนักงาน
              </p>
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
              <p className="text-lg font-medium ml-2 text-dark-brown transform hover:-translate-y-1 transition duration-300">
                เบอร์โทรติดต่อ
              </p>
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
              <p className="text-lg font-medium ml-2 text-dark-brown transform hover:-translate-y-1 transition duration-300">
                Line ID
              </p>
            </div>

            <div className="flex flex-col items-start ml-9">
              <p>att.northlaw</p>
            </div>
          </div>

          <img
            src={assets.Office}
            alt="Office"
            className="w-full sm:w-64 lg:w-96 h-auto mx-auto rounded-lg transform hover:scale-105 transition duration-300 mb-10 mt-10"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
