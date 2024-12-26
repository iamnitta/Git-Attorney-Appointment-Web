import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopLawyers = () => {
  const navigate = useNavigate();
  const {lawyers} = useContext(AppContext)

  return (
    <div className="w-full bg-light-brown">
      <div className="flex flex-col items-center gap-4 py-16 text-black md:mx-10">
        <h1 className="text-2xl font-medium font-prompt">ค้นหาทนายความ</h1>
        <p className="sm:w-1/3 text-center text-sm font-prompt text-dark-brown font-medium md:text-xl md:w-2/3">
          ทนายความพร้อมให้คำปรึกษาทุกเรื่องด้านกฎหมาย
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 pt-5 px-3 place-items-center">
          {lawyers.slice(0, 8).map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 w-full md:h-[200px]"
              key={index}
            >
              {/* รูปโปรไฟล์ */}
              <div className="md:w-32 h-40 md:h-32 flex-shrink-0 md:ml-4 md:mt-8 flex items-center justify-center">
                <img
                  className="w-32 h-32 object-cover bg-brown-lawyerpic rounded-full"
                  src={item.image}
                  alt=""
                />
              </div>

              {/* ข้อมูลทนาย */}
              <div className="flex flex-col justify-center p-4 md:pl-8 space-y-2 items-center md:items-start mt-2 md:mt-0">
                <p className="font-prompt text-lg font-medium text-dark-brown">{item.name}</p>
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                  <p className="font-prompt text-sm">ความเชี่ยวชาญ</p>
                  <p className="font-prompt text-xs bg-brown-lawyerpic rounded-full px-2 py-1">
                    {item.speciality}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            navigate("/lawyers");
            scrollTo(0, 0);
          }}
          className="bg-brown-lawyerpic md:px-12 md:py-3 px-4 py-1 rounded-full mt-10 font-prompt text-dark-brown font-medium md:text-base text-xs hover:scale-105 transition-all duration-300"
        >
          ทนายความทั้งหมด
        </button>
      </div>
    </div>
  );
};

export default TopLawyers;
