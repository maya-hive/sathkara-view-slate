"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Children, ReactNode, useRef } from "react";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";

interface Props {
  items?: Item[] | null;
  children: ReactNode[] | ReactNode;
}

type Item = {
  category: string | null;
  content: string | null;
  itineraries: string[] | null;
} | null;

export const ItienraryCategorySliderClient = ({ items, children }: Props) => {
  const swiperRef = useRef<SwiperType>(null);

  if (!items) {
    return null;
  }

  return (
    <section className="mt-8 p-8">
      <div className="container mx-auto">
        <Swiper
          modules={[Navigation, A11y]}
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
              className="rounded-full bg-slate-300 p-3"
              icon={faArrowLeft}
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
              className="rounded-full bg-slate-300 p-3"
              icon={faArrowRight}
            />
          </button>
        </Swiper>
      </div>
    </section>
  );
};
