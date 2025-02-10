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
  <section className="my-8">
    <div className="container mx-auto">
      <div className="grid grid-cols-2">
        {image && (
          <Image
            className=""
            src={image}
            alt={"content image"}
            width={1600}
            height={800}
          />
        )}
        <div className="text-white z-10">
          {content && (
            <span
              dangerouslySetInnerHTML={{ __html: content }}
              className="[&>h2]:text-4xl [&>p]:mt-2 font-semibold"
            />
          )}
          {link?.url && (
            <Link
              href={link.url}
              className="block rounded w-fit mt-5 bg-yellow-400 text-yellow-800 px-10 py-2 text-center text-md font-semibold uppercase"
            >
              {link.title}
            </Link>
          )}
        </div>
      </div>
    </div>
  </section>
);
