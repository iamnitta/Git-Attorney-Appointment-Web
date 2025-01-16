import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Lawyers = () => {
  const { speciality } = useParams();
  const [filterLaw, setFilterLaw] = useState([]);
  const navigate = useNavigate();

  const { lawyers } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      // กรองทนายที่มี speciality ตรงกับที่เลือก
      const filteredLawyers = lawyers.filter((law) => 
        law.speciality.includes(speciality)
      );
      setFilterLaw(filteredLawyers);
    } else {
      setFilterLaw(lawyers);
    }
};

  useEffect(() => {
    applyFilter();
  }, [lawyers, speciality]);

  return (
    <div className="bg-light-brown pb-12">
      <p className="text-center text-2xl font-medium py-4 text-dark-brown">ทนายความทั้งหมด</p>

      <div>
        <p className="text-xl text-center font-regular md:text-left md:px-4">ค้นหาทนายความตามความต้องการ</p>
        {/* filter and lawyers */}
        <div className="flex flex-col md:flex-row items-start gap-5 mt-5">
          {/* filter */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-sm w-full md:w-80">
            <p
              onClick={() => (speciality === "กฎหมายอาญา" ? navigate("/lawyers") : navigate("/lawyers/กฎหมายอาญา"))}
              className={`cursor-pointer hover:bg-brown-lawyerpic p-3 transition-all border-2 border-brown-lawyerpic shadow-sm flex items-center justify-between rounded-lg md:ml-6 ml-4 md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${speciality === "กฎหมายอาญา" ? "bg-brown-lawyerpic text-black" : ""}`}
            >
              กฎหมายอาญา
              <img className="hidden md:block md:w-10 md:h-10 ml-2" src={assets.Criminal} alt="" />
            </p>

            <p
              onClick={() => (speciality === "กฎหมายแรงงาน" ? navigate("/lawyers") : navigate("/lawyers/กฎหมายแรงงาน"))}
              className={`cursor-pointer hover:bg-brown-lawyerpic p-3 transition-all border-2 border-brown-lawyerpic shadow-sm flex items-center justify-between rounded-lg md:ml-6 ml-4 md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${speciality === "กฎหมายแรงงาน" ? "bg-brown-lawyerpic text-black" : ""}`}
            >
              กฎหมายแรงงาน
              <img className="hidden md:block md:w-10 md:h-10 ml-2" src={assets.Labor} alt="" />
            </p>

            <p
              onClick={() => (speciality === "กฎหมายยาเสพติด" ? navigate("/lawyers") : navigate("/lawyers/กฎหมายยาเสพติด"))}
              className={`cursor-pointer hover:bg-brown-lawyerpic p-3 transition-all border-2 border-brown-lawyerpic shadow-sm flex items-center justify-between rounded-lg md:ml-6 ml-4 md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${speciality === "กฎหมายยาเสพติด" ? "bg-brown-lawyerpic text-black" : ""}`}
            >
              กฎหมายยาเสพติด
              <img className="hidden md:block md:w-10 md:h-10 ml-2" src={assets.Drug} alt="" />
            </p>

            <p
              onClick={() => (speciality === "กฎหมายการแพ่ง" ? navigate("/lawyers") : navigate("/lawyers/กฎหมายการแพ่ง"))}
              className={`cursor-pointer hover:bg-brown-lawyerpic p-3 transition-all border-2 border-brown-lawyerpic shadow-sm flex items-center justify-between rounded-lg md:ml-6 ml-4 md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${speciality === "กฎหมายการแพ่ง" ? "bg-brown-lawyerpic text-black" : ""}`}
            >
              กฎหมายการแพ่ง
              <img className="hidden md:block md:w-10 md:h-10 ml-2" src={assets.Civil} alt="" />
            </p>

            <p
              onClick={() => (speciality === "กฎหมายทรัพย์สินทางปัญญา" ? navigate("/lawyers") : navigate("/lawyers/กฎหมายทรัพย์สินทางปัญญา"))}
              className={`cursor-pointer hover:bg-brown-lawyerpic p-3 transition-all border-2 border-brown-lawyerpic shadow-sm flex items-center justify-between rounded-lg md:ml-6 ml-4 md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${speciality === "กฎหมายทรัพย์สินทางปัญญา" ? "bg-brown-lawyerpic text-black" : ""}`}
            >
              กฎหมายทรัพย์สินทางปัญญา
              <img className="hidden md:block md:w-10 md:h-10 ml-2" src={assets.IP} alt="" />
            </p>

            <p
              onClick={() => (speciality === "กฎหมายปกครอง" ? navigate("/lawyers") : navigate("/lawyers/กฎหมายปกครอง"))}
              className={`cursor-pointer hover:bg-brown-lawyerpic p-3 transition-all border-2 border-brown-lawyerpic shadow-sm flex items-center justify-between rounded-lg md:ml-6 ml-4 md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${speciality === "กฎหมายปกครอง" ? "bg-brown-lawyerpic text-black" : ""}`}
            >
              กฎหมายปกครอง
              <img className="hidden md:block md:w-10 md:h-10 ml-2" src={assets.Administrative} alt="" />
            </p>

            <p
              onClick={() => (speciality === "กฎหมายผู้บริโภค" ? navigate("/lawyers") : navigate("/lawyers/กฎหมายผู้บริโภค"))}
              className={`cursor-pointer hover:bg-brown-lawyerpic p-3 transition-all border-2 border-brown-lawyerpic shadow-sm flex items-center justify-between rounded-lg md:ml-6 ml-4 md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${speciality === "กฎหมายผู้บริโภค" ? "bg-brown-lawyerpic text-black" : ""}`}
            >
              กฎหมายผู้บริโภค
              <img className="hidden md:block md:w-10 md:h-10 ml-2" src={assets.Consumer} alt="" />
            </p>

            <p
              onClick={() => (speciality === "กฎหมายครอบครัวและมรดก" ? navigate("/lawyers") : navigate("/lawyers/กฎหมายครอบครัวและมรดก"))}
              className={`cursor-pointer hover:bg-brown-lawyerpic p-3 transition-all border-2 border-brown-lawyerpic shadow-sm flex items-center justify-between rounded-lg md:ml-6 ml-4 md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${speciality === "กฎหมายครอบครัวและมรดก" ? "bg-brown-lawyerpic text-black" : ""}`}
            >
              กฎหมายครอบครัวและมรดก
              <img className="hidden md:block md:w-10 md:h-10 ml-2" src={assets.Family} alt="" />
            </p>
          </div>

          {/* lawyers */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-3 place-items-center">
            {filterLaw.map((item, index) => (
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
                  <p className="font-prompt text-lg font-medium">
                    ทนาย {item.firstName} {item.lastName}
                  </p>
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                    <p className="font-prompt text-sm">ความเชี่ยวชาญ</p>
                    <div className="flex flex-wrap gap-1">
                      {item.speciality.map((spec, idx) => (
                        <p 
                            key={idx} 
                            className="font-prompt text-xs bg-brown-lawyerpic rounded-full px-2 py-1"
                        >
                            {spec}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lawyers;