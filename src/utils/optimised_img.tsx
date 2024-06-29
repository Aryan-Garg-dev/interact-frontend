import React from 'react';
import Image from 'next/image';

interface Props {
  src: string;
  dataURL: string;
  alt: string;
  className: string;
  width: number;
  height: number;
  priority?: boolean;
  scales?: string;
}

export default function PlaceholderImg({
  src,
  dataURL,
  alt,
  className,
  width,
  height,
  priority = false,
  scales = '',
}: Props) {
  return (
    <Image
      priority={priority}
      crossOrigin="use-credentials"
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      placeholder="blur"
      blurDataURL={dataURL}
    />
  );
}
