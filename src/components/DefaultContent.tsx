import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { toBase64 } from "@/utils/base64";
import { cn } from "@/lib/utils";

import { shimmer } from "./Shimmer";
import { RichText } from "./RichText";
import { GalleryGrid } from "./GalleryGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface Props {
	sections?: Section["blocks"][] | null;
}

type Section = {
	blocks: Block | null | undefined;
};

type Block = {
	type?: "default_content" | "gallery" | null;
	title?: string | null;
	image_position?: string | null | undefined;
	image?: string | null | undefined;
	content?: string | null | undefined;
	link_url?: string | null | undefined;
	link_title?: string | null | undefined;
	gallery?: string[] | null;
};

export const DefaultContent = ({ sections }: Props) => (
	<>
		{sections?.map((section, idx) => {
			if (section?.type === "gallery") {
				const images = section.gallery?.filter(Boolean) ?? [];

				if (images.length === 0) {
					return null;
				}

				return (
					<section key={idx} className="container mx-auto px-4 my-20">
						{section.title && (
							<div
								className="[&>h3]:mt-1 [&>h2]:text-4xl [&>h3]:font-semibold [&>h2]:font-bold [&>h4]:font-semibold [&>p]:mt-2 [&>p]:font-medium text-center max-w-[1000px] mx-auto mb-[50px]"
								dangerouslySetInnerHTML={{
									__html: section.title,
								}}
							/>
						)}
						<GalleryGrid>
							{images.map((image, imageIdx) => (
								<div className="inner" key={imageIdx}>
									<Image
										key={imageIdx}
										src={
											image ??
											`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`
										}
										placeholder={`data:image/svg+xml;base64,${toBase64(
											shimmer(700, 475),
										)}`}
										alt={`Gallery image ${imageIdx}`}
										width={800}
										height={500}
										priority={false}
										className="absolute top-0 left-0 w-full h-full object-cover"
									/>
									<a href={image} data-fancybox={`gallery-${idx}`}>
										<FontAwesomeIcon icon={faMagnifyingGlass} />
									</a>
								</div>
							))}
						</GalleryGrid>
					</section>
				);
			}

			const isImageRight = section?.image_position === "right";

			return (
				<section key={idx} className="container mx-auto px-4 my-20">
					<div className="grid grid-cols-12 gap-6">
						{section?.image && (
							<div
								className={cn(
									"md:col-span-6",
									isImageRight ? "order-2" : "order-1",
									"col-span-12",
								)}
							>
								<div className="relative pt-[100%] md:min-h-[450px] md:pt-0 h-[100%]">
									<Image
										className="w-full h-full object-cover absolute top-0 left-0 md:rounded-lg"
										src={section.image}
										alt={"section " + idx}
										placeholder={`data:image/svg+xml;base64,${toBase64(
											shimmer(700, 475),
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
								section?.image
									? "md:col-span-6 md:py-20 flex flex-col justify-center"
									: "md:col-span-12",
								isImageRight ? "order-1" : "order-2",
								"col-span-12",
							)}
						>
							{section?.content && (
								<RichText content={section?.content} />
							)}
							{section?.link_url && (
								<Link
									href={section.link_url}
									className="block w-fit mt-4"
								>
									<Button variant="outline">
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
