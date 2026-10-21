"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Children, ReactNode, useRef } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Autoplay } from "swiper/modules";

interface Props {
  children: ReactNode[] | ReactNode;
}

const maxSlidesPerView = 3;

export const HomeTestimonialsSlider = ({ children }: Props) => {
  const swiperRef = useRef<SwiperType>(null);
  const slides = Children.toArray(children);
  const copies =
    slides.length > 0 && slides.length <= maxSlidesPerView
      ? Math.ceil((maxSlidesPerView + 1) / slides.length)
      : 1;
  const renderedSlides = Array.from({ length: copies }, () => slides).flat();

  return (
    <div className="relative lg:mx-5">
      <Swiper
        modules={[Navigation, A11y, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        loop={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="[&_.swiper-wrapper]:items-stretch"
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
      >
        {renderedSlides.map((child, index) => (
          <SwiperSlide key={index} className="!flex !h-auto">
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-4 relative lg:hidden w-full flex gap-5 justify-center">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="h-fit my-auto z-10"
          aria-label="Previous testimonial"
        >
          <FontAwesomeIcon
            className="rounded-full bg-primary text-white p-3"
            icon={faArrowLeft}
            size="lg"
          />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="h-fit my-auto z-10"
          aria-label="Next testimonial"
        >
          <FontAwesomeIcon
            className="rounded-full bg-primary text-white p-3"
            icon={faArrowRight}
            size="lg"
          />
        </button>
      </div>
    </div>
  );
};
