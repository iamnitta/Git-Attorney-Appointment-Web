import React from "react";
import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { assets } from "../../assets/assets";

const CommentApproval = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDisapprovePopup, setShowDisapprovePopup] = useState(false);

  const handleApprove = () => {
    setShowPopup(true);
  };

  const handleDisapprove = () => {
    setShowDisapprovePopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCloseDisapprovePopup = () => {
    setShowDisapprovePopup(false);
  };

  return (
    <div className="p-8 w-full">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          อนุมัติความคิดเห็น
        </h1>
      </div>

      <div className="flex flex-row gap-2 mb-4 mt-4 w-1/3">
        <button
        // onClick={() => handleSortStatusChange("cancelled")}
        // className={`px-4 py-2 rounded-lg flex items-center ${
        //   sortStatus === "cancelled"
        //     ? "bg-[#C5211D] text-white"
        //     : "bg-[#DADADA]"
        // }`}
        >
          รออนุมัติ
          <span
          // className={`ml-2 rounded-full px-2 text-sm ${
          //   sortStatus === "cancelled"
          //     ? "bg-white text-[#C5211D]"
          //     : "bg-[#9B9B9B] text-[#DADADA]"
          // }`}
          >
            {/* {filteredStatusCount.cancelled} */}
          </span>
        </button>
        <button
        // onClick={() => handleSortStatusChange("cancelled")}
        // className={`px-4 py-2 rounded-lg flex items-center ${
        //   sortStatus === "cancelled"
        //     ? "bg-[#C5211D] text-white"
        //     : "bg-[#DADADA]"
        // }`}
        >
          อนุมัติ
          <span
          // className={`ml-2 rounded-full px-2 text-sm ${
          //   sortStatus === "cancelled"
          //     ? "bg-white text-[#C5211D]"
          //     : "bg-[#9B9B9B] text-[#DADADA]"
          // }`}
          >
            {/* {filteredStatusCount.cancelled} */}
          </span>
        </button>
      </div>

      {/* ข้อมูลความคิดเห็น */}
      <div className="bg-[#F7F7F7] w-full max-w-7xl min-h-[650px] mt-2 mx-auto p-6 mb-6 rounded">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex flex-row gap-6">
              <p className="text-dark-brown font-medium">การนัดหมาย</p>
              <p className="text-dark-brown">17 กุมภาพันธ์ 2024 | 9.00-9.30</p>
              <p className="bg-primary text-white rounded-full px-3 text-sm">
                ทนาย ทดลอง ระบบ
              </p>
            </div>
          </div>
          <div className="flex gap-2 border border-dark-brown rounded p-4">
            <img
              className="w-8 h-8 mr-4 rounded-full"
              src={assets.Profile}
              alt=""
            />

            <div className="flex gap-40">
              <div>
                <p className="text-dark-brown font-medium gap-10">
                  พิมพ์ใจ รัตนจันทร์
                </p>
                <p className="text-[12px] text-primary">02-14-2023</p>
                <p className="text-dark-brown mt-4">ทนายให้บริการดีมาก ๆ ค่ะ</p>
              </div>

              <div className="flex gap-1">
                {[...Array(5).keys()].map((_, index) => (
                  <AiFillStar key={index} color="#A3806C" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="rounded-full bg-red-700 text-white text-center px-6 py-1 mt-4 hover:bg-red-800"
            onClick={handleDisapprove}
          >
            ไม่อนุมัติ
          </button>
          <button
            className="rounded-full bg-green-700 text-white text-center px-8 py-1 mt-4 hover:bg-green-800"
            onClick={handleApprove}
          >
            อนุมัติ
          </button>
        </div>

        {/* เส้นแบ่ง */}
        <div className="mt-4">
          <hr className="text-[#DADADA]"></hr>
        </div>
      </div>

      {/* Popup ยืนยันอนุมัติความคิดเห็น */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[500px]">
            <div className="flex flex-col items-center gap-4">
              <img
                src={assets.Caution_Icon}
                alt="Caution Icon"
                className="w-10 h-10 cursor-pointer"
              />
              <p className="text-dark-brown font-medium">
                ยืนยัน <span className="text-[#397D54] text-xl">อนุมัติ</span>{" "}
                ความคิดเห็นนี้
              </p>
            </div>

            <div className="flex flex-row justify-center mt-8 gap-2">
              <button
                onClick={handleClosePopup}
                className="px-8 py-1 border border-primary text-primary rounded-full hover:bg-primary hover:text-white"
              >
                ปิด
              </button>
              <button className="px-6 py-1 bg-primary text-white rounded-full hover:bg-[#927663]">
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup ยืนยันไม่อนุมัติความคิดเห็น */}
      {showDisapprovePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[500px]">
            <div className="flex flex-col items-center gap-4">
              <img
                src={assets.Caution_Icon}
                alt="Caution Icon"
                className="w-10 h-10 cursor-pointer"
              />
              <p className="text-dark-brown font-medium">
                ยืนยัน{" "}
                <span className="text-[#C5211D] text-xl">ไม่อนุมัติ</span>{" "}
                ความคิดเห็นนี้
              </p>
            </div>

            <div className="flex flex-row justify-center mt-8 gap-2">
              <button
                onClick={handleCloseDisapprovePopup}
                className="px-8 py-1 border border-primary text-primary rounded-full hover:bg-primary hover:text-white"
              >
                ปิด
              </button>
              <button className="px-6 py-1 bg-primary text-white rounded-full hover:bg-[#927663]">
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentApproval;
