import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { toBase64 } from "@/utils/base64";
import { cn } from "@/lib/utils";

import { shimmer } from "./Shimmer";
import { RichText } from "./RichText";

interface Props {
  sections?: Section["blocks"][] | null;
}

type Section = {
  blocks: Block | null | undefined;
};

type Block = {
  image_position?: string | null | undefined;
  image?: string | null | undefined;
  content?: string | null | undefined;
  link_url?: string | null | undefined;
  link_title?: string | null | undefined;
};

export const DefaultContent = ({ sections }: Props) => (
  <>
    {sections?.map((section, idx) => {
      const isImageRight = section?.image_position === "right";

      return (
        <section key={idx} className="container mx-auto my-20">
          <div className="grid grid-cols-12 gap-6">
            {section?.image && (
              <div
                className={cn(
                  "md:col-span-6",
                  isImageRight ? "order-2" : "order-1",
                  "col-span-12"
                )}
              >
                <div className="relative pt-[100%] md:pt-0 h-[100%]">
                  <Image
                    className="w-full h-full object-cover absolute top-0 left-0 md:rounded-lg"
                    src={section.image}
                    alt={"section " + idx}
                    placeholder={`data:image/svg+xml;base64,${toBase64(
                      shimmer(700, 475)
                    )}`}
                    priority={false}
                    width={800}
                    height={600}
                  />
                </div>
              </div>
            )}
            <div
              className={cn(
                section?.image ? "md:col-span-6 md:py-20" : "md:col-span-12",
                isImageRight ? "order-1" : "order-2",
                "col-span-12"
              )}
            >
              {section?.content && <RichText content={section?.content} />}
              {section?.link_url && (
                <Link href={section.link_url} className="block mt-2">
                  <Button variant="link" className="px-0">
                    {section.link_title}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      );
    })}
  </>
);
