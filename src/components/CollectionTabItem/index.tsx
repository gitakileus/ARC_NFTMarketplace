import { Box, Typography } from '@mui/material';
import Ether from 'assets/Icon/ether.svg';
import React from 'react';
import { shortenString } from 'utils';

interface IProps {
  image?: string;
  title?: string;
  floorPrice: number;
  selected: boolean;
}

export default function CollectionTabItem(props: IProps) {
  const { image, title, floorPrice } = props;
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        p: 1,
        mb: 2,
        width: '100%',
        border: 1,
        borderColor: props.selected ? '#007AFF' : 'grey.800',
        borderRadius: '10px',
        ':hover': { borderColor: '#007AFF' },
      }}
    >
      <img src={image} alt="collection" style={{ width: 36, height: 36, borderRadius: '100%' }} />
      <Box ml={1}>
        <Typography variant="caption">{title && shortenString(title)}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Floor &nbsp;
          </Typography>
          <img src={Ether} alt="token" style={{ width: '10px', height: 'auto' }} />
          <Typography variant="caption" color="text.white">
            &nbsp; {floorPrice}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
