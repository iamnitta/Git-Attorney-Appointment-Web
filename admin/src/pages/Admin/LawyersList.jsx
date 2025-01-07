import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const LawyersList = () => {
  const { lawyers, aToken, getAllLawyers } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllLawyers();
    }
  }, [aToken]);

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl bg-[#A88B7D] text-white p-4 rounded-md w-fit">
        ทนายความทั้งหมด
      </h1>

      <div className="p-4">
        <div className="mt-4">
          <div className="flex justify-between bg-[#D4C7BD] p-4">
            <div className="w-1/4 font-medium">ทนายความ</div>
            <div className="w-1/4 font-medium">อีเมล</div>
            <div className="w-1/4 font-medium">เบอร์โทร</div>
            <div></div>
          </div>

          {lawyers.map((lawyer, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 even:bg-[#E7E7E7] odd:bg-white hover:bg-gray-100"
            >
              <div className="w-1/4">
                {lawyer.firstName} {lawyer.lastName}
              </div>
              <div className="w-1/4">{lawyer.email}</div>
              <div className="w-1/4">{lawyer.phone}</div>
              <div>
                <button className="px-6 py-1.5 border border-gray-300 rounded-full hover:bg-white">
                  ดูเพิ่มเติม
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LawyersList;
