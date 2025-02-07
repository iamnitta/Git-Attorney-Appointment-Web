import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="w-full bg-white">
      <div className="container px-4 m-auto pt-5 lg:px-0">
        <div className="flex flex-col md:flex-row flex-wrap bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${assets.Background})`}}>

          <div className="md:w-1/2 flex flex-col items-center justify-start gap-4 pb-16 m-auto text-center mt-10">
            <img
              className="w-10 h-10 md:w-25 md:h-25 "
              src={assets.Logo_Gold}
              alt=""
            />
            <p className="text-1xl md:text-1xl text-[#AC8A47] font-medium font-prompt leading-tight md:text-lg lg:leading-tight text-center mb-8">
              สำนักงานกฎหมายทนายนอร์ท
            </p>
            <p className="text-3xl md:text-5xl  text-white font-medium font-prompt mb-8">
              ปรึกษาทนายความ
            </p>
            <p className="text-1xl md:text-1xl  text-white font-medium font-prompt leading-tight md:text-lg lg:leading-tight text-center">
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
