import { Box, Button, Container, Typography } from '@mui/material';
import NFTListContainer from 'containers/NFTListContainer';
import { useFetchListCallback } from 'hooks/useFetchListCallback';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletModalToggle } from 'state/application/hooks';
import { useAppSelector } from 'state/hooks';
import { useWeb3 } from 'web3';

const data = [
  {
    id: 1,
    name: '#1234',
    price: 0.5,
    expiryDate: 18,
    description: 'Alpha Betty Doodle',
  },
  {
    id: 2,
    name: '#1234',
    price: 0.5,
    expiryDate: 18,
    description: 'Alpha Betty Doodle',
  },
  {
    id: 3,
    name: '#1234',
    price: 0.5,
    expiryDate: 18,
    description: 'Alpha Betty Doodle',
  },
  {
    id: 4,
    name: '#1234',
    price: 0.5,
    expiryDate: 18,
    description: 'Alpha Betty Doodle',
  },
];
const ImportListing = () => {
  const navigate = useNavigate();
  const fetchList = useFetchListCallback();
  const toggleWalletModal = useWalletModalToggle();
  const { nfts, collections } = useAppSelector((state) => state.lists);
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const { chainId } = useWeb3();

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Container>
      {isAuthenticated ? (
        <Typography variant="h3" marginBottom={2}>
          List NFTS
        </Typography>
      ) : (
        <Typography variant="h5" fontWeight={700} textAlign="center" mb={2}>
          Connect wallet to list
        </Typography>
      )}

      {isAuthenticated ? (
        <Typography variant="body2" color="textSecondary" width={600} mb={5}>
          List your existing NFT items from your wallet to ARC in one easy click. You&apos;ll then be able to set a buy
          now price, accept offers and share your items with the world!
        </Typography>
      ) : (
        <Typography color="textSecondary" textAlign="center" sx={{ maxWidth: 518, ml: 'auto', mr: 'auto', mb: 5 }}>
          List your existing NFT items from your wallet to ARC in one easy click. You&apos;ll then be able to set a buy
          now price, accept offers and share your items with the world!
        </Typography>
      )}
      {isAuthenticated && chainId && (
        <Box mt={9}>
          {Object.keys(nfts[chainId]).map((key) => (
            <NFTListContainer
              key={key}
              items={nfts[chainId][key]}
              collection={collections[chainId].find((x) => x.address === key)}
            />
          ))}
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        {isAuthenticated ? (
          <Button size="large" variant="contained" sx={{ fontWeight: 800 }} onClick={() => navigate(-1)}>
            Finish listing
          </Button>
        ) : (
          <Button size="large" variant="contained" onClick={toggleWalletModal}>
            Connect wallet
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default ImportListing;
