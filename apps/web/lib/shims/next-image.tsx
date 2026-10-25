import React from "react";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
}

export default function Image({ src, alt, width, height, fill, className, style, ...rest }: ImageProps) {
  const fillStyle: React.CSSProperties = fill
    ? { position: "absolute", height: "100%", width: "100%", inset: 0, objectFit: "cover" }
    : {};

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ ...fillStyle, ...style }}
      {...rest}
    />
  );
}
