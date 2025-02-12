import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import { toBase64 } from "@/utils/base64";
import { Breadcrumb } from "@/components/Breadcrumb";
import { shimmer } from "@/components/Shimmer";

interface Props {
  image: string;
  thumbnail?: string | null;
  content?: string | null;
}

export const Banner = ({ image, thumbnail, content }: Props) => (
  <div>
    <div className="relative pt-[400px]">
      <Image
        className="xs:block absolute left-0 top-0 w-full h-full object-cover"
        alt={"Banner image"}
        src={image ?? placeholder}
        placeholder={placeholder}
        width={1400}
        height={800}
        priority={true}
      />
      {thumbnail && (
        <Image
          className="md:hidden absolute left-0 top-0 w-full h-full object-cover"
          alt={"Banner image"}
          src={thumbnail ?? placeholder}
          placeholder={placeholder}
          width={400}
          height={600}
          priority={true}
        />
      )}
    </div>
    {content && <MetaBar content={content} />}
  </div>
);

const MetaBar = ({ content }: { content: string }) => (
  <div className="bg-primary">
    <div className="container mx-auto py-4">
      <div className="flex items-center gap-8">
        <div className="font-semibold">
          <Breadcrumb />
          <div
            className="text-white [&>h1]:text-3xl"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  </div>
);

const placeholder: PlaceholderValue = `data:image/svg+xml;base64,${toBase64(
  shimmer(700, 475)
)}`;
