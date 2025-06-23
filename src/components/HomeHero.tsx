import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import { toBase64 } from "@/utils/base64";
import { shimmer } from "@/components/Shimmer";

import { SearchWidget } from "./Search/Widget";

interface Props {
  image?: string | null;
  video?: string | null;
  title?: string | null;
  content?: string | null;
}

export const HomeHero = async ({ image, video, title, content }: Props) => {
  if (!image) {
    return null;
  }

  return (
    <section className="mb-10 relative">
      <div className="absolute bottom-0 left-0 h-[150px] w-full bg-gradient-to-b from-transparent to-secondary"></div>
      <div className="aboslute top-0 left-0 flex flex-col justify-center h-full">
        {video ? (
          <video
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            poster={image}
            autoPlay={true}
            width={1400}
            height={800}
            muted
            loop
            playsInline
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <Image
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            src={image ?? placeholder}
            placeholder={placeholder}
            alt={"Banner image"}
            width={1400}
            height={800}
          />
        )}
        <div className="container mx-auto px-4">
          <div className="relative text-white pt-[380px] xl:pt-[480px] z-10 pointer-events-none">
            {content && (
              <div
                className="[&>h1]:text-5xl [&>h1]:xl:text-7xl [&>h1]:font-bold [&>h1>span]:block [&>h1>span]:mt-3 [&>h1>span]:md:inline [&>h1>span]:md:mt-0 text-center xl:text-left"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 relative -mt-2 -bottom-10">
        <SearchWidget title={title} />
      </div>
    </section>
  );
};

const placeholder: PlaceholderValue = `data:image/svg+xml;base64,${toBase64(
  shimmer(700, 475)
)}`;
