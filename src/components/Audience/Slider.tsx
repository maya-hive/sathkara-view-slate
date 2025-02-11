import { AudienceSliderClient } from "./Slider.client";
import { AudienceFeaturedCard } from "./FeaturedCard";

interface Props {
  content?: TrustedHTML | null;
  items: Item[] | null;
}

type Item = {
  image: string | null;
  audience: string | null;
  title: string | null;
  description: string | null;
  testimonial: string | null;
};

export const AudienceSlider = ({ content, items }: Props) => (
  <section className="my-16 relative overflow-x-clip">
    <div className="container mx-auto pt-16 py-8">
      <div className="text-center text-3xl font-bold">
        {content && <h2 dangerouslySetInnerHTML={{ __html: content }} />}
      </div>
      <div className="mt-14">
        <AudienceSliderClient>
          {items?.map(
            (item, idx) =>
              item.audience && <AudienceFeaturedCard key={idx} data={item} />
          )}
        </AudienceSliderClient>
      </div>
    </div>
    <div className="absolute top-0 left-0 h-[65%] w-full bg-sky-100 -z-50"></div>
  </section>
);
