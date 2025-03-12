import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopLawyers = () => {
  const navigate = useNavigate();
  const { lawyers, reviews, getAllReviews, getAllCases, cases } =
    useContext(AppContext);

  // ฟังก์ชันคำนวณคะแนนเฉลี่ยของทนายแต่ละคน
  const calculateAverageRating = (lawyerId) => {
    const lawyerReviews = reviews.filter((review) => review.lawId === lawyerId);

    if (lawyerReviews.length === 0) {
      return 0; // ถ้าไม่มีรีวิว คืนค่า 0
    }

    const totalRating = lawyerReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return (totalRating / lawyerReviews.length).toFixed(1); // คืนค่าทศนิยม 1 ตำแหน่ง
  };

  useEffect(() => {
    getAllReviews();
  }, []);

  useEffect(() => {
    getAllCases();
  }, []);
  return (
    <div className="w-full bg-white">
      <div className="flex flex-col items-center gap-4 py-16 text-black md:mx-10">
        <h1 className="text-2xl font-medium font-prompt">ค้นหาทนายความ</h1>
        <p className="sm:w-1/3 text-center text-sm font-prompt text-dark-brown font-medium md:text-xl md:w-2/3">
          ทนายความพร้อมให้คำปรึกษาทุกเรื่องด้านกฎหมาย
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 pt-5 px-4 lg:px-10 place-items-center">
          {lawyers.slice(0, 6).map((item, index) => (
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
                    {item.speciality.slice(0, 2).map((spec, index) => (
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

                <p className="font-prompt text-sm text-gray-600 flex items-center">
                  <span className="text-yellow-500 mr-2">★</span>
                  <span className="font-medium text-[#757575]">
                    {Number(calculateAverageRating(item._id))}/5
                  </span>
                  <span className="mx-1"></span>
                  <span className="text-[#757575]">
                    (
                    {
                      reviews.filter((review) => review.lawId === item._id)
                        .length
                    }
                    {" "}ความคิดเห็น)
                  </span>
                </p>

                <p className="font-prompt text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-sm text-[#757575]">
                    ชนะคิดเป็นร้อยละ{" "}
                  </span>
                  <span className="border border-primary rounded-full px-2 text-primary bg-primary bg-opacity-20 text-xs">
                    {(() => {
                      const totalCases = cases.filter(
                        (caseItem) => caseItem.lawId === item._id
                      ).length;
                      const wonCases = cases.filter(
                        (caseItem) =>
                          caseItem.lawId === item._id &&
                          caseItem.caseOutcome === "ชนะ"
                      ).length;
                      const winPercentage =
                        totalCases > 0 ? (wonCases / totalCases) * 100 : 0;
                      return winPercentage.toFixed(2); // Display the percentage with 2 decimal places
                    })()}{" "}
                  </span>

                  <span className="text-[#757575] text-sm">
                    (
                    {
                      cases.filter((caseItem) => caseItem.lawId === item._id)
                        .length
                    }{" "}
                    คดี)
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            navigate("/lawyers");
            scrollTo(0, 0);
          }}
          className="bg-dark-brown md:px-6 md:py-2 px-4 py-1 rounded-full mt-10 font-prompt text-white font-medium md:text-base text-sm hover:scale-105 transition-all duration-300"
        >
          ดูทนายความทั้งหมด
        </button>
      </div>
    </div>
  );
};

export default TopLawyers;
