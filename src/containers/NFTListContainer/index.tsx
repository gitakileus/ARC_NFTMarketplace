import { Box, Typography, Button } from '@mui/material';
import { nftGetImageLink } from 'hooks/useFetchListCallback';
import React from 'react';
import { Nft, Collection } from 'state/lists/types';

type IProps = {
  items: Nft[];
  collection?: Collection;
};

export default function NFTListContainer({ items, collection }: IProps) {
  const handleImport = async (item: Nft) => {
    console.log('import NFT');
  };
  return (
    <Box sx={{ width: '100%' }}>
      {items.map((item, index) => (
        <Box
          key={item.tokenID}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={2}
          mb={3}
          sx={{ borderBottom: '1px solid #2C2C2C' }}
        >
          <Box display="flex" alignItems="center">
            <img
              src={nftGetImageLink(item)}
              width={56}
              height={56}
              style={{ marginRight: '16px', borderRadius: 10 }}
              alt="list"
            />
            <Box>
              <Typography variant="body1" fontWeight={700}>
                {item.name}
              </Typography>
              <Typography variant="body2" mt={1}>
                {collection?.name}
              </Typography>
            </Box>
          </Box>
          <Button variant="outlined" onClick={() => handleImport(item)} disabled>
            Import
          </Button>
        </Box>
      ))}
    </Box>
  );
}
