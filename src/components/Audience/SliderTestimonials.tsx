import { AudienceSliderClient } from "@/components/Audience/Slider.client";
import { AudienceTestimonialCard } from "@/components/Audience/TestimonialCard";

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

export const AudienceTestimonialSlider = ({ content, items }: Props) => {
  if (
    !items?.some((item) => item?.testimonial && item?.testimonial.length > 0)
  ) {
    return null;
  }

  return (
    <section className="my-16 relative overflow-x-clip">
      <div className="container mx-auto px-4 md:px-0 pt-16">
        <div className="text-center text-3xl font-bold">
          {content && <h2 dangerouslySetInnerHTML={{ __html: content }} />}
        </div>
        <div className="mt-14">
          <AudienceSliderClient>
            {items?.map(
              (item, idx) =>
                item.audience && (
                  <AudienceTestimonialCard key={idx} data={item} />
                )
            )}
          </AudienceSliderClient>
        </div>
      </div>
      <div className="absolute top-0 left-0 h-[65%] w-full bg-primary/20 -z-50"></div>
    </section>
  );
};
