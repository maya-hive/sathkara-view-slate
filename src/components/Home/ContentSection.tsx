import Image from "next/image";
import Link from "next/link";

interface Props {
  content: TrustedHTML | null;
  image?: string | null;
  link?: Link | null;
}

type Link = {
  title: string | null;
  url: string | null;
};

export const HomeContentSection = ({ content, link, image }: Props) => {
  if (!content) {
    return null;
  }

  return (
    <section className="relative overflow-x-clip mt-16 mb-32">
      <div className="container mx-auto mb-20">
        <div className="grid md:grid-cols-2 mx-8 my-20 md:mx-0 md:pt-12">
          <div />
          {image && (
            <Image
              className="absolute w-full md:w-[50%] lg:w-[54%] h-full top-0 left-0 object-cover md:rounded-tr-2xl"
              src={image}
              alt={"content image"}
              width={1200}
              height={800}
            />
          )}
          <div className="rounded-xl md:rounded-none py-16 my-12 md:my-0 md:pb-0 md:pt-24 pr-8 pl-8 md:pr-0 lg:pl-32 xl:pl-40 bg-sky-100 md:bg-transparent z-10 text-center md:text-left">
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="[&>h2]:mb-4 [&>h2]:text-4xl [&>h2]:md:text-5xl [&>h2]:font-bold [&>p]:mt-6 [&>h4]:font-bold font-semibold"
            />
            {link?.url && (
              <Link
                href={link.url}
                className="block rounded w-fit mt-8 mx-auto md:mx-0 bg-yellow-400 text-yellow-800 px-10 py-4 text-center text-md font-semibold uppercase"
              >
                {link.title}
              </Link>
            )}
            <div className="absolute right-0 top-0 bg-sky-100 w-[50%] lg:w-[46%] h-full -z-10 mt-12 rounded-bl-2xl invisible md:visible" />
          </div>
        </div>
      </div>
    </section>
  );
};
