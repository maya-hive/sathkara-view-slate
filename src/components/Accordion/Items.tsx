"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

import { RichText } from "@/components/RichText";

interface Props {
  items?: Item[] | null;
}

type Item = {
  title?: string | null;
  content?: string | null;
} | null;

export const AccordionItems = ({ items }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto px-4 my-10">
      {items?.map((item, idx) => {
        return (
          item?.title &&
          item?.content && (
            <div key={idx} className="mb-5 border rounded-md overflow-hidden">
              <button
                className="bg-muted w-full flex justify-between items-center text-left px-6 py-4 rounded-t-md"
                onClick={() => toggleAccordion(idx)}
              >
                <h5 className="font-medium">{item.title}</h5>
                <ChevronDown
                  className={`transform transition-transform duration-100 ${
                    activeIndex === idx ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-100 ease-out overflow-hidden text-sm ${
                  activeIndex === idx
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 py-4 bg-white border-t">
                  <RichText content={item.content} />
                </div>
              </div>
            </div>
          )
        );
      })}
    </section>
  );
};
