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

export const ItineraryCategorySliderClient = ({ children }: Props) => {
  const swiperRef = useRef<SwiperType>(null);

  return (
    <section className="my-8">
      <div className="container mx-auto px-4 sm:px-6">
        <Swiper
          modules={[Navigation, A11y]}
          loop={true}
          spaceBetween={50}
          slidesPerView={1}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute z-10 left-0 top-0 bottom-0"
          >
            <FontAwesomeIcon
              className="rounded-full bg-orange-500 text-white p-3"
              icon={faArrowLeft}
              size="lg"
            />
          </button>
          {Children.map(children, (child, index) => (
            <SwiperSlide key={index}>{child}</SwiperSlide>
          ))}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute z-10 right-0 top-0 bottom-0"
          >
            <FontAwesomeIcon
              className="rounded-full bg-orange-500 text-white p-3"
              icon={faArrowRight}
              size="lg"
            />
          </button>
        </Swiper>
      </div>
    </section>
  );
};
