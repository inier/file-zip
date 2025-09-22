import React from 'react';
import { SVGIcon, IconProps } from './SVGIcon';

export const ErrorIcon: React.FC<IconProps> = (props) => {
  return (
    <SVGIcon {...props} width={props.width || 20} height={props.height || 20}>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="15"
        y1="9"
        x2="9"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="9"
        y1="9"
        x2="15"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
      />
    </SVGIcon>
  );
};