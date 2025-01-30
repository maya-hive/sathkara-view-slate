import { ItienraryCategorySliderClient as SliderClient } from "./CategorySlider.client";
import { ItinerarySlide as Slide } from "./Slide";

interface Props {
  items?: Item[] | null;
}

type Item = {
  category: string;
  content: string | null;
  itineraries: string[] | null;
} | null;

export const ItienraryCategorySlider = ({ items }: Props) => {
  return (
    <SliderClient items={items}>
      {items?.map((section: Item, index) => {
        return (
          section?.itineraries && (
            <Slide
              key={index}
              category={section.category}
              itineraries={section.itineraries}
              content={section.content}
            />
          )
        );
      })}
    </SliderClient>
  );
};
