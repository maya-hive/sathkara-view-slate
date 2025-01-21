import Image from "next/image";

interface Props {
  image?: string | null;
  content?: string | null;
}

export const Banner = async ({ image, content }: Props) => {
  return (
    <section className="relative h-[400px]">
      <div className="absolute bottom-0 left-0 h-[100px] w-full bg-gradient-to-b from-transparent to-black"></div>
      <div className="aboslute top-0 left-0 flex flex-col justify-center h-full">
        {image && (
          <Image
            className="absolute w-full h-full object-cover -z-10"
            src={image}
            alt={"Banner image"}
            width={1600}
            height={800}
          />
        )}
        <div className="text-center text-white">
          {content && (
            <span
              className="[&>h1]:text-4xl"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </section>
  );
};
