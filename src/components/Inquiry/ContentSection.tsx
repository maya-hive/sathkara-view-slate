import Image from "next/image";

import { ItineraryInquiryForm } from "@/components/Itinerary/Inquiry/Form";
import { cn } from "@/lib/utils";

interface Props {
  content?: string | null;
  image?: string | null;
}

export const InquiryContentSection = ({ content, image }: Props) => {
  const hasSideData = content || image;

  return (
    <section className="container mx-auto">
      <div
        className={cn(
          {
            "lg:grid-cols-2 ": hasSideData,
          },
          "grid py-12 lg:py-20 gap-8"
        )}
      >
        {hasSideData && (
          <div className="relative pt-[100%] lg:pt-0 rounded-xl overflow-hidden">
            {image && (
              <Image
                className="absolute w-full h-full top-0 left-0 object-cover"
                src={image}
                alt={"content image"}
                width={1200}
                height={800}
              />
            )}
            {content && (
              <span
                dangerouslySetInnerHTML={{ __html: content }}
                className="prose absolute left-0 bottom-0 p-8 text-white z-10"
              />
            )}
            <div className="absolute bottom-0 left-0 h-[70%] w-full bg-gradient-to-b from-transparent via-transparent/50 to-slate-900 to-[70%]"></div>
          </div>
        )}
        <ItineraryInquiryForm />
      </div>
    </section>
  );
};
