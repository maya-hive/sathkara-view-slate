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
  <section className="my-32">
    <div className="container mx-auto">
      <div className="text-center text-2xl font-semibold">{content}</div>
      <div className="mt-6 grid md:grid-cols-3 xl:grid-cols-5 gap-5">
        {logos?.map(({ icon, link }, idx) => (
          <Link
            key={idx}
            href={link ?? ""}
            target="_blank"
            className="block border rounded-lg overflow-hidden relative pt-[150px]"
          >
            {icon && (
              <Image
                src={icon}
                alt={"logo " + idx}
                width={200}
                height={180}
                className="object-contain absolute w-[60%] h-full left-0 right-0 top-0 bottom-0 mx-auto"
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  </section>
);
