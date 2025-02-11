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

export const ContentSection = ({ content, link, image }: Props) => (
  <section className="relative overflow-x-clip my-24">
    <div className="container mx-auto mb-20">
      <div className="grid md:grid-cols-2 py-20 md:pt-12">
        <div />
        {image && (
          <Image
            className="absolute w-[100vw] h-full top-0 left-0 md:-left-[50%] object-cover md:rounded-tr-2xl"
            src={image}
            alt={"content image"}
            width={1200}
            height={800}
          />
        )}
        <div className="rounded-xl md:rounded-none py-24 pr-16 md:pr-0 pl-16 bg-sky-100 z-10">
          {content && (
            <span
              dangerouslySetInnerHTML={{ __html: content }}
              className="[&>h2]:mb-4 [&>h2]:text-5xl [&>h2]:font-bold [&>p]:mt-6 [&>h4]:font-bold font-semibold"
            />
          )}
          {link?.url && (
            <Link
              href={link.url}
              className="block rounded w-fit mt-5 bg-yellow-400 text-yellow-800 px-10 py-4 text-center text-md font-semibold uppercase"
            >
              {link.title}
            </Link>
          )}
          <div className="absolute left-[50%] top-0 bg-sky-100 w-[100vw] h-full -z-10 mt-12 rounded-bl-2xl invisible md:visible" />
        </div>
      </div>
    </div>
  </section>
);
