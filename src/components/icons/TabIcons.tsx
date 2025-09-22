import React from 'react';
import { SVGIcon, IconProps } from './SVGIcon';

export const FilePackageIcon: React.FC<IconProps> = (props) => {
  return (
    <SVGIcon {...props}>
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        ry="2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVGIcon>
  );
};

export const ImageOptimizeIcon: React.FC<IconProps> = (props) => {
  return (
    <SVGIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
      <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2"/>
    </SVGIcon>
  );
};

export const FileExtractIcon: React.FC<IconProps> = (props) => {
  return (
    <SVGIcon {...props}>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="14,2 14,8 20,8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 18v-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 15l3-3 3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVGIcon>
  );
};