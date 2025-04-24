import Image from "next/image";
import Link from "next/link";

interface Props {
  content?: string | null;
  logos: Item[] | null;
}

type Item = {
  icon: string | null;
  link: string | null;
};

export const CompnayLogos = ({ content, logos }: Props) => (
  <section className="my-20">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="text-center text-2xl font-semibold">{content}</div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
        {logos?.map(
          ({ icon, link }, idx) =>
            icon && (
              <div
                key={idx}
                className="border rounded-lg overflow-hidden relative pt-[150px]"
              >
                {link && (
                  <Link
                    href={link ?? ""}
                    target="_blank"
                    className="absolute left-0 top-0 h-full w-full z-10"
                  />
                )}
                {icon && (
                  <Image
                    className="object-contain absolute w-[60%] h-full left-0 right-0 top-0 bottom-0 mx-auto"
                    src={icon}
                    alt={"logo " + idx}
                    width={200}
                    height={180}
                    priority={false}
                  />
                )}
              </div>
            )
        )}
      </div>
    </div>
  </section>
);
