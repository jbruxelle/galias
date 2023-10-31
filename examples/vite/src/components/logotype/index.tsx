import { FC } from 'react';

interface LogotypeProps {
  link: string;
  image: {
    src: string;
    alt: string;
  };
}

export const Logotype: FC<LogotypeProps> = ({ link, image }) => {
  return (
    <a
      href={link}
      target="_blank"
    >
      <img
        src={image.src}
        className="logo"
        alt={image.alt}
      />
    </a>
  );
};
