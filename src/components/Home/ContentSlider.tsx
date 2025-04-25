"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
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

  return (
    <section className="my-20">
      <div className="relative sm:rounded-2xl overflow-hidden container mx-auto px-4 sm:px-6 p-16">
        <div className="absolute top-0 left-0 h-full md:h-[300px] w-full bg-gradient-to-b from-slate-800 via-slate-900/75 to-transparent -z-10" />
        <div className="absolute top-0 right-0 w-[80%] h-full bg-gradient-to-l from-slate-800 via-slate-800/80 to-transparent -z-40 md:-z-10" />
        <div className="relative flex flex-col md:flex-row justify-between">
          {title && (
            <h2
              className="text-3xl md:text-3xl text-center md:text-left font-semibold text-white md:max-w-[250px] flex-1"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          <div className="mt-8 md:mt-0 relative flex-1">
            <Swiper
              modules={[Navigation]}
              navigation={true}
              spaceBetween={30}
              loop={false}
              className="[&>div]:xl:justify-end"
              breakpoints={{
                0: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 6 },
              }}
            >
              {contents?.map((item, index) => (
                <SwiperSlide key={index} className="flex justify-center">
                  <button
                    onClick={() => setActiveIndex(index)}
                    className={`h-full overflow-hidden cursor-pointer text-center group ${
                      index === activeIndex
                        ? "text-yellow-500"
                        : "text-white hover:text-yellow-500"
                    }`}
                  >
                    <div
                      className={`rounded-xl p-4 pt-0 relative border-b-2 border-b-[#ffffff00] ${
                        index === activeIndex ? "!border-b-yellow-500" : ""
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
              ))}
            </Swiper>
          </div>
        </div>
        <div className="pt-20 py-8 flex justify-end w-100">
          <div className="text-white max-w-[600px] text-center md:text-left">
            {contents?.[activeIndex]?.content && (
              <div
                className="prose text-white prose-h2:text-4xl prose-h3:text-lg"
                dangerouslySetInnerHTML={{
                  __html: contents[activeIndex].content!,
                }}
              />
            )}

            {contents?.[activeIndex]?.link_url && (
              <Link
                className="inline-block mt-8 px-6 py-3 bg-yellow-400 text-black rounded-md font-semibold uppercase tracking-wide text-sm"
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
    </section>
  );
};
