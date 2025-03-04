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
    <div className="bg-white pb-12 animate-fadeIn">
      <div className="container px-4 m-auto pt-5 lg:px-0">
        <div
          className="flex flex-col flex-wrap bg-cover bg-center justify-center items-center rounded-lg mb-10"
          style={{
            backgroundImage: `url(${assets.Background})`,
            height: "200px",
          }}
        >
          <p className="text-2xl font-medium py-2 text-white">
            ทนายความทั้งหมด
          </p>
          <p className="text-xl font-medium py-2 text-brown-lawyerpic">
            สำนักงานกฎหมายทนายนอร์ท{" "}
          </p>
        </div>
        <div>
          <p className="text-xl text-center font-regular md:text-left text-dark-brown">
            ค้นหาตามความเชี่ยวชาญ
          </p>
          {/* filter and lawyers */}
          <div className="flex flex-col md:flex-row items-start gap-5 mt-5">
            {/* filter */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-sm w-full md:w-80">
              <p
                onClick={() =>
                  speciality === "กฎหมายอาญา"
                    ? navigate("/lawyers")
                    : navigate("/lawyers/กฎหมายอาญา")
                }
                className={`cursor-pointer hover:bg-dark-brown hover:text-white p-3 transition-all border-2 border-dark-brown text-dark-brown flex items-center justify-between rounded-lg md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${speciality === "กฎหมายอาญา" ? "text-white bg-dark-brown" : ""}`}
              >
                กฎหมายอาญา
                <img
                  className="hidden md:block md:w-10 md:h-10 ml-2"
                  src={assets.Criminal_Law}
                  alt=""
                />
              </p>

              <p
                onClick={() =>
                  speciality === "กฎหมายแรงงาน"
                    ? navigate("/lawyers")
                    : navigate("/lawyers/กฎหมายแรงงาน")
                }
                className={`cursor-pointer hover:bg-dark-brown hover:text-white p-3 transition-all border-2 border-dark-brown text-dark-brown flex items-center justify-between rounded-lg md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${
                speciality === "กฎหมายแรงงาน" ? "text-white bg-dark-brown" : ""
              }`}
              >
                กฎหมายแรงงาน
                <img
                  className="hidden md:block md:w-10 md:h-10 ml-2"
                  src={assets.Labor_Law}
                  alt=""
                />
              </p>

              <p
                onClick={() =>
                  speciality === "กฎหมายยาเสพติด"
                    ? navigate("/lawyers")
                    : navigate("/lawyers/กฎหมายยาเสพติด")
                }
                className={`cursor-pointer hover:bg-dark-brown hover:text-white p-3 transition-all border-2 border-dark-brown text-dark-brown flex items-center justify-between rounded-lg md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${
                speciality === "กฎหมายยาเสพติด"
                  ? "text-white bg-dark-brown"
                  : ""
              }`}
              >
                กฎหมายยาเสพติด
                <img
                  className="hidden md:block md:w-10 md:h-10 ml-2"
                  src={assets.Drug_Law}
                  alt=""
                />
              </p>

              <p
                onClick={() =>
                  speciality === "กฎหมายแพ่ง"
                    ? navigate("/lawyers")
                    : navigate("/lawyers/กฎหมายแพ่ง")
                }
                className={`cursor-pointer hover:bg-dark-brown hover:text-white p-3 transition-all border-2 border-dark-brown text-dark-brown flex items-center justify-between rounded-lg md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${speciality === "กฎหมายแพ่ง" ? "text-white bg-dark-brown" : ""}`}
              >
                กฎหมายแพ่ง
                <img
                  className="hidden md:block md:w-10 md:h-10 ml-2"
                  src={assets.Civil_Law}
                  alt=""
                />
              </p>

              <p
                onClick={() =>
                  speciality === "กฎหมายทรัพย์สินทางปัญญา"
                    ? navigate("/lawyers")
                    : navigate("/lawyers/กฎหมายทรัพย์สินทางปัญญา")
                }
                className={`cursor-pointer hover:bg-dark-brown hover:text-white p-3 transition-all border-2 border-dark-brown text-dark-brown flex items-center justify-between rounded-lg md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${
                speciality === "กฎหมายทรัพย์สินทางปัญญา"
                  ? "text-white bg-dark-brown"
                  : ""
              }`}
              >
                กฎหมายทรัพย์สินทางปัญญา
                <img
                  className="hidden md:block md:w-10 md:h-10 ml-2"
                  src={assets.Property_Law}
                  alt=""
                />
              </p>

              <p
                onClick={() =>
                  speciality === "กฎหมายภาษี"
                    ? navigate("/lawyers")
                    : navigate("/lawyers/กฎหมายภาษี")
                }
                className={`cursor-pointer hover:bg-dark-brown hover:text-white p-3 transition-all border-2 border-dark-brown text-dark-brown flex items-center justify-between rounded-lg md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${speciality === "กฎหมายภาษี" ? "text-white bg-dark-brown" : ""}`}
              >
                กฎหมายภาษี
                <img
                  className="hidden md:block md:w-10 md:h-10 ml-2"
                  src={assets.Tax_Law}
                  alt=""
                />
              </p>

              <p
                onClick={() =>
                  speciality === "กฎหมายผู้บริโภค"
                    ? navigate("/lawyers")
                    : navigate("/lawyers/กฎหมายผู้บริโภค")
                }
                className={`cursor-pointer hover:bg-dark-brown hover:text-white p-3 transition-all border-2 border-dark-brown text-dark-brown flex items-center justify-between rounded-lg md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${
                speciality === "กฎหมายผู้บริโภค"
                  ? "text-white bg-dark-brown"
                  : ""
              }`}
              >
                กฎหมายผู้บริโภค
                <img
                  className="hidden md:block md:w-10 md:h-10 ml-2"
                  src={assets.Consumer_Law}
                  alt=""
                />
              </p>

              <p
                onClick={() =>
                  speciality === "กฎหมายครอบครัวและมรดก"
                    ? navigate("/lawyers")
                    : navigate("/lawyers/กฎหมายครอบครัวและมรดก")
                }
                className={`cursor-pointer hover:bg-dark-brown hover:text-white p-3 transition-all border-2 border-dark-brown text-dark-brown flex items-center justify-between rounded-lg md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${
                speciality === "กฎหมายครอบครัวและมรดก"
                  ? "text-white bg-dark-brown"
                  : ""
              }`}
              >
                กฎหมายครอบครัวและมรดก
                <img
                  className="hidden md:block md:w-10 md:h-10 ml-2"
                  src={assets.Family_Law}
                  alt=""
                />
              </p>

              <p
                onClick={() =>
                  speciality === "กฎหมายล้มละลาย"
                    ? navigate("/lawyers")
                    : navigate("/lawyers/กฎหมายล้มละลาย")
                }
                className={`cursor-pointer hover:bg-dark-brown hover:text-white p-3 transition-all border-2 border-dark-brown text-dark-brown flex items-center justify-between rounded-lg md:h-full h-10 md:mr-0 mr-4 md:text-sm text-xs
              ${
                speciality === "กฎหมายล้มละลาย"
                  ? "text-white bg-dark-brown"
                  : ""
              }`}
              >
                กฎหมายล้มละลาย
                <img
                  className="hidden md:block md:w-10 md:h-10 ml-2"
                  src={assets.Bankrupt_Law}
                  alt=""
                />
              </p>
            </div>

            {/* lawyers */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
              {filterLaw.map((item, index) => (
                <div
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className="flex flex-col md:flex-row bg-light-brown rounded-lg overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 w-full md:h-[200px]"
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
                    <p className="font-prompt text-lg font-medium text-dark-brown">
                      ทนาย {item.firstName} {item.lastName}
                    </p>
                    <div className="flex gap-1 md:gap-2">
                      <p className="font-prompt text-sm whitespace-nowrap">
                        ความเชี่ยวชาญ
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.speciality
                          .filter((spec) => spec === speciality)
                          .concat(
                            item.speciality.filter(
                              (spec) => spec !== speciality
                            )
                          )
                          .slice(0, 2)
                          .map((spec, index) => (
                            <p
                              key={index}
                              className="font-prompt text-xs bg-gradient-to-r from-primary to-dark-brown text-white rounded-full px-2 py-1"
                            >
                              {spec}
                            </p>
                          ))}
                        {item.speciality.length > 2 && (
                          <p className="font-prompt text-xs bg-dark-brown text-white rounded-full px-2 py-1">
                            +{item.speciality.length - 2}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lawyers;
