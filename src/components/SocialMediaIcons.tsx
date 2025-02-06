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

export interface Props {
  size: FontAwesomeIconProps["size"];
  links?: SocialMediaLinks | null;
}

export type SocialMediaLinks = {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
};

export const SocialMediaIcons = ({ links, size = "lg" }: Props) => (
  <div className="flex space-x-4 text-white">
    {links?.facebook && (
      <a href={links.facebook} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faFacebook} size={size} />
      </a>
    )}
    {links?.instagram && (
      <a href={links.instagram} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faInstagram} size={size} />
      </a>
    )}
    {links?.twitter && (
      <a href={links.twitter} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faTwitter} size={size} />
      </a>
    )}
    {links?.linkedin && (
      <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faLinkedin} size={size} />
      </a>
    )}
    {links?.youtube && (
      <a href={links.youtube} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faYoutube} size={size} />
      </a>
    )}
  </div>
);
