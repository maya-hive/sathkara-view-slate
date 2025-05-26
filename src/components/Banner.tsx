import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import { toBase64 } from "@/utils/base64";
import { Breadcrumb } from "@/components/Breadcrumb";
import { shimmer } from "@/components/Shimmer";

interface Props {
  image?: string | null;
  thumbnail?: string | null;
  title?: string | null;
  children?: React.ReactNode;
}

export const Banner = (props: Props) => {
  if (!props.image) {
    return null;
  }

  if (props.children) {
    return <Content {...props} />;
  }

  return <Default {...props} />;
};

const Default = ({ image, thumbnail, title }: Props) => (
  <div className="relative pt-[400px]">
    <div>
      <Media image={image} thumbnail={thumbnail} />
    </div>
    {title && <MetaBar title={title} />}
  </div>
);

const Content = ({ image, children, thumbnail, title }: Props) => (
  <div className="relative py-[100px]">
    <div>
      <Media image={image} thumbnail={thumbnail} />
      {children && (
        <>
          <div className="container mx-auto px-4 sm:px-6 relative w-full z-10 text-white flex justify-end">
            <div className="md:max-w-[600px]">{children}</div>
          </div>
          <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-b md:bg-gradient-to-r from-transparent to-secondary to-[70%]"></div>
        </>
      )}
    </div>
    {title && <MetaBar title={title} />}
  </div>
);

const Media = ({ image, thumbnail }: Props) => (
  <>
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
  </>
);

const MetaBar = ({ title }: { title: string }) => (
  <div className="relative z-10 bg-primary">
    <div className="container mx-auto px-4 sm:px-6 py-4">
      <div className="flex items-center gap-8">
        <div className="font-semibold">
          <Breadcrumb />
          <h1 className="text-white text-3xl">{title}</h1>
        </div>
      </div>
    </div>
  </div>
);

const placeholder: PlaceholderValue = `data:image/svg+xml;base64,${toBase64(
  shimmer(700, 475)
)}`;
