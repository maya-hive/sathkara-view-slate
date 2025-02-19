import { ItineraryCategorySliderClient as SliderClient } from "./CategorySlider.client";
import { ItineraryCategorySlide as Slide } from "./CategorySlide";

interface Props {
  items?: Item[] | null;
}

type Item = {
  category: string;
  content: string | null;
  itineraries: string[] | null;
} | null;

export const ItineraryCategorySlider = ({ items }: Props) => {
  return (
    <SliderClient>
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
