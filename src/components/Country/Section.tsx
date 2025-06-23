import { CountryCard } from "./Card";

interface Props {
  content?: TrustedHTML | null;
  items?: string[] | null;
}

export const CountrySection = ({ content, items }: Props) => {
  if (!items) {
    return null;
  }

  return (
    <section>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-2xl font-semibold">
          {content && <span dangerouslySetInnerHTML={{ __html: content }} />}
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items?.map((country, idx: number) => (
            <CountryCard key={idx} slug={country} />
          ))}
        </div>
      </div>
    </section>
  );
};
