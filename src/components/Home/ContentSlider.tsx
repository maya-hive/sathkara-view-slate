interface Props {
  title?: TrustedHTML | null;
  contents?: ContentSlide[];
}

type ContentSlide = {
  content?: TrustedHTML | null;
  image?: string | null;
  link?: Link | null;
};

type Link = {
  title: string | null;
  url: string | null;
};

export const HomeContentSlider = ({ title, contents }: Props) => {
  return (
    <section>
      <div className="container mx-auto">
        {title && <h2 dangerouslySetInnerHTML={{ __html: title }} />}

        <div className="slider-items grid gap-6 md:grid-cols-2">
          {contents?.map((item, index) => (
            <div
              key={index}
              className="slide-item border rounded-xl p-4 shadow-sm"
            >
              {item.image && (
                <img
                  className="w-full h-48 object-cover rounded-lg"
                  src={item.image}
                  width={500}
                  height={500}
                />
              )}
              {item.content && (
                <div
                  dangerouslySetInnerHTML={{ __html: item.content }}
                  className="prose"
                />
              )}
              {item.link && item.link.url && (
                <a
                  href={item.link.url}
                  className="inline-block mt-4 text-blue-600 hover:underline"
                >
                  {item.link.title}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
