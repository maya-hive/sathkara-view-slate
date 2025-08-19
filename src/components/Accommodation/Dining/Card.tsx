"use client";

import Image from "next/image";
import { useState } from "react";

import { shimmer } from "@/components/Shimmer";
import { toBase64 } from "@/utils/base64";
import { RichText } from "@/components/RichText";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  image?: string | null;
  description?: string | null;
}

export const AccommodationDiningCard = ({
  image,
  title,
  description,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={cn("relative rounded-lg overflow-hidden bg-secondary", {
          "pt-[200px]": image,
        })}
      >
        <div className="text-white relative z-10 p-4 flex flex-col h-full">
          <h3 className="mt-2 font-bold text-2xl text-center">{title}</h3>
          <div className="mt-3 flex flex-col h-full">
            {description && (
              <div className="flex-1 flex flex-col justify-between">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <div className="rounded w-full border-2 border-primary p-2 text-primary text-md text-center font-semibold uppercase cursor-pointer">
                      Read More
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        {title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <RichText content={description} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
        {image && (
          <>
            <Image
              className="w-full h-full object-cover absolute top-0 left-0"
              src={image}
              alt={title}
              placeholder={`data:image/svg+xml;base64,${toBase64(
                shimmer(700, 475)
              )}`}
              priority={false}
              width={500}
              height={400}
            />
            <div className="absolute bottom-0 left-0 h-[60%] w-full bg-gradient-to-b from-transparent to-secondary to-[45%]"></div>
          </>
        )}
      </div>
    </>
  );
};
