"use client";

import Image from "next/image";
import { useState } from "react";
import { Bed, Maximize2, Mountain } from "lucide-react";

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

interface Props {
  name: string;
  description?: string | null | undefined;
  image?: string | null | undefined;
  view?: string | null | undefined;
  bedding?: string | null | undefined;
  size?: string | null | undefined;
}

export const AccommodationRoomCard = ({
  image,
  name,
  description,
  view,
  bedding,
  size,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasRoomDetails = view || bedding || size;

  return (
    <>
      <div className="relative rounded-lg overflow-hidden bg-secondary flex flex-col md:flex-row min-h-[200px]">
        {image && (
          <div className="relative w-full md:w-3/5 h-[300px] md:h-auto flex-shrink-0">
            <Image
              className="w-full h-full object-cover"
              src={image}
              alt={name}
              placeholder={`data:image/svg+xml;base64,${toBase64(
                shimmer(700, 475)
              )}`}
              priority={false}
              width={500}
              height={400}
            />
          </div>
        )}
        
        <div className="text-white relative z-10 p-4 md:p-6 flex flex-col flex-1 bg-secondary">
          <h3 className="font-bold text-xl md:text-lg mb-3 md:mb-4">
            {name}
          </h3>

          {hasRoomDetails && (
            <div className="mt-3 flex flex-col gap-3 md:gap-4 mb-4">
              {bedding && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 flex-shrink-0">
                    <Bed className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">{bedding}</span>
                </div>
              )}
              {size && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 flex-shrink-0">
                    <Maximize2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">{size}</span>
                </div>
              )}
              {view && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 flex-shrink-0">
                    <Mountain className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">{view}</span>
                </div>
              )}
            </div>
          )}

          {description && (
            <div className="mt-auto">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <div className="mt-4 rounded w-full bg-primary text-white p-2 text-primary text-md text-center font-semibold uppercase cursor-pointer hover:bg-primary hover:text-white transition-colors">
                    Read More
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-xl max-h-[80vh] flex flex-col p-0 overflow-hidden">
                  <DialogHeader className="flex-shrink-0 bg-background border-b px-6 py-4 pr-12">
                    <DialogTitle className="text-2xl font-bold">
                      {name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
                    {hasRoomDetails && (
                      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {bedding && (
                          <div className="flex flex-col items-center sm:items-start p-4 rounded-lg border bg-muted/50">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Bedding
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-center sm:text-left w-full">
                              {bedding}
                            </div>
                          </div>
                        )}
                        {size && (
                          <div className="flex flex-col items-center sm:items-start p-4 rounded-lg border bg-muted/50">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Size
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-center sm:text-left w-full">
                              {size}
                            </div>
                          </div>
                        )}
                        {view && (
                          <div className="flex flex-col items-center sm:items-start p-4 rounded-lg border bg-muted/50">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                View
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-center sm:text-left w-full">
                              {view}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="prose prose-sm max-w-none">
                      <RichText content={description} />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
