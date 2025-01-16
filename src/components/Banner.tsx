import Image from "next/image";

interface Props {
  image?: string | null;
  content?: string | null;
}

export const Banner = async ({ image, content }: Props) => {
  return (
    <section className="relative h-[400px]">
      <div className="aboslute top-0 left-0 flex flex-col justify-center h-full">
        {image && (
          <Image
            className="absolute w-full h-full object-cover -z-10"
            src={image}
            alt={"Banner image"}
            width={500}
            height={100}
          />
        )}
        <div className="text-center text-white">
          {content && <span dangerouslySetInnerHTML={{ __html: content }} />}
        </div>
      </div>
    </section>
  );
};
