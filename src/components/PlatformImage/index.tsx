import ARC from 'assets/platform/arc.png';
import looksrare from 'assets/platform/looksrare.png';
import opensea from 'assets/platform/opensea.png';
import rarible from 'assets/platform/rarible.png';
import React from 'react';

interface IProps {
  platform: string | undefined;
}

export default function PlatformImage(props: IProps) {
  const { platform } = props;
  if (platform === 'ARC')
    return <img src={ARC} alt={platform} width={32} height={32} style={{ borderRadius: '100%' }} />;
  else if (platform === 'Opensea')
    return <img src={opensea} alt={platform} width={32} height={32} style={{ borderRadius: '100%' }} />;
  else if (platform === 'Looksrare')
    return <img src={looksrare} alt={platform} width={32} height={32} style={{ borderRadius: '100%' }} />;
  else if (platform === 'Rarible')
    return <img src={rarible} alt={platform} width={32} height={32} style={{ borderRadius: '100%' }} />;

  return null;
}
