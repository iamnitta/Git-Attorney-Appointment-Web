import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="w-full bg-light-brown ">
      <div className="container  px-4  m-auto md:px-8 pt-5">
        <div className="flex flex-col md:flex-row flex-wrap bg-gray rounded-lg ">
          {/*word*/}

          <div className="md:w-1/2 flex flex-col items-center justify-start gap-4 pb-16 m-auto text-center">
            <img
              className="w-20 h-20 md:w-25 md:h-25 "
              src={assets.Logo}
              alt=""
            />
            <p className="text-1xl md:text-1xl text-dark-brown font-medium font-prompt leading-tight md:leading-tight lg:leading-tight text-center mb-8">
              สำนักงานกฎหมายทนายนอร์ท
            </p>
            <p className="text-3xl md:text-5xl  text-dark-brown font-medium font-prompt">
              ปรึกษาทนายความ
            </p>
            <p className="text-1xl md:text-1xl  text-dark-brown font-medium font-prompt leading-tight md:leading-tight lg:leading-tight text-center">
              ให้คำปรึกษาทุกเรื่องด้านกฎหมาย <br />
              จากทีมผู้เชี่ยวชาญหลากหลายสาขา
            </p>

            <br />
            <a
              href="#speciality"
              className="flex items-center gap-2 bg-primary px-8 py-3 rounded-full text-white font-semibold font-prompt  m-auto md:m-0 hover:scale-105 transition-all duration-300"
            >
              จองเวลานัดหมาย
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
