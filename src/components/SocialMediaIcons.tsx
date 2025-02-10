import { cn } from "@/lib/utils";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import Link from "next/link";

export interface Props {
  size: FontAwesomeIconProps["size"];
  color?: string;
  links?: SocialMediaLinks | null;
}

export type SocialMediaLinks = {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
};

export const SocialMediaIcons = ({
  color = "text-white",
  size = "lg",
  links,
}: Props) => (
  <div className={cn(color, "flex justify-center lg:justify-start space-x-4")}>
    {links?.facebook && (
      <Link href={links.facebook} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faFacebook} size={size} />
      </Link>
    )}
    {links?.instagram && (
      <Link href={links.instagram} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faInstagram} size={size} />
      </Link>
    )}
    {links?.twitter && (
      <Link href={links.twitter} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faTwitter} size={size} />
      </Link>
    )}
    {links?.linkedin && (
      <Link href={links.linkedin} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faLinkedin} size={size} />
      </Link>
    )}
    {links?.youtube && (
      <Link href={links.youtube} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faYoutube} size={size} />
      </Link>
    )}
  </div>
);
