import React from 'react';
import { SVGIcon, IconProps } from './SVGIcon';

export const UploadIcon: React.FC<IconProps> = (props) => {
  return (
    <SVGIcon {...props} width={props.width || 64} height={props.height || 64}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="17,8 12,3 7,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </SVGIcon>
  );
};

export const FolderIcon: React.FC<IconProps> = (props) => {
  return (
    <SVGIcon {...props} width={props.width || 48} height={props.height || 48}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </SVGIcon>
  );
};

export const PlayIcon: React.FC<IconProps> = (props) => {
  return (
    <SVGIcon {...props}>
      <polygon points="5,3 19,12 5,21" fill="currentColor"/>
    </SVGIcon>
  );
};

export const InfoIcon: React.FC<IconProps> = (props) => {
  return (
    <SVGIcon {...props} width={props.width || 20} height={props.height || 20}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
      <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2"/>
    </SVGIcon>
  );
};