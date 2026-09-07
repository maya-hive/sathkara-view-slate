"use client";

import { Children, ReactNode, useEffect, useState } from "react";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

interface Props {
	children: ReactNode[] | ReactNode;
}

export const GalleryGrid = ({ children }: Props) => {
	const [root, setRoot] = useState<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!root) {
			return;
		}

		Fancybox.bind(root, "[data-fancybox]");

		return () => {
			Fancybox.unbind(root);
		};
	}, [root]);

	return (
		<div className="gallery-grid" ref={setRoot}>
			{Children.map(children, (child, idx) => (
				<div className="item" key={idx}>
					{child}
				</div>
			))}
		</div>
	);
};
