import { CardMedia } from '@mui/material';
import defaultLogo from 'assets/profile.png';
import React, { useEffect, useState } from 'react';

interface IProps {
  photoUrl?: string;
  size?: 'large' | 'small';
}

export default function ProfileLogo({ photoUrl, size = 'small' }: IProps) {
  const [windowSize, setWindowSize] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    setIsMobile(windowSize < 768);
  }, [windowSize]);

  return (
    <CardMedia
      component="img"
      image={photoUrl || defaultLogo}
      sx={{
        width: size === 'large' ? 64 : isMobile ? 20 : 40,
        height: size === 'large' ? 64 : isMobile ? 20 : 40,
        borderRadius: '100%',
      }}
    />
  );
}
