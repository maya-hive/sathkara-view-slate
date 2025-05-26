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
    <div className="relative xl:mx-6">
      <Swiper
        modules={[Navigation, A11y]}
        loop={true}
        spaceBetween={18}
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 1 },
          1024: { slidesPerView: 2 },
          1280: { slidesPerView: 3 },
        }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {Children.map(children, (child, index) => (
          <SwiperSlide key={index} className="h-auto">
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-4 md:mt-4 relative xl:absolute xl:top-0 xl:bottom-0 w-full flex gap-5 justify-center">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="xl:absolute xl:-left-6 xl:top-0 xl:bottom-0 h-fit my-auto z-10"
        >
          <FontAwesomeIcon
            className="rounded-full bg-primary text-white p-3"
            icon={faArrowLeft}
          />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="xl:absolute xl:-right-6 xl:top-0 xl:bottom-0 h-fit my-auto z-10"
        >
          <FontAwesomeIcon
            className="rounded-full bg-primary text-white p-3"
            icon={faArrowRight}
          />
        </button>
      </div>
    </div>
  );
};
