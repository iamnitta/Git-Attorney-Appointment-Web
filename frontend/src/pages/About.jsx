import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="bg-light-brown pb-12">
      <p className="text-center text-2xl font-medium py-4 text-dark-brown">
        เกี่ยวกับเรา
      </p>
      <p className="text-xl font-medium py-4 mb-12 text-center">
        สำนักงานกฎหมายทนายนอร์ท
      </p>

      <div className="text-center mb-40">
        <div className="flex flex-wrap justify-center items-start gap-8 px-4 lg:px-0">
          {/* เกี่ยวกับเรา */}
          <div className="flex flex-col lg:flex-row w-full lg:w-5/6">
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <img
                src={assets.About_1}
                alt="About_1"
                className="w-full sm:w-64 lg:w-96 h-auto rounded-lg transform hover:scale-105 transition duration-300"
              />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start mt-6 lg:mt-0 lg:ml-12">
              <div className="flex items-center mb-4">
                <img
                  src={assets.Logo_2}
                  alt="Logo"
                  className="w-8 h-auto mr-4"
                />
                <p className="text-lg font-medium text-dark-brown transform hover:-translate-y-1 transition duration-300">
                  เกี่ยวกับเรา
                </p>
              </div>
              <hr className="border-none outline-none h-0.5 bg-dark-brown w-1/2 mb-5" />
              <p className="text-center lg:text-left w-full sm:w-5/6">
                สำนักงานกฎหมายทนายนอร์ทเป็นผู้ให้บริการทางกฎหมายที่ให้บริการอย่างมืออาชีพโดยทีมทนายความผู้เชี่ยวชาญหลากหลายสาขาที่พร้อมจะให้คำแนะนำและแก้ไขปัญหาอย่างมีประสิทธิภาพ
              </p>
            </div>
          </div>

          {/* วิสัยทัศน์ */}
          <div className="flex flex-col lg:flex-row w-full lg:w-5/6 mt-8">
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <img
                src={assets.About_2}
                alt="About_2"
                className="w-full sm:w-64 lg:w-96 h-auto rounded-lg transform hover:scale-105 transition duration-300" 
              />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start mt-6 lg:mt-0 lg:ml-12">
              <div className="flex items-center mb-4">
                <img
                  src={assets.Logo_2}
                  alt="Logo"
                  className="w-8 h-auto mr-4"
                />
                <p className="text-lg font-medium text-dark-brown transform hover:-translate-y-1 transition duration-300">
                  วิสัยทัศน์
                </p>
              </div>
              <hr className="border-none outline-none h-0.5 bg-dark-brown w-1/2 mb-5" />
              <p className="text-center lg:text-left w-full sm:w-5/6">
                สำนักงานกฎหมายทนายนอร์ทมุ่งมั่นที่จะเป็นที่พึ่งทางกฎหมายอันดับหนึ่งสำหรับลูกค้าทุกคนด้วยบริการที่เน้นความแม่นยำและรวดเร็ว
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
