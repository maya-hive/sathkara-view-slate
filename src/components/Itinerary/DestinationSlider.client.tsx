"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Children, ReactNode, useRef } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";

interface Props {
  children: ReactNode[] | ReactNode;
}

export const ItineraryDestinationSliderClient = ({ children }: Props) => {
  const swiperRef = useRef<SwiperType>(null);

  return (
    <div className="px-6 relative">
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute z-10 left-0 top-[270px]"
      >
        <FontAwesomeIcon
          className="rounded-full bg-orange-500 text-white p-3"
          icon={faArrowLeft}
          size="lg"
        />
      </button>
      <Swiper
        modules={[Navigation, A11y]}
        spaceBetween={18}
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 3 },
        }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {Children.map(children, (child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
      </Swiper>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute z-10 right-0 top-[270px]"
      >
        <FontAwesomeIcon
          className="rounded-full bg-orange-500 text-white p-3"
          icon={faArrowRight}
          size="lg"
        />
      </button>
    </div>
  );
};
