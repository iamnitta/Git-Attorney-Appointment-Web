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
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [expandedReviewIds, setExpandedReviewIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4; // จำนวนแถวที่ต้องการแสดงในแต่ละหน้า

  const toggleExpand = (reviewId) => {
    setExpandedReviewIds((prevExpandedReviewIds) =>
      prevExpandedReviewIds.includes(reviewId)
        ? prevExpandedReviewIds.filter((id) => id !== reviewId)
        : [...prevExpandedReviewIds, reviewId]
    );
  };

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
      return reviews.filter((review) => review.isConfirm || review.isCancelled);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const totalPages = Math.ceil(filteredReviews().length / rowsPerPage);

  const currentReviews = filteredReviews().slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  //จัดการปุ่มมันกดเปลี่ยนสถานะ
  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };
  const pendingCount = reviews.filter(
    (reviews) => reviews.isCancelled === false && reviews.isConfirm === false
  ).length;
  const approveCount = reviews.filter(
    (reviews) => reviews.isCancelled === true || reviews.isConfirm === true
  ).length;

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

      <div className="flex flex-row gap-2 mb-4 w-1/3">
        <button
          className={`px-4 py-2 rounded-lg flex items-center ${
            filterStatus === "pending"
              ? "bg-dark-brown text-white"
              : "bg-[#DADADA]"
          }`}
          onClick={() => handleFilterChange("pending")}
        >
          รออนุมัติ
          <span
            className={`ml-2 rounded-full px-2 text-sm ${
              filterStatus === "pending"
                ? "bg-white text-dark-brown"
                : "bg-[#9B9B9B] text-[#DADADA]"
            }`}
          >
            {pendingCount}
          </span>
        </button>

        <button
          className={`px-4 py-2 rounded-lg flex items-center ${
            filterStatus === "all" ? "bg-dark-brown text-white" : "bg-[#DADADA]"
          }`}
          onClick={() => handleFilterChange("all")}
        >
          อนุมัติแล้ว{" "}
          <span
            className={`ml-2 rounded-full px-2 text-sm ${
              filterStatus === "all"
                ? "bg-white text-dark-brown"
                : "bg-[#9B9B9B] text-[#DADADA]"
            }`}
          >
            {approveCount}
          </span>
        </button>
      </div>

      {/* ข้อมูลความคิดเห็น */}
      <div className="bg-[#F7F7F7] w-full max-w-7xl min-h-[600px] mx-auto p-6 mb-6 rounded">
      {currentReviews && currentReviews.length > 0 ? (
        currentReviews.map((review, index) => (
            <div key={index} className="flex flex-col gap-4 mb-4">
              <div>
                {/* ข้อมูลรีวิว */}
                <div className="flex gap-2 border border-[#DADADA] rounded p-4 justify-between">
                  <div className="flex flex-row gap-2">
                    <img
                      className="w-8 h-8 mr-4 rounded-full object-cover object-center"
                      src={review.userData.image}
                      alt=""
                    />

                    <div>
                      <div className="flex gap-40">
                        <div>
                          <p className="text-dark-brown font-medium gap-10">
                            {review.userData.firstName}{" "}
                            {review.userData.lastName}
                          </p>
                          <p className="text-[12px] text-primary">
                            {review.createAt
                              ? review.createAt.split("T")[0]
                              : "ไม่ระบุวันที่"}
                          </p>
                          <p className="text-dark-brown mt-4">
                            {review.comment}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          {[...Array(5).keys()].map((_, index) => (
                            <AiFillStar
                              key={index}
                              color={
                                index < review.rating ? "#A3806C" : "#D9D9D9"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end">
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
                          onClick={() =>
                            handlePopupAction("approve", review._id)
                          }
                        >
                          อนุมัติ
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end mt-4">
                        {review.isConfirm && (
                          <span className="px-4 py-1 text-[#008529] bg-[#008529] bg-opacity-20 rounded-full">
                            อนุมัติ
                          </span>
                        )}
                        {review.isCancelled && (
                          <span className="px-4 py-1 text-[#C5211D] bg-[#C5211D] bg-opacity-20 rounded-full">
                            ไม่อนุมัติ
                          </span>
                        )}
                      </div>
                    )}
                    <div className="ml-2">
                      <img
                        className="w-8 h-8 mr-4 rounded-full object-cover object-center"
                        src={
                          expandedReviewIds.includes(review._id)
                            ? assets.MoreFlip_Icon
                            : assets.More_Icon
                        }
                        alt=""
                        onClick={() => toggleExpand(review._id)}
                      />
                    </div>
                  </div>
                </div>

                {expandedReviewIds.includes(review._id) && (
                  <div className="flex flex-row gap-6 mb-2 bg-dark-brown bg-opacity-10 py-2 px-4 rounded mt-2">
                    <p className="text-dark-brown font-medium">การนัดหมาย</p>
                    <p className="text-dark-brown">
                      {slotDateFormat(review.appointmentData.slotDate)} |{" "}
                      {slotTimeFormat(review.appointmentData.slotTime)}
                    </p>
                    <p className="flex items-center justify-center bg-primary text-white px-4 rounded-full text-sm">
                      ทนาย {review.lawyerData.firstName}{" "}
                      {review.lawyerData.lastName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            ไม่มีความคิดเห็นที่รออนุมัติ
          </p>
        )}
      </div>

      {/* Pagination */}
    <div className="flex justify-end mt-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 mx-1 rounded text-dark-brown text-sm ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        {"<"}
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-1 mx-1 rounded-full ${
            currentPage === index + 1
              ? "bg-[#D4C7BD] text-dark-brown"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 mx-1 rounded text-dark-brown text-sm ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        {">"}
      </button>
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
