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

export const Gallery = ({ children }: Props) => {
  const swiperRef = useRef<SwiperType>(null);

  return (
    <div className="relative">
      <Swiper
        className="sm:rounded-lg overflow-hidden"
        modules={[Navigation, A11y]}
        spaceBetween={20}
        slidesPerView={1}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute z-10 left-5 top-0 bottom-0"
        >
          <FontAwesomeIcon
            className="rounded-full bg-muted p-3"
            icon={faArrowLeft}
            size="lg"
          />
        </button>
        {Children.map(children, (child, idx) => (
          <SwiperSlide
            key={idx}
            className="sm:rounded-lg overflow-hidden pt-[480px] [&>img]:absolute [&>img]:left-0 [&>img]:top-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover"
          >
            {child}
          </SwiperSlide>
        ))}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute z-10 right-5 top-0 bottom-0"
        >
          <FontAwesomeIcon
            className="rounded-full bg-muted p-3"
            icon={faArrowRight}
            size="lg"
          />
        </button>
      </Swiper>
    </div>
  );
};
