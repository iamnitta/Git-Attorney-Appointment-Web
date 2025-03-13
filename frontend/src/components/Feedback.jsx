import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { AiFillStar } from "react-icons/ai";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";

const Feedback = () => {
  const { reviews, averageRating, getLawyerReviews } = useContext(AppContext);
  const { lawId } = useParams();

  useEffect(() => {
    if (lawId) {
      getLawyerReviews(lawId);
    }
  }, [lawId]);
  return (
    <div className="w-[95%] mx-auto animate-fadeIn">
      <div className="mt-10 mb-10">
        <p className="font-medium text-dark-brown">
          {reviews?.filter((review) => review.isConfirm === true).length || 0}{" "}
          ความคิดเห็น{" "}
          <span className="rounded-full px-3 bg-primary">
            <span className="text-white text-sm">คะแนน {averageRating.toFixed(1)}/5</span>
          </span>
        </p>
        {reviews && reviews.length > 0 ? (
          reviews
            .filter((review) => review.isConfirm === true)
            .map((reviews, index) => (
              <div key={index} className="flex gap-10 mb-30 mt-5 w-full">
                <div className="flex gap-2 justify-between lg:w-1/3 w-full">
                  <div className="flex flex-row gap-2">
                    <img
                      className="w-8 h-8 mr-4 rounded-full object-cover"
                      src={reviews.userData.image}
                      alt=""
                    />

                    <div>
                      <p className="text-dark-brown font-medium gap-16">
                        {reviews.userData.firstName} {reviews.userData.lastName}
                      </p>
                      <p className="text-[12px] text-primary font-medium">
                        {new Date(reviews.createAt)
                          .toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                          .replace(/\//g, "-")}
                      </p>
                      <p className="text-dark-brown mt-4">{reviews.comment}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex">
                      {[...Array(5).keys()].map((_, starIndex) => (
                        <AiFillStar
                          key={starIndex}
                          color={
                            starIndex < reviews.rating ? "#A3806C" : "#D9D9D9"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="mt-5 text-dark-brown">ยังไม่มีความคิดเห็น</div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
