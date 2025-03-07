import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const CommentApproval = () => {
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const [showDisapprovePopup, setShowDisapprovePopup] = useState(false);
  const { reviews, setReviews, getAllReviews, confirmReviews, cancelReviews } =
    useContext(AdminContext);
  const { slotDateFormat, slotTimeFormat } = useContext(AppContext);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [approvalAction, setApprovalAction] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  const handlePopupAction = (action, reviewId) => {
    if (action === "approve") {
      setShowApprovePopup(true);
      setSelectedReviewId(reviewId);
      setApprovalAction("approve");
    } else if (action === "disapprove") {
      setShowDisapprovePopup(true);
      setSelectedReviewId(reviewId);
      setApprovalAction("disapprove");
    } else if (action === "closeApprove") {
      setShowApprovePopup(false);
      setSelectedReviewId(null);
    } else if (action === "closeDisapprove") {
      setShowDisapprovePopup(false);
      setSelectedReviewId(null);
    }
  };

  const handleConfirmAction = () => {
    if (selectedReviewId) {
      if (approvalAction === "approve") {
        confirmReviews(selectedReviewId);
      } else if (approvalAction === "disapprove") {
        cancelReviews(selectedReviewId);
      }

      // ปิด popup หลังจากยืนยัน
      if (approvalAction === "approve") {
        setShowApprovePopup(false);
      } else {
        setShowDisapprovePopup(false);
      }

      // รีเซ็ตค่า
      setSelectedReviewId(null);
      setApprovalAction("");
    }
  };

  //กรองข้อมูล
  const filteredReviews = () => {
    if (filterStatus === "pending") {
      return reviews.filter(
        (review) => !review.isConfirm && !review.isCancelled
      );
    } else if (filterStatus === "all") {
      return reviews.filter(
        (review) => review.isConfirm || review.isCancelled
      );
    }
  };

  //จัดการปุ่มมันกดเปลี่ยนสถานะ
  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  useEffect(() => {
    getAllReviews();
  }, []);

  return (
    <div className="p-8 w-full">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          อนุมัติความคิดเห็น
        </h1>
      </div>

      <div className="flex flex-row gap-2 mb-4 mt-4 w-1/3">
        <button
          className={`px-4 py-2 rounded-full ${
            filterStatus === "pending"
              ? "bg-primary text-white"
              : "bg-gray-200 text-dark-brown"
          }`}
          onClick={() => handleFilterChange("pending")}
        >
          รออนุมัติ
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            filterStatus === "all"
              ? "bg-primary text-white"
              : "bg-gray-200 text-dark-brown"
          }`}
          onClick={() => handleFilterChange("all")}
        >
          อนุมัติ
        </button>
      </div>

      {/* ข้อมูลความคิดเห็น */}
      <div className="bg-[#F7F7F7] w-full max-w-7xl min-h-[650px] mt-2 mx-auto p-6 mb-6 rounded">
        {filteredReviews() && filteredReviews().length > 0 ? (
          filteredReviews().map((review, index) => (
            <div key={index} className="flex flex-col gap-4 mb-4">
              <div>
                <div className="flex flex-row gap-6 mb-2">
                  <p className="text-dark-brown font-medium">การนัดหมาย</p>
                  <p className="text-dark-brown">
                    {slotDateFormat(review.appointmentData.slotDate)} |{" "}
                    {slotTimeFormat(review.appointmentData.slotTime)}
                  </p>
                  <p className="bg-primary text-white rounded-full px-3 text-sm">
                    {review.lawyerData.firstName} {review.lawyerData.lastName}
                  </p>
                </div>

                {/* ข้อมูลรีวิว */}
                <div className="flex gap-2 border border-dark-brown rounded p-4">
                  <img
                    className="w-8 h-8 mr-4 rounded-full object-cover object-center"
                    src={review.userData.image}
                    alt=""
                  />

                  <div className="flex gap-40">
                    <div>
                      <p className="text-dark-brown font-medium gap-10">
                        {review.userData.firstName} {review.userData.lastName}
                      </p>
                      <p className="text-[12px] text-primary">
                        {review.createAt
                          ? review.createAt.split("T")[0]
                          : "ไม่ระบุวันที่"}
                      </p>
                      <p className="text-dark-brown mt-4">{review.comment}</p>
                    </div>

                    <div className="flex gap-1">
                      {[...Array(5).keys()].map((_, index) => (
                        <AiFillStar
                          key={index}
                          color={index < review.rating ? "#A3806C" : "#D9D9D9"}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {filterStatus === "pending" ? (
                  <div className="flex gap-2 justify-end">
                    <button
                      className="rounded-full bg-red-700 text-white text-center px-6 py-1 mt-4 hover:bg-red-800"
                      onClick={() =>
                        handlePopupAction("disapprove", review._id)
                      }
                    >
                      ไม่อนุมัติ
                    </button>
                    <button
                      className="rounded-full bg-green-700 text-white text-center px-8 py-1 mt-4 hover:bg-green-800"
                      onClick={() => handlePopupAction("approve", review._id)}
                    >
                      อนุมัติ
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end mt-4">
                    {review.isConfirm && (
                      <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full">
                        อนุมัติ
                      </span>
                    )}
                    {review.isCancelled && (
                      <span className="px-4 py-1 bg-red-100 text-red-800 rounded-full">
                        ไม่อนุมัติ
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">ไม่มีรายการที่แสดง</p>
        )}
      </div>

      {/* Popup ยืนยันอนุมัติความคิดเห็น */}
      {showApprovePopup && (
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
                onClick={() => handlePopupAction("closeApprove")}
                className="px-8 py-1 border border-primary text-primary rounded-full hover:bg-primary hover:text-white"
              >
                ปิด
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-6 py-1 bg-primary text-white rounded-full hover:bg-[#927663]"
              >
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
                onClick={() => handlePopupAction("closeDisapprove")}
                className="px-8 py-1 border border-primary text-primary rounded-full hover:bg-primary hover:text-white"
              >
                ปิด
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-6 py-1 bg-primary text-white rounded-full hover:bg-[#927663]"
              >
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
