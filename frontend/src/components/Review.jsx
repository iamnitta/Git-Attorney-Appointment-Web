import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { HiStar } from "react-icons/hi";
import { reviews } from '../assets/assets'

const Review = () => {
  return (
    <div className="bg-white px-4 lg:px-10">
      <div className="flex flex-col items-center gap-4 py-16 bg-white">
        <h1 className="text-2xl font-medium font-prompt">รีวิวของเรา</h1>
        <p className="sm:w-2/3 text-center text-sm font-prompt text-dark-brown font-medium md:text-xl">
          ยืนยันความเชื่อมั่นในบริการคุณภาพ
        </p>
      </div>

      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        className="overflow-visible"
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
        }}
        
      >
        {reviews.map((review) => (
          <SwiperSlide key={review._id} className="hover:!scale-105 transition-transform duration-300">
            <div className="py-8 px-5 mx-8 mb-10 rounded-lg bg-light-brown flex flex-col justify-between min-h-[180px]">
              <div className="flex items-center gap-[13px]">
                <img
                  className="w-8 h-8 rounded-full"
                  src={review.image}
                  alt=""
                />
                <div>
                  <h4 className="leading-[30px] text-sm font-regular">
                    {review.reviewer}
                  </h4>
                  <div className="flex items-center gap-[2px]">
                    {Array.from({ length: 5 }, (_, index) => (
                      <HiStar
                        key={index}
                        className={`w-[14px] h-5 ${
                          index < review.rating ? "text-primary" : "text-stone-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex-grow">
                <p className="text-sm leading-7 mt-4 text-dark-brown">
                  {review.comment}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="h-20"></div>
    </div>
  );
};

export default Review;