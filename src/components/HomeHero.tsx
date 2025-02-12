import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import { toBase64 } from "@/utils/base64";
import { shimmer } from "@/components/Shimmer";

interface Props {
  image?: string | null;
  video?: string | null;
  content?: string | null;
}

export const HomeHero = async ({ image, video, content }: Props) => {
  if (!image) {
    return null;
  }

  return (
    <section className="relative">
      <div className="absolute bottom-0 left-0 h-[100px] w-full bg-gradient-to-b from-transparent to-black"></div>
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
        <div className="text-center text-white pt-[480px] pb-[50px] z-10">
          {content && (
            <span
              className="[&>h1]:text-7xl [&>h1]:font-bold"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

const placeholder: PlaceholderValue = `data:image/svg+xml;base64,${toBase64(
  shimmer(700, 475)
)}`;
