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
    <section className="container mx-auto px-4 my-8">
      <div className="relative lg:mx-6">
        <Swiper
          modules={[Navigation, A11y]}
          loop={true}
          spaceBetween={50}
          slidesPerView={1}
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
        <div className="mt-4 md:mt-4 relative lg:absolute lg:top-0 lg:bottom-0 w-full flex gap-5 justify-center">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="lg:absolute lg:-left-5 lg:top-0 lg:bottom-0 h-fit my-auto z-10"
          >
            <FontAwesomeIcon
              className="rounded-full bg-primary text-white p-3"
              icon={faArrowLeft}
              size="lg"
            />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="lg:absolute lg:-right-5 lg:top-0 lg:bottom-0 h-fit my-auto z-10"
          >
            <FontAwesomeIcon
              className="rounded-full bg-primary text-white p-3"
              icon={faArrowRight}
              size="lg"
            />
          </button>
        </div>
      </div>
    </section>
  );
};
