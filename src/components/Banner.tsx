import Image from "next/image";

interface Props {
  image?: string | null;
  content?: string | null;
}

export const Banner = async ({ image, content }: Props) => {
  return (
    <section className="relative">
      <div className="absolute bottom-0 left-0 h-[100px] w-full bg-gradient-to-b from-transparent to-black"></div>
      <div className="aboslute top-0 left-0 flex flex-col justify-center h-full">
        {image && (
          <Image
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            src={image}
            alt={"Banner image"}
            width={1600}
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
