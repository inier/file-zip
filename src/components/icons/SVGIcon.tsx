import React from 'react';

export interface IconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  color?: string;
}

interface SVGIconProps extends IconProps {
  children: React.ReactNode;
  viewBox?: string;
}

export const SVGIcon: React.FC<SVGIconProps> = ({
  width = 16,
  height = 16,
  viewBox = "0 0 24 24",
  className,
  color = "currentColor",
  children,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      className={className}
      style={{ color }}
    >
      {children}
    </svg>
  );
};