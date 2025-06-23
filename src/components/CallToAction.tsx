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

export const CallToAction = ({ content, link, image }: Props) => {
  if (!content) {
    return null;
  }

  return (
    <section className="my-8">
      <div className="container mx-auto px-4">
        <div className="relative sm:rounded-xl overflow-hidden grid md:grid-cols-2 justify-end py-20 px-8">
          <div />
          <div className="text-white z-10">
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="[&>h2]:text-5xl [&>h2]:font-bold [&>p]:mt-6 [&>p]:font-semibold text-center md:text-left"
            />
            {link?.url && (
              <Link
                href={link.url}
                className="block mx-auto md:mx-0 rounded w-fit mt-5 bg-primary text-white px-10 py-2 text-center text-md font-medium uppercase"
              >
                {link.title}
              </Link>
            )}
          </div>
          {image && (
            <Image
              className="absolute top-0 left-0 w-full h-full object-cover -z-10"
              src={image}
              alt={"Call to action background image"}
              width={1600}
              height={800}
            />
          )}
          <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-b md:bg-gradient-to-r from-transparent via-transparent/60 to-secondary to-[60%]"></div>
        </div>
      </div>
    </section>
  );
};
