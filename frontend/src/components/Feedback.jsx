import React from "react";
import { assets } from "../assets/assets";
import { AiFillStar } from "react-icons/ai";

const Feedback = () => {
  return (
    <div>
      <div className="ml-4 mt-10 mb-10">
        <p className="font-medium text-dark-brown">รีวิวทั้งหมด (1)</p>

        <div className="flex justify-between gap-10 mb-30 mt-5">
          <div className="flex gap-2">
            <img
              className="w-8 h-8 mr-4 rounded-full"
              src={assets.Profile_Users}
              alt=""
            />

            <div>
                <p className="text-dark-brown font-medium gap-10">พิมพ์ใจ รัตนจันทร์</p>
                <p className="text-[12px] text-primary">02-14-2023</p>
                <p className="text-dark-brown mt-4">ทนายให้บริการดีมาก ๆ ค่ะ</p>

            </div>     

            <div className="flex gap-1">
              {[...Array(5).keys()].map((_,index) => (
                <AiFillStar key={index} color="#A3806C"/>

              ))}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
