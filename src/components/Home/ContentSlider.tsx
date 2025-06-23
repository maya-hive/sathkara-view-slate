"use client";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";

interface Props {
  title?: TrustedHTML | null;
  contents?: ContentSlide[];
}

type ContentSlide = {
  title?: string | null;
  content?: TrustedHTML | null;
  image?: string | null;
  icon?: string | null;
  link_title?: string | null;
  link_url?: string | null;
};

export const HomeContentSlider = ({ title, contents }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType>(null);

  if (!contents?.some((item) => item.content && item.icon)) {
    return null;
  }

  return (
    <section className="my-20">
      <div className="container mx-auto px-4">
        <div className="relative sm:rounded-2xl overflow-hidden sm:px-12 py-16">
          <div className="absolute top-0 left-0 h-full md:h-[300px] w-full bg-gradient-to-b from-secondary to-transparent -z-10" />
          <div className="absolute top-0 right-0 w-[90%] h-full bg-gradient-to-l from-secondary via-secondary/75 to-transparent -z-40 md:-z-10" />
          <div className="relative flex flex-col xl:flex-row justify-between">
            {title && (
              <h2
                className="text-3xl xl:text-3xl text-center xl:text-left font-semibold text-white xl:max-w-[250px] flex-1"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            <div className="pt-8 xl:pt-0 relative flex-1 xl:max-w-[800px]">
              <Swiper
                modules={[Navigation]}
                spaceBetween={30}
                loop={false}
                className="[&>div]:2xl:justify-end"
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 6, spaceBetween: 0 },
                }}
              >
                {contents?.map(
                  (item, index) =>
                    item.icon && (
                      <SwiperSlide
                        key={index}
                        className="flex justify-center xl:justify-end lg:flex-1"
                      >
                        <button
                          onClick={() => setActiveIndex(index)}
                          className={`h-full overflow-hidden cursor-pointer text-center group ${
                            index === activeIndex
                              ? "text-primary"
                              : "text-white hover:text-primary"
                          }`}
                        >
                          <div
                            className={`rounded-xl p-4 pt-0 relative border-b-2 border-b-[#ffffff00] ${
                              index === activeIndex ? "!border-b-primary" : ""
                            }`}
                          >
                            {item.icon && (
                              <Image
                                src={item.icon}
                                alt="icon"
                                width={80}
                                height={80}
                                className="mx-auto h-12 w-[90px] object-contain"
                              />
                            )}
                            <p className="mt-4 max-w-[120px] text-sm font-medium uppercase">
                              {item.title}
                            </p>
                          </div>
                        </button>
                      </SwiperSlide>
                    )
                )}
              </Swiper>
              <div className="xl:hidden absolute w-full top-[25%] flex gap-5 justify-center">
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="absolute z-10 top-full left-0"
                >
                  <FontAwesomeIcon
                    className="rounded-full text-primary p-3 left-0"
                    icon={faArrowLeft}
                    size="lg"
                  />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="absolute z-10 top-full right-0"
                >
                  <FontAwesomeIcon
                    className="rounded-full text-primary p-3 right-0"
                    icon={faArrowRight}
                    size="lg"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-8 xl:pt-20 py-8 flex justify-center xl:justify-end w-100">
            <div className="text-white max-w-[600px] text-center xl:text-left">
              {contents?.[activeIndex]?.content && (
                <div
                  className="prose text-white prose-h2:text-2xl prose-h2:xl:text-4xl prose-h3:text-lg"
                  dangerouslySetInnerHTML={{
                    __html: contents[activeIndex].content!,
                  }}
                />
              )}

              {contents?.[activeIndex]?.link_url && (
                <Link
                  className="inline-block mt-8 px-6 py-3 bg-primary text-white rounded font-semibold uppercase tracking-wide text-sm"
                  href={contents[activeIndex].link_url}
                >
                  {contents[activeIndex].link_title || "Plan Your Trip"}
                </Link>
              )}
            </div>
          </div>

          {contents?.[activeIndex]?.image && (
            <Image
              src={contents[activeIndex].image!}
              alt="Slide visual"
              className="w-full h-full object-cover absolute top-0 left-0 -z-20"
              width={1200}
              height={800}
            />
          )}
        </div>
      </div>
    </section>
  );
};
