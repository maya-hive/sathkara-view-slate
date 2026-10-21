import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

import { HomeTestimonialsSlider } from "@/components/Home/Testimonials.client";

interface Props {
  title?: TrustedHTML | null;
  items?: Item[] | null;
}

type Item = {
  name: string | null;
  review: string | null;
};

export const HomeTestimonials = ({ title, items }: Props) => {
  if (!items?.some((item) => item?.review && item.review.length > 0)) {
    return null;
  }

  return (
    <section className="my-16 relative overflow-x-clip">
      <div className="container mx-auto px-4">
        {title && (
          <div
            className="text-center [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:uppercase [&>h3]:tracking-wide [&>h3]:text-primary [&>h2]:mt-2 [&>h2]:text-3xl [&>h2]:md:text-5xl [&>h2]:font-bold"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        <div className="mt-14">
          <HomeTestimonialsSlider>
            {items
              .filter((item) => item.review)
              .map((item, idx) => (
                <article
                  key={idx}
                  className="flex h-full w-full flex-col rounded-2xl bg-white p-8 border border-light text-center"
                >
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="text-4xl text-primary"
                  />
                  <p className="mt-6 flex-1 leading-relaxed">
                    {item.review}
                  </p>
                  {item.name && <p className="mt-6 font-bold">{item.name}</p>}
                </article>
              ))}
          </HomeTestimonialsSlider>
        </div>
      </div>
    </section>
  );
};
